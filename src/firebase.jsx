import React from "react";
import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import * as CONST from "./constants";
import { initFeedList } from "./initFeedList";

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

export const FirebaseContext = React.createContext(null);

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth();
    this.database = app.firestore();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => {
    this.auth.signOut();
  };

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);
  doPasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password);

  ////////////////////////////////////////////////////////////////////
  // *** Firestore API ***
  ////////////////////////////////////////////////////////////////////
  createIsReadEntry(read, user) {
    this.createEntry(user, CONST.DATA_READ, read, "read");
  }

  createFavoritesEntry(favorites, user) {
    this.createEntry(user, CONST.DATA_FAVORITES, favorites, "favorites");
  }

  createDarkmodeEntry(isDarkMode, user) {
    this.createEntry(user, CONST.DATA_IS_DARKMODE, isDarkMode, "isDarkMode");
  }

  createFeedlistEntry(feedList, user) {
    this.createEntry(user, CONST.DATA_INIT_FEEDLIST, feedList, "initFeedList");
  }

  createIsCompactEntry(isCompact, user) {
    this.createEntry(user, CONST.DATA_IS_COMPACT, isCompact, "isCompact");
  }

  createIsScreenreaderEntry(isScreenReader, user) {
    this.createEntry(
      user,
      CONST.DATA_IS_SCREENREADER,
      isScreenReader,
      "isScreenReader"
    );
  }

  // Used to initialize document in sign up
  initEntries(user) {
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
  //for paths see constants.js
  createEntry(authUser, path, inputData, dataId) {
    if (!authUser) return;

    this.database
      .collection(`${authUser.email}${path}`)
      .doc(`${dataId}`)
      .set({ inputData })
      .catch((error) => console.error("Error adding entry to DB: ", error));
  }

  async initLoadData(user) {
    const entryFields = [
      CONST.DATA_IS_DARKMODE,
      CONST.DATA_IS_COMPACT,
      CONST.DATA_INIT_FEEDLIST,
      CONST.DATA_FAVORITES,
      CONST.DATA_READ,
      CONST.DATA_IS_SCREENREADER,
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
        ]) => {
          const favoritesMap = new Map();
          const readMap = new Map();

          for (let entry of favorites.inputData)
            favoritesMap.set(entry.link, entry);

          for (let entry of read.inputData) readMap.set(entry.link, entry);

          resolve({
            isDarkMode: isDarkMode.inputData,
            isCompact: isCompact.inputData,
            feedListDrawer: initFeedList.inputData,
            favorites: favoritesMap,
            read: readMap,
            isScreenReader: isScreenReader.inputData,
          });
        }
      );
    });
  }

  async getAllEntries(pathArr, user) {
    let promiseChain = [];

    pathArr.forEach((path) => {
      const promise = this.getEntries(user, path);
      promiseChain.push(promise);
    });

    return Promise.all(promiseChain);
  }

  async getEntries(authUser, path) {
    return new Promise((resolve, reject) => {
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
        .catch((error) => {
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
