import React, { Component } from "react";
import { BrowserRouter as Router, Route, withRouter } from "react-router-dom";

import App from "./App";
import SignUp from "./signup";
import SignIn from "./signin";
import * as ROUTES from "./routes";
import { FirebaseContext } from "./firebase";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

class Landing extends Component {
  state = {};
  render() {
    return (
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
  }
}

export default Landing;

const CheckAuthWrapper = props => (
  <div>
    <FirebaseContext.Consumer>
      {firebase => <CheckAuthBase {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);

class CheckAuthBase extends Component {
  state = {};

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
      if (authUser) this.props.history.push(ROUTES.APP);
      else this.props.history.push(ROUTES.SIGN_IN);
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    return <div></div>;
  }
}

const CheckAuth = withRouter(CheckAuthWrapper);
