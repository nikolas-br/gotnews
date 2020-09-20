import React from "react";
import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { initFeedList } from "./initFeedList";
import { Feed, FeedList } from "./types";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP__AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP__APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

enum DBPaths {
  isDarkmode = "/data/isDarkMode",
  isCompact = "/data/isCompact",
  feedListDrawer = "/data/initFeedList",
  favorites = "/data/favorites",
  read = "/data/read",
  isScreenreader = "/data/isScreenReader",
}

enum DBFields {
  read = "read",
  favorites = "favorites",
  isDarkmode = "isDarkMode",
  feedListDrawer = "initFeedList",
  isCompact = "isCompact",
  isScreenReader = "isScreenReader",
}

type DBEntries = {
  isDarkMode: boolean;
  isCompact: boolean;
  feedListDrawer: FeedList;
  favorites: Feed[];
  read: Feed[];
  isScreenReader: boolean;
};

type User = firebase.User | null;

export const FirebaseContext = React.createContext(null);

class Firebase {
  auth: firebase.auth.Auth;
  database: firebase.firestore.Firestore;

  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth();
    this.database = app.firestore();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email: string, password: string) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email: string, password: string) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => {
    this.auth.signOut();
  };

  doPasswordReset = (email: string) => this.auth.sendPasswordResetEmail(email);
  doPasswordUpdate = (password: string) => {
    if (!this.auth.currentUser) return;

    this.auth.currentUser.updatePassword(password);
  };

  ////////////////////////////////////////////////////////////////////
  // *** Firestore API ***
  ////////////////////////////////////////////////////////////////////
  createIsReadEntry(read: Feed[], user: User) {
    this.createEntry(user, DBPaths.read, read, DBFields.read);
  }

  createFavoritesEntry(favorites: Feed[], user: User) {
    this.createEntry(user, DBPaths.favorites, favorites, DBFields.favorites);
  }

  createDarkmodeEntry(isDarkMode: boolean, user: User) {
    this.createEntry(user, DBPaths.isDarkmode, isDarkMode, DBFields.isDarkmode);
  }

  createFeedlistEntry(feedList: FeedList, user: User) {
    this.createEntry(
      user,
      DBPaths.feedListDrawer,
      feedList,
      DBFields.feedListDrawer
    );
  }

  createIsCompactEntry(isCompact: boolean, user: User) {
    this.createEntry(user, DBPaths.isCompact, isCompact, DBFields.isCompact);
  }

  createIsScreenreaderEntry(isScreenReader: boolean, user: User) {
    this.createEntry(
      user,
      DBPaths.isScreenreader,
      isScreenReader,
      DBFields.isScreenReader
    );
  }

  // Used to initialize document in sign up
  initEntries(user: User) {
    const isDarkMode = true,
      isCompact = false,
      isScreenReader = false;

    this.createIsReadEntry([], user);
    this.createFavoritesEntry([], user);
    this.createDarkmodeEntry(isDarkMode, user);
    this.createFeedlistEntry(initFeedList, user);
    this.createIsCompactEntry(isCompact, user);
    this.createIsScreenreaderEntry(isScreenReader, user);
  }

  //inputData must be: {id, entry, timestamp}
  createEntry(authUser: User, path: DBPaths, inputData: any, dataId: string) {
    if (!authUser) return;

    this.database
      .collection(`${authUser.email}${path}`)
      .doc(`${dataId}`)
      .set({ inputData })
      .catch((error: Error) =>
        console.error("Error adding entry to DB: ", error)
      );
  }

  async initLoadData(user: User): Promise<DBEntries> {
    const entryFields = [
      DBPaths.isDarkmode,
      DBPaths.isCompact,
      DBPaths.feedListDrawer,
      DBPaths.favorites,
      DBPaths.read,
      DBPaths.isScreenreader,
    ];

    return new Promise((resolve, _) => {
      this.getAllEntries(entryFields, user).then(
        ([
          isDarkMode,
          isCompact,
          initFeedList,
          favorites,
          read,
          isScreenReader,
        ]: any) => {
          const favoritesMap = new Map();
          const readMap = new Map();

          for (let entry of favorites.inputData)
            favoritesMap.set(entry.link, entry);

          for (let entry of read.inputData) readMap.set(entry.link, entry);

          resolve({
            isDarkMode: isDarkMode.inputData,
            isCompact: isCompact.inputData,
            feedListDrawer: initFeedList.inputData,
            favorites: favoritesMap as any,
            read: readMap as any,
            isScreenReader: isScreenReader.inputData,
          });
        }
      );
    });
  }

  async getAllEntries(pathArr: DBPaths[], user: User): Promise<DBEntries[]> {
    let promiseChain: any = [];

    pathArr.forEach((path) => {
      const promise = this.getEntries(user, path);
      promiseChain.push(promise);
    });

    return Promise.all(promiseChain);
  }

  async getEntries(authUser: User, path: DBPaths) {
    return new Promise((resolve, reject) => {
      if (!authUser) {
        reject();
        return;
      }

      this.database
        .collection(`${authUser.email}${path}`)
        .get()
        .then((querySnapshot) => {
          let list = null;
          querySnapshot.forEach((doc) => {
            list = doc.data();
          });
          resolve(list);
        })
        .catch((error: Error) => {
          console.error(error);
          reject(error);
        });
    });
  }

  //   deleteEntry(authUser, path, id) {
  //     if (!authUser) return;

  //     this.database
  //       .collection(`${authUser.email}${path}`)
  //       .doc(`${id}`)
  //       .delete()
  //       .catch(error => console.error(error));
  //   }
}

export default Firebase;
