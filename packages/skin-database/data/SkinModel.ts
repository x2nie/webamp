import { getScreenshotUrl, getSkinUrl } from "./skins";
import {
  TweetStatus,
  SkinRow,
  ReviewRow,
  UploadStatus,
  SkinType,
} from "../types";
import UserContext, { ctxWeakMapMemoize } from "./UserContext";
import TweetModel, { TweetDebugData } from "./TweetModel";
import IaItemModel, { IaItemDebugData } from "./IaItemModel";
import FileModel, { FileDebugData } from "./FileModel";
import { MD5_REGEX, withUrlAsTempFile } from "../utils";
import DataLoader from "dataloader";
import { knex } from "../db";
import UploadModel, { UploadDebugData } from "./UploadModel";
import ArchiveFileModel, { ArchiveFileDebugData } from "./ArchiveFileModel";
import * as Skins from "./skins";
import fetch from "node-fetch";
import JSZip from "jszip";
import fs from "fs/promises";
import path from "path";

export const IS_README = /(file_id\.diz)|(\.txt)$/i;
// Skinning Updates.txt ?
export const IS_NOT_README =
  /(genex\.txt)|(genexinfo\.txt)|(gen_gslyrics\.txt)|(region\.txt)|(pledit\.txt)|(viscolor\.txt)|(winampmb\.txt)|("gen_ex help\.txt)|(mbinner\.txt)$/i;

export default class SkinModel {
  constructor(readonly ctx: UserContext, readonly row: SkinRow) {}

  static async fromMd5(
    ctx: UserContext,
    md5: string
  ): Promise<SkinModel | null> {
    const row = await getSkinLoader(ctx).load(md5);
    return row == null ? null : new SkinModel(ctx, row);
  }

  static async fromMd5Assert(
    ctx: UserContext,
    md5: string
  ): Promise<SkinModel> {
    const skin = await SkinModel.fromMd5(ctx, md5);
    if (skin == null) {
      throw new Error(`Expected to find skin with md5 "${md5}".`);
    }
    return skin;
  }

  static async fromAnything(
    ctx: UserContext,
    anything: string
  ): Promise<SkinModel | null> {
    const md5Match = anything.match(MD5_REGEX);
    if (md5Match != null) {
      const md5 = md5Match[1];
      const found = await SkinModel.fromMd5(ctx, md5);
      if (found != null) {
        return found;
      }
    }
    const iaItem = await IaItemModel.fromAnything(ctx, anything);
    if (iaItem != null) {
      return iaItem.getSkin();
    }
    const tweet = await TweetModel.fromAnything(ctx, anything);
    if (tweet != null) {
      return tweet.getSkin();
    }
    return null;
  }

  static async exists(ctx: UserContext, md5: string): Promise<boolean> {
    const row = await getSkinLoader(ctx).load(md5);
    return row != null;
  }

  getSkinType(): SkinType {
    switch (this.row.skin_type) {
      case 1:
        return "CLASSIC";
      case 2:
        return "MODERN";
    }
    throw new Error(`Unknown skin_type ${this.row.skin_type}`);
  }

  getId(): number {
    return this.row.id;
  }

  async tweeted(): Promise<boolean> {
    return (await this.getTweet()) != null;
  }

  async getTweet(): Promise<TweetModel | null> {
    const tweets = await this.getTweets();
    return tweets[0] || null;
  }

  async getTweets(): Promise<TweetModel[]> {
    return TweetModel.fromMd5(this.ctx, this.row.md5);
  }

  getIaItem(): Promise<IaItemModel | null> {
    return IaItemModel.fromMd5(this.ctx, this.row.md5);
  }

  getReviews(): Promise<ReviewRow[]> {
    return getReviewsLoader(this.ctx).load(this.row.md5);
  }

  getFiles(): Promise<FileModel[]> {
    return FileModel.fromMd5(this.ctx, this.row.md5);
  }

  getArchiveFiles(): Promise<ArchiveFileModel[]> {
    return ArchiveFileModel.fromMd5(this.ctx, this.row.md5);
  }

  getUploadStatuses(): Promise<UploadModel[]> {
    return UploadModel.fromMd5(this.ctx, this.row.md5);
  }

  async getUploadStatus(): Promise<UploadStatus | null> {
    const status = await Skins.getUploadStatuses([this.row.md5]);
    return (status[this.getMd5()] as UploadStatus) || null;
  }

  async getIsNsfw(): Promise<boolean> {
    const reviews = await this.getReviews();
    return reviews.some((review) => review.review === "NSFW");
  }

  async getTweetStatus(): Promise<TweetStatus> {
    const tweet = await this.getTweet();
    if (tweet != null) {
      return "TWEETED";
    }
    const reviewRows = await this.getReviews();
    const reviews = new Set(reviewRows.map((row) => row.review));
    if (reviews.has("NSFW")) {
      return "NSFW";
    }
    if (reviews.has("REJECTED")) {
      return "REJECTED";
    }
    if (reviews.has("APPROVED")) {
      return "APPROVED";
    }

    return "UNREVIEWED";
  }

  async getFileName(): Promise<string> {
    const files = await this.getFiles();
    if (files.length === 0) {
      throw new Error(`Could not find file for skin with md5 ${this.getMd5()}`);
    }
    const filename = files[0].getFileName();
    if (!filename.match(/\.(zip)|(wsz)$/i)) {
      throw new Error("Expected filename to end with zip or wsz.");
    }
    return filename;
  }

  async getScreenshotFileName(): Promise<string> {
    const skinFilename = await this.getFileName();
    return skinFilename.replace(/\.(wsz|zip)$/, ".png");
  }

  getMd5(): string {
    return this.row.md5;
  }

  getEmails(): string[] {
    const { emails } = this.row;
    return emails ? emails.split(" ") : [];
  }

  async getReadme(): Promise<string | null> {
    const files = await this.getArchiveFiles();
    const readme = files.find((file) => {
      const filename = file.getFileName();
      return IS_README.test(filename) && !IS_NOT_README.test(filename);
    });

    if (readme == null) {
      return null;
    }
    return readme.getTextContent();
  }

  getMuseumUrl(): string {
    return `https://skins.webamp.org/skin/${this.row.md5}`;
  }
  getWebampUrl(): string {
    return `https://webamp.org?skinUrl=${this.getSkinUrl()}`;
  }
  getScreenshotUrl(): string {
    return getScreenshotUrl(this.row.md5);
  }
  getSkinUrl(): string {
    return getSkinUrl(this.row.md5);
  }

  getAverageColor(): string {
    return this.row.average_color;
  }

  getBuffer = mem(async (): Promise<Buffer> => {
    if (process.env.LOCAL_FILE_CACHE) {
      const skinPath = path.join(
        process.env.LOCAL_FILE_CACHE,
        "skins",
        this.getMd5() + ".wsz"
      );
      return fs.readFile(skinPath);
    } else {
      const response = await fetch(this.getSkinUrl());
      if (!response.ok) {
        throw new Error(`Could not fetch skin at "${this.getSkinUrl()}"`);
      }
      return response.buffer();
    }
  });

  getScreenshotBuffer = mem(async (): Promise<Buffer> => {
    const response = await fetch(this.getScreenshotUrl());
    if (!response.ok) {
      throw new Error(
        `Could not fetch skin screenshot at "${this.getScreenshotUrl()}"`
      );
    }
    return response.buffer();
  });

  async withTempFile(cb: (file: string) => Promise<void>): Promise<void> {
    const filename = await this.getFileName();

    return withUrlAsTempFile(this.getSkinUrl(), filename, cb);
  }

  async withScreenshotTempFile(
    cb: (file: string) => Promise<void>
  ): Promise<void> {
    const screenshotFilename = await this.getScreenshotFileName();
    return withUrlAsTempFile(this.getScreenshotUrl(), screenshotFilename, cb);
  }

  getZip = mem(async (): Promise<JSZip> => {
    const buffer = await this.getBuffer();
    return JSZip.loadAsync(buffer);
  });

  async debug(): Promise<{
    row: SkinRow;
    reviews: ReviewRow[];
    tweets: TweetDebugData[];
    files: FileDebugData[];
    archiveFiles: ArchiveFileDebugData[];
    iaItem: IaItemDebugData | null;
    uploadStatuses: UploadDebugData[];
  }> {
    const tweets = await this.getTweets();
    const files = await this.getFiles();
    const archiveFiles = await this.getArchiveFiles();
    const iaItem = await this.getIaItem();
    const uploadStatuses = await this.getUploadStatuses();
    return {
      row: this.row,
      reviews: await this.getReviews(),
      tweets: await Promise.all(tweets.map((tweet) => tweet.debug())),
      files: await Promise.all(files.map((file) => file.debug())),
      archiveFiles: await Promise.all(archiveFiles.map((file) => file.debug())),
      uploadStatuses: await Promise.all(
        uploadStatuses.map((upload) => upload.debug())
      ),
      iaItem: iaItem == null ? null : await iaItem.debug(),
    };
  }
}

const getSkinLoader = ctxWeakMapMemoize<DataLoader<string, SkinRow | null>>(
  () =>
    new DataLoader(async (md5s) => {
      const rows = await knex("skins").whereIn("md5", md5s).select();
      return md5s.map((md5) => rows.find((x) => x.md5 === md5));
    })
);

const getReviewsLoader = ctxWeakMapMemoize<DataLoader<string, ReviewRow[]>>(
  () =>
    new DataLoader(async (md5s) => {
      const rows = await knex("skin_reviews")
        .whereIn("skin_md5", md5s)
        .select();
      return md5s.map((md5) => rows.filter((x) => x.skin_md5 === md5));
    })
);

function mem<T>(fn: () => T): () => T {
  let cached: T | null = null;
  return () => {
    if (cached == null) {
      cached = fn();
    }
    return cached;
  };
}
