import { knex } from "../db";
import path from "path";
import md5Hash from "md5";
import { searchIndex } from "../algolia";
import { truncate } from "../utils";
import fetch from "node-fetch";
import * as S3 from "../s3";
import * as CloudFlare from "../CloudFlare";
import SkinModel from "./SkinModel";
import UserContext from "./UserContext";
import TweetModel from "./TweetModel";

export const SKIN_TYPE = {
  CLASSIC: 1,
  MODERN: 2,
  PACK: 3,
  INVALID: 4,
};

export function getSkinUrl(md5: string): string {
  return `https://cdn.webampskins.org/skins/${md5}.wsz`;
}

export function getScreenshotUrl(md5: string): string {
  return `https://cdn.webampskins.org/screenshots/${md5}.png`;
}

export async function addSkin({
  md5,
  filePath,
  uploader,
  modern,
}: {
  md5: string;
  filePath: string;
  uploader: string;
  modern: boolean;
}) {
  await knex("skins").insert(
    {
      md5,
      skin_type: modern ? SKIN_TYPE.MODERN : SKIN_TYPE.CLASSIC,
    },
    []
  );
  await knex("files").insert(
    {
      skin_md5: md5,
      file_path: filePath,
      source_attribution: uploader,
    },
    []
  );
}

const CRUFT_FILENAME = /winampskins\.info\.(html)|(txt)$/;

export async function setContentHash(md5: string): Promise<string | null> {
  const files = await knex("archive_files").where("skin_md5", md5).select();
  if (files.length === 0) {
    return null;
  }

  const contentHash = md5Hash(
    files
      .filter(({ file_name }) => !CRUFT_FILENAME.test(file_name))
      .map(({ file_name, file_md5 }) => `${file_name}:${file_md5}`)
      .sort()
      .join("|")
  );

  await knex("skins").update({ content_hash: contentHash }).where("md5", md5);
  return contentHash;
}

export async function getTweetableSkinCount(): Promise<number> {
  const tweetable = await knex("skins")
    .leftJoin("skin_reviews", "skin_reviews.skin_md5", "=", "skins.md5")
    .leftJoin("tweets", "tweets.skin_md5", "=", "skins.md5")
    .where({
      "tweets.id": null,
      skin_type: 1,
      "skin_reviews.review": "APPROVED",
    })
    .count("skins.id", { as: "count" })
    .first();
  return Number(tweetable?.count ?? 0);
}

export async function getClassicSkinCount(): Promise<number> {
  const rows = await knex("skins")
    .where({ skin_type: 1 })
    .count({ count: "*" });
  const row = rows[0];
  if (row == null || row.count == null) {
    throw new Error("Could not find count row");
  }
  const { count } = row;
  if (count == null) {
    throw new Error("Could not find count");
  }
  return Number(count);
}

export async function markAsTweeted(
  md5: string,
  tweetId: string
): Promise<void> {
  await knex("tweets").insert({ skin_md5: md5, tweet_id: tweetId }, []);
}

export async function markAsPostedToInstagram(
  md5: string,
  postId: string,
  url: string
): Promise<void> {
  await knex("instagram_posts").insert(
    { skin_md5: md5, post_id: postId, url },
    []
  );
}

// TODO: Also path actor
export async function markAsNSFW(ctx: UserContext, md5: string): Promise<void> {
  const index = { objectID: md5, nsfw: true };
  // TODO: Await here, but for some reason this never completes
  await searchIndex.partialUpdateObjects([index]);
  await recordSearchIndexUpdates(md5, Object.keys(index));
  await knex("skin_reviews").insert(
    { skin_md5: md5, review: "NSFW", reviewer: ctx.username || "UNKNOWN" },
    []
  );
}

export async function getUploadStatuses(
  md5s: string[]
): Promise<{ [md5: string]: string }> {
  const skins = await knex("skin_uploads")
    .whereIn("skin_md5", md5s)
    .orderBy("id", "desc")
    .select("skin_md5", "status");

  const statuses: { [md5: string]: string } = {};
  skins.forEach(({ skin_md5, status }) => {
    statuses[skin_md5] = status;
  });

  return statuses;
}

type SearchIndex = {
  objectID: string;
  md5: string;
  nsfw: boolean;
  fileName: string;
  twitterLikes: number;
};

async function getSearchIndexes(
  ctx: UserContext,
  md5s: string[]
): Promise<SearchIndex[]> {
  const skins = await Promise.all(
    md5s.map((md5) => {
      return SkinModel.fromMd5Assert(ctx, md5);
    })
  );

  return Promise.all(
    skins.map(async (skin) => {
      const readmeText = await skin.getReadme();
      const tweets = await skin.getTweets();
      const likes = tweets.reduce((acc: number, tweet: TweetModel) => {
        return Math.max(acc, tweet.getLikes());
      }, 0);
      return {
        objectID: skin.getMd5(),
        md5: skin.getMd5(),
        nsfw: await skin.getIsNsfw(),
        readmeText: readmeText ? truncate(readmeText, 4800) : null,
        fileName: await skin.getFileName(),
        twitterLikes: likes,
      };
    })
  );
}

export async function updateSearchIndexs(
  ctx: UserContext,
  md5s: string[]
): Promise<any> {
  const skinIndexes = await getSearchIndexes(ctx, md5s);

  const results = await searchIndex.partialUpdateObjects(skinIndexes, {
    createIfNotExists: true,
  });

  for (const index of skinIndexes) {
    await recordSearchIndexUpdates(index.md5, Object.keys(index));
  }
  return results;
}

export async function updateSearchIndex(
  ctx: UserContext,
  md5: string
): Promise<any | null> {
  return updateSearchIndexs(ctx, [md5]);
}

// Note: This might leave behind some files in file_info.
export async function deleteSkin(md5: string): Promise<void> {
  console.log(`Deleting skin ${md5}...`);
  console.log(`... sqlite "skins"`);
  await knex("skins").where({ md5 }).limit(1).delete();
  console.log(`... sqlite "refreshes"`);
  await knex("refreshes").where({ skin_md5: md5 }).delete();
  console.log(`... sqlite "files"`);
  await knex("files").where({ skin_md5: md5 }).delete();
  console.log(`... sqlite "skin_reviews"`);
  await knex("skin_reviews").where({ skin_md5: md5 }).delete();
  console.log(`... sqlite "ia_items"`);
  await knex("ia_items").where({ skin_md5: md5 }).delete();
  console.log(`... sqlite "archive_files"`);
  await knex("archive_files").where({ skin_md5: md5 }).delete();
  console.log(`... sqlite "tweets"`);
  await knex("tweets").where({ skin_md5: md5 }).delete();
  console.log(`... sqlite "algolia_field_updates"`);
  await knex("algolia_field_updates").where({ skin_md5: md5 }).delete();
  console.log(`... sqlite "skin_uploads"`);
  await knex("skin_uploads").where({ skin_md5: md5 }).delete();
  console.log(`... sqlite "screenshot_updates"`);
  await knex("screenshot_updates").where({ skin_md5: md5 }).delete();
  console.log(`... removing from Algolia index`);
  await searchIndex.deleteObjects([md5]);
  console.log(`... removing skin from S3`);
  await S3.deleteSkin(md5);
  console.log(`... removing screenshot from S3`);
  await S3.deleteScreenshot(md5);
  console.log(`... purging screenshot and skin from CloudFlare`);
  await CloudFlare.purgeFiles([getScreenshotUrl(md5), getSkinUrl(md5)]);
  console.log(`Done deleting skin ${md5}.`);
}

export async function recordScreenshotUpdate(
  md5: string,
  errorMessage?: string
) {
  // TODO: Could this invalidate the CloudFlare cache?
  const update_timestamp = Math.floor(Date.now() / 1000);

  await knex("screenshot_updates").insert([
    {
      skin_md5: md5,
      update_timestamp,
      success: errorMessage == null,
      error_message: errorMessage,
    },
  ]);
}

export async function getSkinsToShoot(limit: number): Promise<string[]> {
  // TODO: Once return an ordered list here of skins that have no record,
  // followed by skins that have not been shot in a long time.
  const results = await knex("skins")
    .leftJoin(
      "screenshot_updates",
      "skins.md5",
      "=",
      "screenshot_updates.skin_md5"
    )
    .where("screenshot_updates.id", null)
    .limit(limit)
    .select(["md5"]);
  return results.map((row) => row.md5);
}

export async function recordSearchIndexUpdates(
  md5: string,
  fields: string[]
): Promise<void> {
  const update_timestamp = Math.floor(Date.now() / 1000);

  await knex("algolia_field_updates").insert(
    fields.map((field) => ({
      skin_md5: md5,
      update_timestamp,
      field,
    }))
  );
}

export async function getReportedUpload(): Promise<{
  skin_md5: string;
  id: string;
  filename: string;
} | null> {
  const found = await knex("skin_uploads")
    .where("status", "UPLOAD_REPORTED")
    .first(["skin_md5", "id", "filename"]);
  return found || null;
}

export async function getErroredUpload(): Promise<{
  skin_md5: string;
  id: string;
  filename: string;
} | null> {
  const found = await knex("skin_uploads")
    .where("status", "ERRORED")
    .first(["skin_md5", "id", "filename"]);
  return found || null;
}

export async function recordUserUploadComplete(
  md5: string,
  id: string
): Promise<void> {
  await knex("skin_uploads")
    .where({ skin_md5: md5, id, status: "URL_REQUESTED" })
    .update({ status: "UPLOAD_REPORTED" }, [id])
    .limit(1);
}

export async function recordUserUploadArchived(id: string): Promise<void> {
  await knex("skin_uploads")
    .where({ id })
    .update({ status: "ARCHIVED" }, [id])
    .limit(1);
}

export async function recordUserUploadErrored(id: string): Promise<void> {
  await knex("skin_uploads")
    .where({ id })
    .update({ status: "ERRORED" }, [id])
    .limit(1);
}

export async function recordUserUploadRequest(
  md5: string,
  filename: string
): Promise<string> {
  const record = await knex("skin_uploads").insert(
    { skin_md5: md5, status: "URL_REQUESTED", filename },
    ["id"]
  );
  return record[0];
}

// TODO: Also path actor
export async function approve(ctx: UserContext, md5: string): Promise<void> {
  await knex("skin_reviews").insert(
    { skin_md5: md5, review: "APPROVED", reviewer: ctx.username || "UNKNOWN" },
    []
  );
}

// TODO: Also path actor
export async function reject(ctx: UserContext, md5: string): Promise<void> {
  await knex("skin_reviews").insert(
    { skin_md5: md5, review: "REJECTED", reviewer: ctx.username || "UNKNOWN" },
    []
  );
}

export async function getSkinToReview(): Promise<{
  filename: string | null;
  md5: string;
}> {
  const skins = await knex("skins")
    .leftJoin("skin_reviews", "skin_reviews.skin_md5", "=", "skins.md5")
    .leftJoin("tweets", "tweets.skin_md5", "=", "skins.md5")
    .innerJoin("files", "files.skin_md5", "=", "skins.md5")
    .select("skins.md5", "files.file_path")
    .where({ "skin_reviews.id": null, "tweets.id": null, "skins.skin_type": 1 })
    // TODO: Remove this once we run out of skins that don't have it.
    .whereNot("emails", "like", "%Dr.Algebra@gmx.de%")
    .orderByRaw("random()")
    .limit(1);
  if (!skins.length) {
    throw new Error("Could not find any skins to review");
  }
  const skin = skins[0];
  return { filename: path.basename(skin.file_path), md5: skin.md5 };
}

export async function getSkinToTweet(): Promise<{
  md5: string;
  canonicalFilename: string;
} | null> {
  // TODO: This does not account for skins that have been both approved and rejected
  const tweetables = await knex("skins")
    .leftJoin("skin_reviews", "skin_reviews.skin_md5", "=", "skins.md5")
    .leftJoin("tweets", "tweets.skin_md5", "=", "skins.md5")
    .leftJoin("files", "files.skin_md5", "=", "skins.md5")
    .leftJoin("refreshes", "refreshes.skin_md5", "=", "skins.md5")
    .where({
      "tweets.id": null,
      skin_type: 1,
      "skin_reviews.review": "APPROVED",
      "refreshes.error": null,
    })
    .groupBy("skins.md5")
    .select(["skins.md5", "files.file_path"])
    .orderByRaw("random()")
    .limit(1);
  const skin = tweetables[0];
  if (skin == null) {
    return null;
  }
  return { md5: skin.md5, canonicalFilename: path.basename(skin.file_path) };
}

export async function getSkinToPostToInstagram(): Promise<string | null> {
  // TODO: This does not account for skins that have been both approved and rejected
  const tweetables = await knex("skins")
    .leftJoin("skin_reviews", "skin_reviews.skin_md5", "=", "skins.md5")
    .leftJoin("instagram_posts", "instagram_posts.skin_md5", "=", "skins.md5")
    .leftJoin("refreshes", "refreshes.skin_md5", "=", "skins.md5")
    .where({
      "instagram_posts.id": null,
      skin_type: 1,
      "skin_reviews.review": "APPROVED",
      "refreshes.error": null,
    })
    .groupBy("skins.md5")
    .orderByRaw("random()")
    .limit(1);
  const skin = tweetables[0];
  if (skin == null) {
    return null;
  }
  return skin.md5;
}

export async function getUnreviewedSkinCount(): Promise<number> {
  const rows = await knex("skins")
    .where({ skin_type: 1 })
    .whereNotIn("md5", knex("skin_reviews").select("skin_md5"))
    .count("*", { as: "unreviewed" });
  return Number(rows[0].unreviewed);
}

export async function getApprovedSkinCount(): Promise<number> {
  const row = await knex("skin_reviews")
    .first(knex.raw(`COUNT(DISTINCT skin_md5) AS "approved_count"`))
    .where({ review: "APPROVED" });
  return Number(row.approved_count);
}

export async function getRejectedSkinCount(): Promise<number> {
  const row = await knex("skin_reviews")
    .first(knex.raw(`COUNT(DISTINCT skin_md5) AS "rejected_count"`))
    .where({ review: "REJECTED" });
  return Number(row.rejected_count);
}

export async function getNsfwSkinCount(): Promise<number> {
  const row = await knex("skin_reviews")
    .first(knex.raw(`COUNT(DISTINCT skin_md5) AS "nsfw_count"`))
    .where({ review: "NSFW" });
  return Number(row.nsfw_count);
}

export async function getTweetedSkinCount(): Promise<number> {
  const rows = await knex("tweets").count("*", { as: "tweeted" });
  return Number(rows[0].tweeted);
}

export async function getWebUploadsCount(): Promise<number> {
  const rows = await knex("files")
    .where("source_attribution", "Web API")
    .count("*", { as: "uploads" });
  return Number(rows[0].uploads);
}

export async function getUploadsAwaitingProcessingCount(): Promise<number> {
  const rows = await knex("skin_uploads")
    .where("status", "UPLOAD_REPORTED")
    .count("*", { as: "uploads" });
  return Number(rows[0].uploads);
}

export async function getUploadsErroredCount(): Promise<number> {
  const rows = await knex("skin_uploads")
    .where("status", "ERRORED")
    .count("*", { as: "uploads" });
  return Number(rows[0].uploads);
}

export async function getStats(): Promise<{
  approved: number;
  rejected: number;
  nsfw: number;
  tweeted: number;
  tweetable: number;
  webUploads: number;
  uploadsAwaitingProcessing: number;
  uploadsErrored: number;
}> {
  return {
    approved: await getApprovedSkinCount(),
    rejected: await getRejectedSkinCount(),
    nsfw: await getNsfwSkinCount(),
    tweeted: await getTweetedSkinCount(),
    tweetable: await getTweetableSkinCount(),
    webUploads: await getWebUploadsCount(),
    uploadsAwaitingProcessing: await getUploadsAwaitingProcessingCount(),
    uploadsErrored: await getUploadsErroredCount(),
  };
}

export async function getScreenshotBuffer(md5: string): Promise<Buffer> {
  const ctx = new UserContext();
  const exists = await SkinModel.exists(ctx, md5);
  if (!exists) {
    throw new Error(`Could not find skin with hash ${md5}`);
  }

  const screenshotUrl = getScreenshotUrl(md5);
  const screenshotResponse = await fetch(screenshotUrl);
  if (!screenshotResponse.ok) {
    throw new Error(`Could not get screenshot at ${screenshotUrl}`);
  }
  return screenshotResponse.buffer();
}

export async function setTweetInfo(
  md5: string | null,
  likes: number,
  retweets: number,
  tweetId: string
): Promise<boolean> {
  const first = await knex("tweets")
    .where({ tweet_id: tweetId })
    .first(["likes", "retweets"]);
  if (first == null) {
    if (md5 == null) {
      return false;
    }
    await knex("tweets").insert(
      {
        skin_md5: md5,
        tweet_id: tweetId,
        likes,
        retweets,
      },
      []
    );
    return true;
  }

  if (first.likes !== likes || first.retweets !== retweets) {
    await knex("tweets")
      .where({ tweet_id: tweetId })
      .update({ tweet_id: tweetId, likes, retweets }, []);
  }
  return true;
}

export type MuseumPage = Array<{
  color: string;
  fileName: string;
  md5: string;
  nsfw: boolean;
}>;

export async function getMuseumPage({
  offset,
  first,
}: {
  offset: number;
  first: number;
}): Promise<MuseumPage> {
  const skins = await knex.raw(
    `
SELECT skins.md5, 
  skin_reviews.review = 'NSFW'     AS nsfw, 
  skin_reviews.review = 'APPROVED' AS approved, 
  skin_reviews.review = 'REJECTED' AS rejected, 
  (IFNULL(tweets.likes, 0) + (IFNULL(tweets.retweets,0) * 1.5)) AS tweet_score,
	files.file_path,
  CASE skins.md5 
    WHEN "5e4f10275dcb1fb211d4a8b4f1bda236" THEN 0 -- Base
    WHEN "cd251187a5e6ff54ce938d26f1f2de02" THEN 1 -- Winamp3 Classified
    WHEN "b0fb83cc20af3abe264291bb17fb2a13" THEN 2 -- Winamp5 Classified
    WHEN "d6010aa35bed659bc1311820daa4b341" THEN 3 -- Bento Classified
    ELSE 1000
    END
  priority
FROM skins 
  LEFT JOIN (
    SELECT 
      skin_md5,
      MAX(likes) as likes,
      MAX(retweets) as retweets
    FROM tweets
    GROUP BY skin_md5
    ) as tweets ON tweets.skin_md5 = skins.md5 
  LEFT JOIN skin_reviews ON skin_reviews.skin_md5 = skins.md5
	LEFT JOIN files ON files.skin_md5 = skins.md5
  LEFT JOIN refreshes ON refreshes.skin_md5 = skins.md5
WHERE  skin_type = 1 AND refreshes.error IS NULL
--
-- WHERE 
--  skin_type = 1
--  AND refreshes.error IS NULL
--  AND skins.md5 != "d7541f8c5be768cf23b9aeee1d6e70c7" -- Duplicate Garfield
--  AND skins.md5 != "25a932542e307416ca86da4e16be1b32" -- Duplicate Vault-tec
--  AND skins.md5 != "89643da06361e4bcc269fe811f07c4a3" -- Another duplicate Vault-tec
--  AND skins.md5 != "db1f2e128f6dd6c702b7a448751fbe84" -- Duplicate Fallout
--  AND skins.md5 != "be2de111c4710af306fea0813440f275" -- Duplicate Microchip
--  AND skins.md5 != "66cf0af3593d79fc8a5080dd17f8b07d" -- Another duplicate Microchip
GROUP BY skins.md5
ORDER BY 
  priority ASC,
  tweet_score DESC, 
  nsfw ASC, 
  approved DESC, 
  rejected ASC
LIMIT ? offset ?`,
    [first, offset]
  );

  return skins.map(({ md5, nsfw, file_path }) => {
    return {
      fileName: path.basename(file_path),
      md5,
      nsfw: Boolean(nsfw),
    };
  });
}

export async function getAllClassicSkins(): Promise<
  Array<{ fileName: string; md5: string }>
> {
  const skins = await knex.raw(
    `
SELECT skins.md5, 
	files.file_path
FROM   skins 
	LEFT JOIN files ON files.skin_md5 = skins.md5
WHERE  skin_type = 1 
GROUP BY skins.md5`,
    []
  );

  return skins.map(({ md5, file_path }) => {
    if (file_path == null) {
      throw new Error(`Could not find a file path for skin with md5 "${md5}"`);
    }
    return {
      fileName: path.basename(file_path),
      md5: md5,
    };
  });
}

export async function getAllApproved(): Promise<Array<string>> {
  const skins = await knex("skins")
    .leftJoin("skin_reviews", "skin_reviews.skin_md5", "=", "skins.md5")
    .where("review", "APPROVED")
    .select("md5");

  return skins.map(({ md5 }) => md5);
}

export async function getAllClassicScreenshotUrls(): Promise<
  Array<{ fileName: string; url: string }>
> {
  const skins = await knex.raw(
    `
SELECT skins.md5, 
	files.file_path,
  skin_reviews.review
FROM   skins 
	LEFT JOIN files ON files.skin_md5 = skins.md5
	LEFT JOIN skin_reviews ON skin_reviews.skin_md5 = skins.md5 AND skin_reviews.review = "NSFW"
WHERE  skin_type = 1 
GROUP BY skins.md5`,
    []
  );

  return skins.map(({ md5, file_path, review }) => {
    return {
      md5,
      nsfw: review != null,
      fileName: path.basename(file_path),
      url: getScreenshotUrl(md5),
    };
  });
}
