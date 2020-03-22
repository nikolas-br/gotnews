import React from "react";
import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP__AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP__APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
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

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  // *** Firestore API ***

  //inputData must be: {id, entry, timestamp}
  //path must be /data/initFeedList or /data/favorites or /data/read or /data/settings
  createEntry(authUser, path, inputData, dataId) {
    if (!authUser) return;

    this.database
      .collection(`${authUser.email}${path}`)
      .doc(`${dataId}`)
      .set({ inputData })
      .catch(error => console.error("Error adding entry to DB: ", error));
  }

  async getEntries(authUser, path) {
    let list = null;

    await this.database
      .collection(`${authUser.email}${path}`)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          list = doc.data();
        });
      })
      .catch(error => {
        console.error(error);
        return error;
      });

    return list;
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
