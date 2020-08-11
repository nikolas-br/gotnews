import React from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import AllInboxIcon from "@material-ui/icons/AllInbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import RssFeedIcon from "@material-ui/icons/RssFeed";
import Box from "@material-ui/core/Box";
import AddIcon from "@material-ui/icons/Add";
import Avatar from "@material-ui/core/Avatar";
import SettingsIcon from "@material-ui/icons/Settings";
import LockIcon from "@material-ui/icons/Lock";
import Grid from "@material-ui/core/Grid";
import StarIcon from "@material-ui/icons/Star";
import CheckIcon from "@material-ui/icons/Check";
import Badge from "@material-ui/core/Badge";
import SearchIcon from "@material-ui/icons/Search";
import PopoverMenu from "./popoverMenu";

import * as ROUTES from "../routes";
import { withRouter } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    backgroundColor: "#093170",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  orange: {
    // color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: "success.main",
  },
}));

const ResponsiveDrawer = (props) => {
  const { container } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const handleLogout = () => {
    props.doSignOut();
    props.history.push(ROUTES.SIGN_IN);
  };

  const drawer = (
    <div onClick={handleDrawerClose}>
      <div className={classes.toolbar} />

      <Divider />
      <List>
        <ListItem button onClick={() => props.onClickDrawerItem("allItems")}>
          <ListItemIcon>
            <AllInboxIcon />
          </ListItemIcon>
          <ListItemText primary=" All feeds" />
        </ListItem>

        <ListItem button onClick={() => props.onClickDrawerItem("favorites")}>
          <ListItemIcon>
            <Badge badgeContent={props.favoritesCount} max={99} color="primary">
              <StarIcon style={{ color: "#FFD700" }} />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Favorites" />
        </ListItem>

        <ListItem button onClick={() => props.onClickDrawerItem("readItems")}>
          <ListItemIcon>
            <Badge badgeContent={props.readCount} max={99} color="primary">
              <CheckIcon style={{ color: "green" }} />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Clicked articles" />
        </ListItem>

        <ListItem button onClick={() => props.onClickDrawerItem("search")}>
          <ListItemIcon>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText primary="Search" />
        </ListItem>
        <Divider />

        {props.feedListDrawer.map((item) => (
          <ListItem
            button
            key={item.id}
            onClick={() => props.onClickDrawerItem(item.id)}
          >
            <ListItemIcon>
              <Avatar src={item.thumbnail} className={classes.avatar}>
                {item.avatarName}
              </Avatar>
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}

        <ListItem
          button
          style={{ marginBottom: "80px" }}
          onClick={() => props.onClickDrawerItem("addFeed")}
        >
          <ListItemIcon>
            <Avatar
              style={{
                color: "white",
                backgroundColor: "green",
              }}
            >
              <AddIcon />
            </Avatar>
          </ListItemIcon>
          <ListItemText primary="Add feed" />
        </ListItem>
      </List>

      <Box position="fixed" bottom={0} width={drawerWidth - 1} left={0}>
        <Divider />

        <Box bgcolor="background.paper">
          <List>
            <Grid
              container
              direction="row"
              justify="space-evenly"
              alignItems="center"
            >
              <Grid item>
                <IconButton onClick={() => props.onClickDrawerItem("settings")}>
                  <SettingsIcon />
                </IconButton>
              </Grid>

              <Grid item>
                <IconButton onClick={handleLogout}>
                  <LockIcon />
                </IconButton>
              </Grid>
            </Grid>
          </List>
        </Box>
      </Box>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar style={{ justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <div style={{ display: "flex", alignItems: "center" }}>
            <RssFeedIcon />

            <Typography variant="h6" noWrap>
              GotNews!
            </Typography>
          </div>
          <PopoverMenu
            isCompact={props.isCompact}
            isDarkMode={props.isDarkMode}
            isScreenReader={props.isScreenReader}
            toggleCompactLayout={props.toggleCompactLayout}
            toggleDarkMode={props.toggleDarkMode}
            toggleScreenReader={props.toggleScreenReader}
          />
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="feeds">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
};

export default withRouter(ResponsiveDrawer);
