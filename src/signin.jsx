import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import RssFeedIcon from "@material-ui/icons/RssFeed";

import * as ROUTES from "./routes";
import { Link as RouterLink, withRouter } from "react-router-dom";
import { FirebaseContext } from "./firebase";

const SignInPageWrapper = props => (
  <div>
    <FirebaseContext.Consumer>
      {firebase => <SignInPage {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);

class SignInPage extends Component {
  state = { email: "", password: "", error: "" };

  onFormChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onClickSignIn = e => {
    e.preventDefault();

    this.props.firebase
      .doSignInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.props.history.push(ROUTES.APP);
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  render() {
    return (
      <div>
        <SignIn
          onFormChange={this.onFormChange}
          onClickSignIn={this.onClickSignIn}
        />
        <Box mt={4} style={{ textAlign: "center" }}>
          <Typography variant="subtitle2" color="error" gutterBottom>
            {this.state.error ? this.state.error.message : null}
          </Typography>
        </Box>
        <Box mt={8} style={{ textAlign: "center" }}>
          <Link component={RouterLink} to={ROUTES.APP} variant="subtitle2">
            Try a demo first
          </Link>
        </Box>
        <Box style={{ position: "absolute", bottom: "2px", right: "2px" }}>
          <Typography variant="caption">© Nikolas Bruecher</Typography>
        </Box>
      </div>
    );
  }
}

export default withRouter(SignInPageWrapper);

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

function SignIn(props) {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Grid
          container
          spacing={0}
          direction="row"
          justify="center"
          alignItems="flex-end"
        >
          <Grid item>
            <RssFeedIcon style={{ fontSize: "65" }} />
          </Grid>
          <Grid item>
            <Typography variant="h2">GotNews!</Typography>
          </Grid>
        </Grid>
        <br />

        <form className={classes.form} onChange={props.onFormChange} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            // autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={props.onClickSignIn}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to={ROUTES.SIGN_UP} variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
