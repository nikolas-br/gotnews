////////////////////////////////////////////////////////////////
// Provides API for retrieving feeds from backend
////////////////////////////////////////////////////////////////
import * as CONST from "./constants";
import { Feed, FeedReq } from "./types";

export const getFeed = async (
  url: string,
  avatarText: string,
  avatarThumbnail: string
): Promise<Map<string, Feed>> => {
  let feedObj: FeedReq;
  feedObj = { data: [{ link: url, avatarText, avatarThumbnail }] };

  return new Promise((resolve, reject) => {
    fetch(CONST.API_ADRESS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedObj),
    })
      .then((result) => result.json())
      .then((json) => {
        if (json.length === 0) {
          reject(new Error("Feed cannot be loaded"));
          return;
        }
        let map = new Map();

        for (let entry of json) map.set(entry.link, entry);

        resolve(map);
      });
  });
};

export const getAllFeeds = async (
  feedObj: FeedReq
): Promise<Map<string, Feed>> => {
  //feedObj: data: [{link: "feedlink", avatarText: "NZZ", avatarThumbnail: "link"}]
  // feedObj = { data: feedObj };

  return new Promise((resolve, reject) => {
    fetch(CONST.API_ADRESS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedObj),
    })
      .then((result) => result.json())
      .then((json) => {
        if (json.length === 0) {
          reject(new Error("Feed cannot be loaded"));
          return;
        }
        let map = new Map();

        for (let entry of json) map.set(entry.link, entry);

        resolve(map);
      });
  });
};

export const getArticleScreenReader = (link: string): string => {
  return `${CONST.API_ADRESS_GETSTORY}${link}`;
};
