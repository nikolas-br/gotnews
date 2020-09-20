import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import * as ROUTES from "./routes";
import {
  Link as RouterLink,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import Firebase, { FirebaseContext } from "./firebase";

const SignUpWrapper = (props: any) => (
  <div>
    <FirebaseContext.Consumer>
      {(firebase) => <SignUpPage {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);

type SignUpPageProps = {
  firebase: Firebase;
  history: RouteComponentProps;
} & RouteComponentProps;

type SignUpPageState = {
  email: string;
  password: string;
  password2: string;
  error: null | string;
};

class SignUpPage extends Component<SignUpPageProps, SignUpPageState> {
  state: SignUpPageState = {
    email: "",
    password: "",
    password2: "",
    error: null,
  };

  onFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "email":
        this.setState({ email: e.target.value });
        break;
      case "password":
        this.setState({ password: e.target.value });
        break;
      case "password2":
        this.setState({ password2: e.target.value });
        break;
    }
  };

  onClickSignUp = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (this.state.password !== this.state.password2) {
      this.setState({
        error: "Passwords don't match...",
      });
      return;
    }

    this.props.firebase
      .doCreateUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((authUser) => {
        this.props.firebase.initEntries(authUser.user);

        this.props.history.push(ROUTES.APP);
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  };

  render() {
    return (
      <div>
        <SignUp
          onFormChange={this.onFormChange}
          onClickSignUp={this.onClickSignUp}
        />
        <div style={{ textAlign: "center" }}>
          <Typography variant="subtitle2" color="error" gutterBottom>
            {this.state.error ? this.state.error : null}
          </Typography>
        </div>
      </div>
    );
  }
}

export default withRouter(SignUpWrapper);

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

type SignUpProps = {
  onFormChange: (e: any) => void;
  onClickSignUp: (e: any) => void;
};

const SignUp = ({ onFormChange, onClickSignUp }: SignUpProps) => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onChange={onFormChange} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password2"
                label="Repeat password"
                type="password"
                id="password2"
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={onClickSignUp}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link component={RouterLink} to={ROUTES.SIGN_IN} variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}></Box>
    </Container>
  );
};
