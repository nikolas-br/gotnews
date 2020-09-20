import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  withRouter,
  RouteComponentProps,
} from "react-router-dom";

import App from "./App";
import SignUp from "./signup";
import SignIn from "./signin";
import * as ROUTES from "./routes";
import Firebase, { FirebaseContext } from "./firebase";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
  appBar: {},
});

const Landing = () => (
  <div>
    <ThemeProvider theme={darkTheme}>
      <Router>
        <Route exact path={ROUTES.LANDING} component={CheckAuth} />
        <Route path={ROUTES.SIGN_IN} component={SignIn} />
        <Route path={ROUTES.SIGN_UP} component={SignUp} />
        <Route path={ROUTES.APP} component={App} />
      </Router>
    </ThemeProvider>
  </div>
);

export default Landing;

const CheckAuthWrapper = (props: any) => (
  <div>
    <FirebaseContext.Consumer>
      {(firebase) => <CheckAuthBase {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);

type CheckAuthBaseProps = {
  firebase: Firebase;
  history: RouteComponentProps;
} & RouteComponentProps;

const CheckAuthBase = ({ firebase, history }: CheckAuthBaseProps) => {
  useEffect(() => {
    const listener = firebase.auth.onAuthStateChanged((authUser) => {
      if (authUser) history.push(ROUTES.APP);
      else history.push(ROUTES.SIGN_IN);
    });

    return () => {
      listener();
    };
  });

  return <></>;
};

const CheckAuth = withRouter(CheckAuthWrapper);
