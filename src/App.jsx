import React, { Component } from "react";
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fab from "@material-ui/core/Fab";
import SyncIcon from "@material-ui/icons/Sync";
import { ThemeProvider } from "@material-ui/styles";

import Drawer from "./drawer";
import { MediaCard, MediaCardCompact } from "./mediaCards";
import { StatusDialog } from "./statusDialog";
import { SettingsDialog } from "./settingsDialog";
import { AddFeedDialog } from "./addFeedDialog";
import { SearchScreen } from "./searchScreen";

import { initFeedList } from "./initFeedList";
import { FirebaseContext } from "./firebase";
import {
  API_ADRESS,
  API_ADRESS_GETSTORY,
  DATA_INIT_FEEDLIST,
  DATA_IS_COMPACT,
  DATA_IS_DARKMODE,
  DATA_FAVORITES,
  DATA_READ,
  DATA_IS_SCREENREADER,
} from "./constants";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

const lightTheme = createMuiTheme({
  palette: {
    type: "light",
  },
});

const AppWrapper = (props) => (
  <div>
    <FirebaseContext.Consumer>
      {(firebase) => <App {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);

class App extends Component {
  state = {
    feedListDrawer: [],
    feedToShow: {},
    read: new Map(),
    favorites: new Map(),
    dialogMessage: null,
    dialogTitle: "",
    isAddFeedOpen: false,
    showsFeed: "",
    isLoading: true,
    isShowSettings: false,
    isDarkMode: true,
    isCompact: false,
    isScreenReader: false,
    isSearch: false,
    isShowAddFeed: false,
    authUser: null,
    authUserEmail: null,
    database: null,
  };

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        this.setState({
          authUser: authUser,
          authUserEmail: authUser.email,
          database: this.props.firebase.database,
        });

        this.initLoadData(authUser);
      } else {
        this.setState({ feedListDrawer: initFeedList });
        this.getFeedToShow(initFeedList[0].id);
      }
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  async initLoadData(authUser) {
    Promise.all([
      this.props.firebase.getEntries(authUser, DATA_IS_DARKMODE),
      this.props.firebase.getEntries(authUser, DATA_IS_COMPACT),
      this.props.firebase.getEntries(authUser, DATA_INIT_FEEDLIST),
      this.props.firebase.getEntries(authUser, DATA_FAVORITES),
      this.props.firebase.getEntries(authUser, DATA_READ),
      this.props.firebase.getEntries(authUser, DATA_IS_SCREENREADER),
    ]).then(
      ([
        isDarkMode,
        isCompact,
        initFeedList,
        favorites,
        read,
        isScreenReader,
      ]) => {
        const favoritesMap = new Map();
        const readMap = new Map();

        for (let entry of favorites.inputData)
          favoritesMap.set(entry.link, entry);

        for (let entry of read.inputData) readMap.set(entry.link, entry);

        this.setState({
          isDarkMode: isDarkMode.inputData,
          isCompact: isCompact.inputData,
          feedListDrawer: initFeedList.inputData,
          favorites: favoritesMap,
          read: readMap,
          isScreenReader: isScreenReader.inputData,
        });

        if (initFeedList.inputData.length > 0)
          this.getFeedToShow(initFeedList.inputData[0].id);
      }
    );
  }

  async getFeed(url, avatarText, avatarThumbnail) {
    let feedObj = {};

    //feedObj: data: [{link: "feedlink", avatarText: "NZZ", avatarThumbnail: "link"}]
    feedObj = { data: [{ link: url, avatarText, avatarThumbnail }] };

    return new Promise((resolve, reject) => {
      fetch(API_ADRESS, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(feedObj),
      })
        .then((result) => result.json())
        .then((json) => {
          if (json.length === 0) {
            reject(new Error("Feed cannot be loaded"));
            return;
          }
          let map = new Map();

          for (let entry of json) map.set(entry.link, entry);

          resolve(map);
        });
    });
  }

  async getAllFeeds(feedObj) {
    //feedObj: data: [{link: "feedlink", avatarText: "NZZ", avatarThumbnail: "link"}]
    feedObj = { data: feedObj };

    return new Promise((resolve, reject) => {
      fetch(API_ADRESS, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(feedObj),
      })
        .then((result) => result.json())
        .then((json) => {
          if (json.length === 0) {
            reject(new Error("Feed cannot be loaded"));
            return;
          }
          let map = new Map();

          for (let entry of json) map.set(entry.link, entry);

          resolve(map);
        });
    });
  }

  //Get the AvatarName and a thumbnail from state.feedListDrawer, for avatar in cards
  getAvatarProps = (url) => {
    for (let item of this.state.feedListDrawer) {
      if (item.id === url) return [item.avatarName, item.thumbnail];
    }
    return ["", ""];
  };

  //Transfer properties isRead and isFavorite to updated feed
  transferProperties(newFeed) {
    newFeed.forEach((item) => {
      if (this.state.read.has(item.link)) item.isRead = true;

      if (this.state.favorites.has(item.link)) item.isFavorite = true;
    });
  }

  getFeedToShow = async (url) => {
    const [avatarText, avatarThumbnail] = this.getAvatarProps(url);

    this.getFeed(url, avatarText, avatarThumbnail)
      .then((feed) => {
        this.transferProperties(feed);
        this.setState({ feedToShow: feed, showsFeed: url, isLoading: false });
      })
      .catch((error) => {
        this.setState({
          dialogMessage: error.message,
          dialogTitle: "error",
          isLoading: false,
          feedToShow: new Map(),
        });
      });
  };

  getFavorites = () => {
    this.setState({
      feedToShow: this.state.favorites,
      showsFeed: "favorites",
      isLoading: false,
    });
  };

  getAllItemsToShow = () => {
    const feedList = this.state.feedListDrawer.map((entry) => ({
      link: entry.id,
      avatarText: entry.avatarName,
      avatarThumbnail: entry.thumbnail,
    }));

    this.getAllFeeds(feedList)
      .then((feed) => {
        this.transferProperties(feed);

        // If size of list is too great, slice it
        if (feed.size > 20) {
          const res = Array.from(feed).slice(0, 500);
          feed.clear();
          res.forEach((e) => {
            feed.set(e[0], e[1]);
          });
        }

        this.setState({
          showsFeed: "allItems",
          isLoading: false,
          feedToShow: feed,
        });
      })
      .catch((error) => {
        this.setState({
          dialogMessage: error.message,
          dialogTitle: "error",
          isLoading: false,
        });
      });
  };

  getReadItems = () => {
    this.setState({
      feedToShow: this.state.read,
      showsFeed: "readItems",
      isLoading: false,
    });
  };

  onClickDrawerItem = (id) => {
    if (id !== "search") this.setState({ isSearch: false });

    switch (id) {
      case "allItems":
        this.scrollToTop();
        this.activateLoadingIndicator(() => this.getAllItemsToShow());
        break;
      case "favorites":
        this.scrollToTop();
        this.activateLoadingIndicator(() => this.getFavorites());
        break;
      case "addFeed":
        this.toggleAddFeedDialog();
        break;
      case "readItems":
        this.scrollToTop();
        this.activateLoadingIndicator(() => this.getReadItems());
        break;
      case "search":
        this.setState({ isSearch: true });
        this.activateLoadingIndicator(() => this.getAllItemsToShow());
        break;
      case "settings":
        this.toggleSettings();
        break;

      default:
        this.scrollToTop();
        this.activateLoadingIndicator(() => this.getFeedToShow(id));
        break;
    }
  };

  activateLoadingIndicator(func) {
    this.setState({ isLoading: true });
    func();
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }

  onClickStarToggle = (id) => {
    let favoritesCopy = new Map(this.state.favorites);
    let feedToShowCopy = new Map(this.state.feedToShow);
    const entry = feedToShowCopy.get(id);

    if (favoritesCopy.has(id)) {
      entry.isFavorite = false;
      favoritesCopy.delete(id);
      feedToShowCopy.set(entry.link, entry);
    } else {
      entry.isFavorite = true;
      favoritesCopy.set(entry.link, entry);
      feedToShowCopy.set(entry.link, entry);
    }

    this.setState({ feedToShow: feedToShowCopy, favorites: favoritesCopy });

    let fav = [];
    favoritesCopy.forEach((entry) => (fav = [...fav, entry]));

    this.props.firebase.createEntry(
      this.state.authUser,
      DATA_FAVORITES,
      fav,
      "favorites"
    );
  };

  onClickCard = (id) => {
    let readCopy = new Map(this.state.read);
    let feedToShowCopy = new Map(this.state.feedToShow);
    const entry = feedToShowCopy.get(id);

    entry.isRead = true;
    readCopy.set(entry.link, entry);
    feedToShowCopy.set(entry.link, entry);

    this.setState({ feedToShow: feedToShowCopy, read: readCopy });

    let read = [];
    readCopy.forEach((entry) => (read = [...read, entry]));

    this.props.firebase.createEntry(
      this.state.authUser,
      DATA_READ,
      read,
      "read"
    );

    // Open article in ScreenReader mode or as standard website
    if (this.state.isScreenReader) this.screenReaderGetArticle(id);
    else window.open(id);
  };

  // ScreenReader feature, gets optimized article from server
  screenReaderGetArticle = (link) => {
    const payload = {
      data: { link },
    };

    fetch(API_ADRESS_GETSTORY, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(payload),
    })
      .then((result) => result.json())
      .then((article) => {
        const newWindow = window.open("", "_blank");
        newWindow.document.write(article.content);
      })
      .catch((error) => console.log(error));
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

  deleteFeed = (id) => {
    const newFeedListDrawer = this.state.feedListDrawer.filter(
      (feed) => feed.id !== id
    );

    this.setState({ feedListDrawer: newFeedListDrawer });

    this.props.firebase.createEntry(
      this.state.authUser,
      DATA_INIT_FEEDLIST,
      newFeedListDrawer,
      "initFeedList"
    );
  };

  toggleDarkMode = () => {
    const isDarkMode = !this.state.isDarkMode;

    this.setState({ isDarkMode });

    this.props.firebase.createEntry(
      this.state.authUser,
      DATA_IS_DARKMODE,
      isDarkMode,
      "isDarkMode"
    );
  };

  toggleCompactLayout = () => {
    const isCompact = !this.state.isCompact;

    this.setState({ isCompact });

    this.props.firebase.createEntry(
      this.state.authUser,
      DATA_IS_COMPACT,
      isCompact,
      "isCompact"
    );
  };

  toggleAddFeedDialog = () => {
    this.setState({ isShowAddFeed: !this.state.isShowAddFeed });
  };

  toggleScreenReader = () => {
    const isScreenReader = !this.state.isScreenReader;

    this.setState({ isScreenReader });

    this.props.firebase.createEntry(
      this.state.authUser,
      DATA_IS_SCREENREADER,
      isScreenReader,
      "isScreenReader"
    );
  };

  handleAddFeed = async (name, url, thumbnail = "") => {
    //Prevent duplicate feeds
    if (this.state.feedListDrawer.filter((item) => item.id === url).length) {
      this.setState({
        dialogTitle: "Error",
        dialogMessage: "The feed is already in your list",
      });
      return;
    }

    const newFeedListDrawerEntry = {
      name: name.trim(),
      avatarName: name.trim().slice(0, 3),
      thumbnail,
      id: url,
    };

    this.setState({ isLoading: true });

    this.getFeed(
      url,
      newFeedListDrawerEntry.avatarName,
      newFeedListDrawerEntry.thumbnail
    )
      .then((feed) => {
        let feedListDrawer = [
          ...this.state.feedListDrawer,
          newFeedListDrawerEntry,
        ];

        this.setState({
          feedToShow: feed,
          showsFeed: url,
          isLoading: false,
          dialogMessage: "Enjoy reading!",
          dialogTitle: "Success",
          feedListDrawer,
        });

        this.props.firebase.createEntry(
          this.state.authUser,
          DATA_INIT_FEEDLIST,
          feedListDrawer,
          "initFeedList"
        );
      })
      .catch((error) => {
        this.setState({
          dialogTitle: "error",
          dialogMessage: error.message,
          isLoading: false,
        });
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
          isDarkMode={this.state.isDarkMode}
          feedListDrawer={this.state.feedListDrawer}
        />

        <SettingsDialog
          feedListDrawer={this.state.feedListDrawer}
          isOpen={this.state.isShowSettings}
          toggleSettings={this.toggleSettings}
          deleteFeed={this.deleteFeed}
          isDarkMode={this.state.isDarkMode}
          toggleDarkMode={this.toggleDarkMode}
          loggedInAs={this.state.authUserEmail}
          isCompact={this.state.isCompact}
          toggleCompactLayout={this.toggleCompactLayout}
        />

        <Drawer
          onClickDrawerItem={this.onClickDrawerItem}
          feedListDrawer={this.state.feedListDrawer}
          favoritesCount={this.state.favorites.size}
          readCount={this.state.read.size}
          doSignOut={this.props.firebase.doSignOut}
          // Props for popover menu on top right corner:
          isCompact={this.state.isCompact}
          isDarkMode={this.state.isDarkMode}
          isScreenReader={this.state.isScreenReader}
          toggleCompactLayout={this.toggleCompactLayout}
          toggleDarkMode={this.toggleDarkMode}
          toggleScreenReader={this.toggleScreenReader}
        />

        <Main
          feedToShow={this.state.feedToShow}
          onClickStarToggle={this.onClickStarToggle}
          onClickCard={this.onClickCard}
          isLoading={this.state.isLoading}
          showsFeed={this.state.showsFeed}
          onClickRefresh={this.onClickRefresh}
          feedListDrawer={this.state.feedListDrawer}
          isCompact={this.state.isCompact}
          isSearch={this.state.isSearch}
          favorites={this.state.favorites}
          read={this.state.read}
        />
      </ThemeProvider>
    );
  }
}

export default AppWrapper;

// Stateless functional components
///////////////////////////////////////////////////////////////////////////////

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  main: {
    [theme.breakpoints.up("sm")]: {
      maxWidth: "80%",
      marginLeft: 290,
      marginRight: 50,
      flexShrink: 0,
    },
    [theme.breakpoints.down("xs")]: {
      maxWidth: "90%",
      margin: "auto",
      flexShrink: 0,
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
}));

const Main = (props) => {
  const classes = useStyles();
  const CardLayout = props.isCompact ? MediaCardCompact : MediaCard;

  // Render search screen
  if (props.isSearch && !props.isLoading)
    return (
      <SearchScreen
        isSearch={props.isSearch}
        isCompact={props.isCompact}
        classes={classes}
        CardLayout={CardLayout}
        feedToShow={props.feedToShow}
        favorites={props.favorites}
        read={props.read}
        onClickCard={props.onClickCard}
        onClickStarToggle={props.onClickStarToggle}
      />
    );

  // Render article cards
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
        <Grid container spacing={props.isCompact ? 1 : 3}>
          {Array.from(props.feedToShow).map((item) => (
            <CardLayout
              key={item[1].link}
              title={item[1].title}
              description={item[1].description}
              link={item[1].link}
              date={item[1].pubDate}
              avatarText={item[1].avatarText}
              avatarThumbnail={item[1].avatarThumbnail}
              isFavorite={item[1].isFavorite}
              rootTitle={item[1].rootTitle}
              onClickStarToggle={props.onClickStarToggle}
              isRead={item[1].isRead}
              onClickCard={props.onClickCard}
            />
          ))}
        </Grid>
      )}

      <br />
    </main>
  );
};

const RefreshFab = (props) => {
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
        zIndex: "1",
      }}
      onClick={props.onClickRefresh}
    >
      <SyncIcon />
    </Fab>
  );
};
