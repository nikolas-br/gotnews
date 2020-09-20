export type FeedReq = {
  data: { link: string; avatarText: string; avatarThumbnail: string }[];
};

export type Feed = {
  avatarText: string;
  avatarThumbnail: string;
  category: string;
  description: string;
  isFavorite: boolean;
  isRead: boolean;
  link: string;
  pubDate: string;
  rootLink: string;
  rootTitle: string;
  title: string;
};

export type FeedList = {
  id: string;
  name: string;
  avatarName: string;
  thumbnail: string;
}[];

export enum DrawerItems {
  AllItems = "allItems",
  Favorites = "favorites",
  AddFeed = "addFeed",
  ReadItems = "readItems",
  Search = "search",
  Settings = "settings",
}
