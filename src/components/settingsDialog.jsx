import React from "react";
import { makeStyles } from "@material-ui/core/styles";
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
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Avatar from "@material-ui/core/Avatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
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
                    {props.feedListDrawer.map((item) => (
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

                <Grid
                  container
                  style={{
                    marginTop: "30px",
                  }}
                  justify="center"
                  direction="column"
                  alignItems="center"
                >
                  <Box mt={10} mb={5}>
                    <Typography gutterBottom>
                      {props.loggedInAs
                        ? "You are logged in as " + props.loggedInAs
                        : "You are not logged in"}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </div>
  );
}