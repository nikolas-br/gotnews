////////////////////////////////////////////////////////////////
// Provides API for retrieving feeds from backend
////////////////////////////////////////////////////////////////
import * as CONST from "./constants";

export const getFeed = async (url, avatarText, avatarThumbnail) => {
  let feedObj = {};

  //feedObj: data: [{link: "feedlink", avatarText: "NZZ", avatarThumbnail: "link"}]
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

export const getAllFeeds = async (feedObj) => {
  //feedObj: data: [{link: "feedlink", avatarText: "NZZ", avatarThumbnail: "link"}]
  feedObj = { data: feedObj };

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

export const getArticleScreenReader = async (link) => {
  const payload = {
    data: { link },
  };

  return new Promise((resolve, reject) => {
    fetch(CONST.API_ADRESS_GETSTORY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((result) => result.text())
      .then((article) => {
        resolve(article);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};
