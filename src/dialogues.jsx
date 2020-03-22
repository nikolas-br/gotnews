import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Switch from "@material-ui/core/Switch";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Avatar from "@material-ui/core/Avatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(theme => ({
  appBar: {
    position: "relative"
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export function SettingsDialog(props) {
  const classes = useStyles();

  return (
    <div>
      <Dialog fullScreen open={props.isOpen} TransitionComponent={Transition}>
        <AppBar position="relative" style={{ textAlign: "center" }}>
          <Toolbar>
            <Grid item xs={12}>
              <Typography variant="h6">Settings</Typography>
            </Grid>
            <IconButton onClick={() => props.toggleSettings()}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box m={2} mt={3}>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
              <Grid container justify="center" spacing={1}>
                <br />

                <Grid item xs={12}>
                  <List>
                    {props.feedListDrawer.map(item => (
                      <ListItem key={item.id}>
                        <ListItemIcon>
                          <Avatar
                            src={item.thumbnail}
                            className={classes.avatar}
                          >
                            {item.avatarName}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText primary={item.name} />

                        <ListItemSecondaryAction>
                          <IconButton
                            onClick={() => props.deleteFeed(item.id)}
                            edge="end"
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                <Box mt={15}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={props.isDarkMode}
                        onChange={() => props.toggleDarkMode()}
                        color="primary"
                      />
                    }
                    label="Dark Mode"
                  />
                </Box>
                <Grid
                  item
                  xs={12}
                  style={{ textAlign: "center", marginTop: "40px" }}
                >
                  <Typography gutterBottom>
                    You are logged in as {props.loggedInAs}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </div>
  );
}

export function AddFeedDialog(props) {
  const [name, setName] = useState("");
  const [url, setURL] = useState("");

  const onSubmit = event => {
    event.preventDefault();
    props.handleAddFeed(name, url);
  };

  const isDisabled = name.length === 0 || url.length === 0 ? true : false;

  return (
    <div>
      <Dialog fullScreen open={props.isOpen} TransitionComponent={Transition}>
        <AppBar position="relative" style={{ textAlign: "center" }}>
          <Toolbar>
            <Grid item xs={12}>
              <Typography variant="h6">Add feed</Typography>
            </Grid>
            <IconButton onClick={() => props.toggleAddFeedDialog()}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box m={2} mt={15}>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
              <Grid container justify="center" spacing={2}>
                <br />

                <Grid item xs={12}>
                  <form>
                    <TextField
                      onChange={event => setName(event.target.value)}
                      name="name"
                      label="Name"
                      placeholder="Choose a name for the feed"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      variant="outlined"
                    />
                    <TextField
                      onChange={event => setURL(event.target.value)}
                      name="url"
                      label="RSS URL"
                      placeholder="URL of the news source, must be RSS"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true
                      }}
                      variant="outlined"
                    />
                    <Box mt={3}>
                      <Button
                        onClick={onSubmit}
                        type="submit"
                        variant="contained"
                        color="secondary"
                        disabled={isDisabled}
                        fullWidth={true}
                      >
                        Add feed!
                      </Button>
                    </Box>
                  </form>

                  {props.isLoading ? (
                    <Grid
                      style={{ marginTop: "70px" }}
                      container
                      direction="row"
                      justify="center"
                      alignItems="center"
                    >
                      <CircularProgress />
                    </Grid>
                  ) : null}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </div>
  );
}
