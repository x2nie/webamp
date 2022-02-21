import * as Utils from "./utils";
import { gql } from "./utils";
import TinderCard from "react-tinder-card";
import { API_URL, USE_GRAPHQL } from "./constants";
import React, { useState, useEffect } from "react";

function warmScreenshotImage(hash) {
  const screenshotUrl = Utils.screenshotUrlFromHash(hash);
  new Image().src = screenshotUrl;
}

const mutation = gql`
  query GetSkinToReview {
    skin_to_review {
      filename
      md5
    }
  }
`;

async function getSkinToReview() {
  if (USE_GRAPHQL) {
    const data = await Utils.fetchGraphql(mutation);
    return data.skin_to_review;
  } else {
    const response = await fetch(
      `${API_URL}/to_review?cacheBust=${Math.random()}`,
      {
        mode: "cors",
        credentials: "include",
      }
    );
    if (response.status === 403) {
      window.location = `${API_URL}/auth`;
    }
    return response.json();
  }
}

function useQueuedSkin() {
  const [queue, setQueue] = useState([]);
  function remove() {
    setQueue((queue) => {
      const newQueue = [...queue];
      newQueue.shift();
      return newQueue;
    });
  }

  useEffect(() => {
    if (queue.length > 10) {
      return;
    }
    let canceled = false;
    getSkinToReview().then((response) => {
      if (canceled) {
        return;
      }
      warmScreenshotImage(response.md5);
      setQueue((queue) => [...queue, response]);
    });

    return () => (canceled = true);
  }, [queue]);

  return [queue, remove];
}

async function approveSkin(md5) {
  if (USE_GRAPHQL) {
    const mutation = gql`
      mutation ApproveSkin($md5: String!) {
        approve_skin(md5: $md5)
      }
    `;
    await Utils.fetchGraphql(mutation, { md5 });
  } else {
    await restReview("approve", md5);
  }
}

async function rejectSkin(md5) {
  if (USE_GRAPHQL) {
    const mutation = gql`
      mutation RejectSkin($md5: String!) {
        reject_skin(md5: $md5)
      }
    `;
    await Utils.fetchGraphql(mutation, { md5 });
  } else {
    await restReview("reject", md5);
  }
}

async function markSkinNSFW(md5) {
  if (USE_GRAPHQL) {
    const mutation = gql`
      mutation markSkinNSFW($md5: String!) {
        mark_skin_nsfw(md5: $md5)
      }
    `;
    await Utils.fetchGraphql(mutation, { md5 });
  } else {
    await restReview("nsfw", md5);
  }
}

async function restReview(action, md5) {
  const response = await fetch(`${API_URL}/skins/${md5}/${action}`, {
    method: "POST",
    mode: "cors",
    credentials: "include",
  });

  if (response.status === 403) {
    window.location = `${API_URL}/auth`;
  }
}

export default function ReviewPage() {
  const [skins, remove] = useQueuedSkin();
  async function approve(skin) {
    remove();
    await approveSkin(skin.md5);
  }
  async function reject(skin) {
    remove();
    await rejectSkin(skin.md5);
  }

  async function nsfw(skin) {
    remove();
    await markSkinNSFW(skin.md5);
  }

  useEffect(() => {
    if (skins.length === 0) {
      return;
    }
    function handleKeypress(e) {
      switch (e.key) {
        case "ArrowUp":
          approve(skins[0]);
          break;
        case "ArrowDown":
          reject(skins[0]);
          break;
        case "n":
        case "N":
          nsfw(skins[0]);
          break;
        default:
        // noop
      }
    }
    document.body.addEventListener("keydown", handleKeypress);
    return () => {
      document.body.removeEventListener("keydown", handleKeypress);
    };
  });

  function swiped(dir, skin) {
    switch (dir) {
      case "left":
        reject(skin);
        break;
      case "right":
        approve(skin);
        break;
      default:
    }
    console.log({ dir, skin });
  }

  function outOfFrame(skin) {
    console.log("out of frame", { skin });
  }
  if (skins.length === 0) {
    return <h2 style={{ color: "white" }}>Loading...</h2>;
  }

  const reverseSkins = [...skins].reverse();

  return (
    <div style={{ color: "white", display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: 500, position: "relative" }}>
        <h2>{skins[0].filename}</h2>
        <div style={{ height: 20 }}>
          <button onClick={() => approve(skins[0])}>{"👍"} Approve</button>
          <button onClick={() => reject(skins[0])}>{"👎"} Reject</button>
          <button onClick={() => nsfw(skins[0])}>{"🔞"} NSFW</button>
        </div>
        <p>
          Press up arrow to approve, down arrow to reject or "n" to mark as
          NSFW.
        </p>
        {reverseSkins.map((skin) => {
          return (
            <TinderCard
              className="tinder-card"
              key={skin.md5}
              onSwipe={(dir) => swiped(dir, skin)}
              onCardLeftScreen={() => outOfFrame(skin)}
              preventSwipe={["up", "down"]}
            >
              <img
                style={{
                  width: "100%",
                  imageRendering: "pixelated",
                }}
                src={Utils.screenshotUrlFromHash(skin.md5)}
                alt={skin.filename}
              />
            </TinderCard>
          );
        })}
        <br />
      </div>
    </div>
  );
}
