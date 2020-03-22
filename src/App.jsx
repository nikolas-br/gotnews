import React, { Component } from "react";
import Feed from "rss-to-json";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fab from "@material-ui/core/Fab";
import SyncIcon from "@material-ui/icons/Sync";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import Drawer from "./drawer";
import { MediaCard } from "./uiComponents";
import { StatusDialog } from "./dialog";
import { SettingsDialog, AddFeedDialog } from "./dialogues";

//Proxy needed to prevent CORS
import { proxyPrefix, initFeedList } from "./initFeedList";
import { FirebaseContext } from "./firebase";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

const lightTheme = createMuiTheme({
  palette: {
    type: "light"
  }
});

const AppWrapper = props => (
  <div>
    <FirebaseContext.Consumer>
      {firebase => <App {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);

class App extends Component {
  state = {
    feedListDrawer: [],
    feedToShow: [],
    read: [],
    favorites: [],
    dialogMessage: null,
    dialogTitle: "",
    isAddFeedOpen: false,
    showsFeed: "",
    isLoading: true,
    isShowSettings: false,
    isDarkMode: true,
    isShowAddFeed: false,
    authUser: null,
    authUserEmail: null,
    database: null
  };

  //IMPLEMENT error catching for getEntries
  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.setState({
          authUser: authUser,
          authUserEmail: authUser.email,
          database: this.props.firebase.database
        });

        this.initLoadData(authUser);
      } else {
        this.setState({ feedListDrawer: initFeedList });
        this.getFeed(initFeedList[0].id);
      }
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  async initLoadData(authUser) {
    Promise.all([
      this.props.firebase.getEntries(authUser, "/data/settings"),
      this.props.firebase.getEntries(authUser, "/data/initFeedList"),
      this.props.firebase.getEntries(authUser, "/data/favorites"),
      this.props.firebase.getEntries(authUser, "/data/read")
    ]).then(([settings, initFeedList, favorites, read]) => {
      this.setState({
        isDarkMode: settings.inputData,
        feedListDrawer: initFeedList.inputData,
        favorites: favorites.inputData,
        read: read.inputData
      });
      if (initFeedList.inputData.length > 0)
        this.getFeed(initFeedList.inputData[0].id);
    });
  }

  //Proper error messages needed, complications due to differently formatted objects
  getFeed(url) {
    Feed.load(url, (error, result) => {
      if (error != null) {
        console.error("Error getFeed: ", error);
        // if (typeof error.response.statusText !== "undefined")
        //   error = error.response.statusText;
        this.setState({
          dialogMessage: "Error",
          dialogTitle: "Something went wrong..."
        });
      } else {
        const newFeed = this.parseFeed(result, url);
        newFeed.items[0] = this.transferProperties(newFeed);

        this.setState({
          feedToShow: newFeed.items[0],
          showsFeed: url,
          isLoading: false
        });
      }
    });
  }

  //Get the AvatarName and a thumbnail from state.feedListDrawer, for avatar in cards
  getAvatarProps = url => {
    for (let item of this.state.feedListDrawer) {
      if (item.id === url) return [item.avatarName, item.thumbnail];
    }
    return ["", null];
  };

  //Transfer properties isRead and isFavorite to updated feed
  transferProperties(newFeed) {
    return newFeed.items[0].map(feed => {
      for (let favorite of this.state.favorites) {
        if (feed.link === favorite.link) feed.isFavorite = true;
      }
      for (let read of this.state.read) {
        if (feed.link === read.link) feed.isRead = true;
      }

      return feed;
    });
  }

  parseFeed(jsonFeed, url) {
    let newFeed = {};
    let newEntries = [];

    const channelKeys = ["description", "title", "image", "category", "url"];
    const itemKeys = ["title", "description", "link", "pubDate", "category"];

    if ("items" in jsonFeed) {
      for (let item of jsonFeed["items"]) {
        let newEntry = {};

        for (let itmKey of itemKeys) {
          if (typeof item[itmKey] === "undefined")
            newEntry = { ...newEntry, [itmKey]: "" };
          else newEntry = { ...newEntry, [itmKey]: item[itmKey] };
        }

        //Filter out description of items if they contain meta data
        if (newEntry.description.includes("<")) newEntry.description = "";
        //Change date to more readable format
        const date = new Date(newEntry.pubDate);
        newEntry.pubDate = date.toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });

        const [avatarName, avatarThumbnail] = this.getAvatarProps(url);

        //Add new item to array of stories, add values for app functions
        newEntries = [
          ...newEntries,
          {
            ...newEntry,
            isFavorite: false,
            avatarThumbnail: avatarThumbnail,
            avatarText: avatarName,
            rootTitle: jsonFeed["title"],
            isRead: false
          }
        ];
      }
    }
    //Sort feed by date
    this.sortFeed(newEntries);

    for (let chKey of channelKeys)
      newFeed = { ...newFeed, [chKey]: jsonFeed[chKey] };

    newFeed = { ...newFeed, items: [newEntries] };

    return newFeed;
  }

  getFeedToShow = url => {
    this.getFeed(url);
    this.setState({ showsFeed: url });
  };

  getFavorites = () => {
    this.setState({
      feedToShow: this.state.favorites,
      showsFeed: "favorites",
      isLoading: false
    });
  };

  getAllItemsToShow = () => {
    this.setState({ feedToShow: [] });
    const urlList = this.state.feedListDrawer.map(entry => entry.id);

    for (let url of urlList) {
      Feed.load(url, (error, result) => {
        if (error != null) {
          console.error("Error getFeed: ", error);
          this.setState({
            dialogMessage: error,
            dialogTitle: "Something went wrong..."
          });
          return;
        } else {
          const newFeed = this.parseFeed(result, url);
          newFeed.items[0] = this.transferProperties(newFeed);

          this.setState({
            feedToShow: [...this.state.feedToShow, ...newFeed.items[0]]
          });

          if (url === urlList[urlList.length - 1]) {
            const feedToShow = [...this.state.feedToShow];
            this.sortFeed(feedToShow);

            this.setState({
              feedToShow,
              showsFeed: "allItems",
              isLoading: false
            });
          }
        }
      });
    }
  };

  getReadItems = () => {
    this.setState({
      feedToShow: this.state.read,
      showsFeed: "readItems",
      isLoading: false
    });
  };

  onClickDrawerItem = id => {
    switch (id) {
      case "allItems":
        this.scrollToTop();
        this.handleLoadingIndicator(() => this.getAllItemsToShow());
        break;
      case "favorites":
        this.scrollToTop();
        this.handleLoadingIndicator(() => this.getFavorites());
        break;
      case "addFeed":
        this.toggleAddFeedDialog();
        break;
      case "readItems":
        this.scrollToTop();
        this.handleLoadingIndicator(() => this.getReadItems());
        break;
      case "settings":
        this.toggleSettings();
        break;

      default:
        this.scrollToTop();
        this.handleLoadingIndicator(() => this.getFeedToShow(id));
        break;
    }
  };

  handleLoadingIndicator(func) {
    this.setState({ isLoading: true });
    func();
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "auto"
    });
  }

  sortFeed(feed) {
    feed.sort((a, b) =>
      Date.parse(a.pubDate) < Date.parse(b.pubDate) ? 1 : -1
    );
  }

  onClickStarToggle = id => {
    let feedToShowCopy = [...this.state.feedToShow];
    let favoritesCopy = [...this.state.favorites];

    for (let entry of feedToShowCopy)
      if (entry.link === id) {
        if (entry.isFavorite)
          favoritesCopy = favoritesCopy.filter(entry => entry.link !== id);
        else favoritesCopy = [entry, ...favoritesCopy];

        entry.isFavorite = !entry.isFavorite;
        break;
      }

    this.setState({ feedToShow: feedToShowCopy, favorites: favoritesCopy });

    this.props.firebase.createEntry(
      this.state.authUser,
      "/data/favorites",
      favoritesCopy,
      "favorites"
    );
  };

  onClickCard = id => {
    let feedToShowCopy = [...this.state.feedToShow];
    let readCopy = [...this.state.read];

    for (let entry of feedToShowCopy)
      if (entry.link === id) {
        if (!entry.isRead) readCopy = [entry, ...readCopy];

        entry.isRead = true;
        break;
      }

    this.setState({ feedToShow: feedToShowCopy, read: readCopy });

    this.props.firebase.createEntry(
      this.state.authUser,
      "/data/read",
      readCopy,
      "read"
    );
  };

  onClickRefresh = () => {
    this.setState({ isLoading: true });
    this.scrollToTop();

    if (this.state.showsFeed === "allItems") this.getAllItemsToShow();
    else this.getFeedToShow(this.state.showsFeed);
  };

  resetDialogToggle = () => {
    this.setState({ dialogMessage: null });
  };

  toggleSettings = () => {
    this.setState({ isShowSettings: !this.state.isShowSettings });
  };

  deleteFeed = id => {
    const newFeedListDrawer = this.state.feedListDrawer.filter(
      feed => feed.id !== id
    );

    this.setState({ feedListDrawer: newFeedListDrawer });

    this.props.firebase.createEntry(
      this.state.authUser,
      "/data/initFeedList",
      newFeedListDrawer,
      "initFeedList"
    );
  };

  toggleDarkMode = () => {
    const isDarkMode = !this.state.isDarkMode;

    this.setState({ isDarkMode });

    this.props.firebase.createEntry(
      this.state.authUser,
      "/data/settings",
      isDarkMode,
      "settings"
    );
  };

  toggleAddFeedDialog = () => {
    this.setState({ isShowAddFeed: !this.state.isShowAddFeed });
  };

  //Proper error messages needed, complications due to differently formatted objects
  handleAddFeed = (name, url) => {
    url = proxyPrefix + url;

    //Prevent duplicate feeds
    if (
      this.state.feedListDrawer.filter(item => item.id === url).length !== 0
    ) {
      this.setState({
        dialogTitle: "Oops...",
        dialogMessage: "The feed is already in your list"
      });
      return;
    }

    this.setState({ isLoading: true });

    Feed.load(url, (error, result) => {
      if (error != null) {
        console.error("Error getFeed: ", error);
        // if (typeof error.response.statusText !== "undefined")
        //   error = error.response.statusText;
        this.setState({
          dialogMessage: "Error",
          dialogTitle: "Something went wrong...",
          isLoading: false
        });
      } else {
        const newFeedListDrawerEntry = {
          name: name.trim(),
          avatarName: name.trim().slice(0, 3),
          avatarThumbnail: null,
          id: url
        };
        const feedListDrawer = [
          ...this.state.feedListDrawer,
          newFeedListDrawerEntry
        ];

        const newFeed = this.parseFeed(result, url);
        for (let item of newFeed.items[0])
          item.avatarText = newFeedListDrawerEntry.avatarName;

        this.setState({
          feedToShow: newFeed.items[0],
          dialogTitle: "Feed added",
          dialogMessage: "Enjoy reading!",
          isLoading: false,
          showsFeed: url,
          feedListDrawer
        });

        this.props.firebase.createEntry(
          this.state.authUser,
          "/data/initFeedList",
          feedListDrawer,
          "initFeedList"
        );
      }
    });
  };

  render() {
    return (
      <ThemeProvider theme={this.state.isDarkMode ? darkTheme : lightTheme}>
        <StatusDialog
          message={this.state.dialogMessage}
          title={this.state.dialogTitle}
          resetDialogToggle={this.resetDialogToggle}
        />

        <AddFeedDialog
          isOpen={this.state.isShowAddFeed}
          toggleAddFeedDialog={this.toggleAddFeedDialog}
          handleAddFeed={this.handleAddFeed}
          isLoading={this.state.isLoading}
        />

        <SettingsDialog
          feedListDrawer={this.state.feedListDrawer}
          isOpen={this.state.isShowSettings}
          toggleSettings={this.toggleSettings}
          deleteFeed={this.deleteFeed}
          isDarkMode={this.state.isDarkMode}
          toggleDarkMode={this.toggleDarkMode}
          loggedInAs={this.state.authUserEmail}
        />

        <Drawer
          onClickDrawerItem={this.onClickDrawerItem}
          feedListDrawer={this.state.feedListDrawer}
          favoritesCount={this.state.favorites.length}
          readCount={this.state.read.length}
          doSignOut={this.props.firebase.doSignOut}
        />

        <Main
          feedToShow={this.state.feedToShow}
          onClickStarToggle={this.onClickStarToggle}
          onClickCard={this.onClickCard}
          isLoading={this.state.isLoading}
          showsFeed={this.state.showsFeed}
          onClickRefresh={this.onClickRefresh}
          feedListDrawer={this.state.feedListDrawer}
        />
      </ThemeProvider>
    );
  }
}

export default AppWrapper;

// Stateless functions
////////////////////////////////////////////////////////

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  main: {
    [theme.breakpoints.up("sm")]: {
      maxWidth: "80%",
      marginLeft: 290,
      marginRight: 50,
      flexShrink: 0
    },
    [theme.breakpoints.down("xs")]: {
      maxWidth: "90%",
      margin: "auto",
      flexShrink: 0
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  }
}));

function Main(props) {
  const classes = useStyles();

  return (
    <main className={classes.main}>
      <div className={classes.toolbar} />

      <RefreshFab
        showsFeed={props.showsFeed}
        onClickRefresh={props.onClickRefresh}
      />
      <br />

      {props.isLoading ? (
        <Grid
          style={{ marginTop: "200px" }}
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <CircularProgress />
        </Grid>
      ) : null}

      {props.isLoading ? null : (
        <Grid container spacing={3}>
          {props.feedToShow.map((item, key) => (
            <MediaCard
              key={key}
              title={item.title}
              description={item.description}
              link={item.link}
              headerTitle={"H"}
              date={item.pubDate}
              avatarText={item.avatarText}
              avatarThumbnail={item.avatarThumbnail}
              isFavorite={item.isFavorite}
              rootTitle={item.rootTitle}
              onClickStarToggle={props.onClickStarToggle}
              isRead={item.isRead}
              onClickCard={props.onClickCard}
            />
          ))}
        </Grid>
      )}

      {/* <Grid
        style={{ marginTop: "40px" }}
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <ButtonMarkAsRead
          isLoading={props.isLoading}
          showsFeed={props.showsFeed}
        />
      </Grid> */}

      <br />
    </main>
  );
}

const RefreshFab = props => {
  if (props.showsFeed === "favorites" || props.showsFeed === "readItems")
    return <div></div>;

  return (
    <Fab
      color="primary"
      aria-label="refresh"
      style={{
        position: "fixed",
        bottom: "15px",
        right: "15px",
        zIndex: "1"
      }}
      onClick={props.onClickRefresh}
    >
      <SyncIcon />
    </Fab>
  );
};
