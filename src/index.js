import React from "react";
import ReactDOM from "react-dom";
import Landing from "./landing";
import * as serviceWorker from "./serviceWorker";

import Firebase, { FirebaseContext } from "./firebase";

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <Landing />
  </FirebaseContext.Provider>,
  document.getElementById("root")
);

serviceWorker.register();
