const feedListDrawerTemplate = [
  {
    name: "NZZ  - Startseite",
    avatarName: "NZZ",
    thumbnail:
      "https://pbs.twimg.com/profile_images/1006460634236628992/dc1hsh9d.jpg",
    id: "https://www.nzz.ch/startseite.rss"
  },
  {
    name: "FAZ - Aktuell",
    avatarName: "FAZ",
    thumbnail:
      "https://pbs.twimg.com/profile_images/1177121016524550145/KJESjKrB_400x400.jpg",
    id: "https://www.faz.net/rss/aktuell/"
  },
  {
    name: "Welt - Politik",
    avatarName: "W",
    thumbnail:
      "https://pbs.twimg.com/profile_images/775627854293954561/Y4iLEu_V_400x400.jpg",
    id: "https://www.welt.de/feeds/section/politik.rss"
  },
  {
    name: "Welt - Wirtschaft",
    avatarName: "W",
    thumbnail:
      "https://pbs.twimg.com/profile_images/775627854293954561/Y4iLEu_V_400x400.jpg",
    id: "https://www.welt.de/feeds/section/wirtschaft.rss"
  },
  {
    name: "Süddeutsche Zeitung - Topthemen",
    avatarName: "SZ",
    thumbnail:
      "https://pbs.twimg.com/profile_images/655020120121712640/WcX4aKls.png",
    id: "https://rss.sueddeutsche.de/rss/Topthemen"
  },

  {
    name: "Spiegel",
    avatarName: "S",
    thumbnail:
      "https://pbs.twimg.com/profile_images/1214723509521387520/7UENeEVp_400x400.jpg",
    id: "https://www.spiegel.de/schlagzeilen/index.rss"
  },

  {
    name: "New York Times - Homepage",
    avatarName: "NYT",
    thumbnail:
      "https://pbs.twimg.com/profile_images/1098244578472280064/gjkVMelR_400x400.png",
    id: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"
  }
];

export const initFeedList = feedListDrawerTemplate;

// export const proxyPrefix = "https://murmuring-taiga-44403.herokuapp.com/";

// export const initFeedList = feedListDrawerTemplate.map(item => ({
//   name: item.name,
//   avatarName: item.avatarName,
//   thumbnail: item.thumbnail,
//   // id: proxyPrefix + item.id
//   id: item.id
// }));
