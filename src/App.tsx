import { ThemeProvider } from "@material-ui/styles";
import React, { Component } from "react";
import { AddFeedDialog } from "./components/addFeedDialog";
import Drawer from "./components/drawer";
import { Main } from "./components/main";
import { SettingsDialog } from "./components/settingsDialog";
import { StatusDialog } from "./components/statusDialog";
import { getAllFeeds, getArticleScreenReader, getFeed } from "./feedAPI";
import { FirebaseContext } from "./firebase";
import { initFeedList } from "./initFeedList";
import { darkTheme, lightTheme } from "./themes";
import { DrawerItems, Feed, FeedList } from "./types";

const AppWrapper = (props: any) => (
  <div>
    <FirebaseContext.Consumer>
      {(firebase) => <App {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);

type AppProps = any;

type AppState = {
  feedListDrawer: FeedList;
  feedToShow: Map<string, Feed>;
  read: Map<string, Feed>;
  favorites: Map<string, Feed>;
  dialogMessage: string | null;
  dialogTitle: string;
  isAddFeedOpen: boolean;
  showsFeed: string;
  isLoading: boolean;
  isShowSettings: boolean;
  isDarkMode: boolean;
  isCompact: boolean;
  isScreenReader: boolean;
  isSearch: boolean;
  isShowAddFeed: boolean;
  authUser: any;
  authUserEmail: any;
  listener: any;
};

class App extends Component<AppProps, AppState> {
  state: AppState = {
    feedListDrawer: [],
    feedToShow: new Map(),
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
    listener: () => null,
  };

  componentDidMount() {
    const listener = this.props.firebase.auth.onAuthStateChanged(
      (authUser: any) => {
        this.setState({ listener });

        if (authUser) {
          this.setState({
            authUser: authUser,
            authUserEmail: authUser.email,
          });

          this.props.firebase.initLoadData(authUser).then(({ ...props }) => {
            this.setState({
              isDarkMode: props.isDarkMode,
              isCompact: props.isCompact,
              feedListDrawer: props.feedListDrawer,
              favorites: props.favorites,
              read: props.read,
              isScreenReader: props.isScreenReader,
            });

            if (props.feedListDrawer.length > 0)
              this.getFeedToShow(props.feedListDrawer[0].id);
          });
        } else {
          this.setState({ feedListDrawer: initFeedList });
          this.getFeedToShow(initFeedList[0].id);
        }
      }
    );

    window.history.pushState(null, "GotNews!");
  }

  componentWillUnmount() {
    this.state.listener();
  }

  setDialogTitle = (title: string, message: string) => {
    this.setState({ dialogTitle: title, dialogMessage: message });
  };

  //Get the AvatarName and a thumbnail from state.feedListDrawer, for avatar in cards
  getAvatarProps = (url: string) => {
    for (let item of this.state.feedListDrawer) {
      if (item.id === url) return [item.avatarName, item.thumbnail];
    }
    return ["", ""];
  };

  //Transfer properties isRead and isFavorite to updated feed
  transferProperties(newFeed: Map<string, Feed>) {
    newFeed.forEach((item) => {
      if (this.state.read.has(item.link)) item.isRead = true;

      if (this.state.favorites.has(item.link)) item.isFavorite = true;
    });
  }

  getFeedToShow = (url: string) => {
    const [avatarText, avatarThumbnail] = this.getAvatarProps(url);

    getFeed(url, avatarText, avatarThumbnail)
      .then((feed) => {
        this.transferProperties(feed);
        this.setState({ feedToShow: feed, showsFeed: url, isLoading: false });
      })
      .catch((error) => {
        this.setDialogTitle("Error", error.message);
        this.setState({
          isLoading: false,
          feedToShow: new Map(),
        });
      });
  };

  getFavorites = () => {
    this.setState({
      feedToShow: this.state.favorites,
      showsFeed: DrawerItems.Favorites,
      isLoading: false,
    });
  };

  getAllItemsToShow = () => {
    const feedList = this.state.feedListDrawer.map((entry) => ({
      link: entry.id,
      avatarText: entry.avatarName,
      avatarThumbnail: entry.thumbnail,
    }));

    getAllFeeds({ data: feedList })
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
          showsFeed: DrawerItems.AllItems,
          isLoading: false,
          feedToShow: feed,
        });
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        this.setDialogTitle("Error", error.message);
      });
  };

  getReadItems = () => {
    this.setState({
      feedToShow: this.state.read,
      showsFeed: DrawerItems.ReadItems,
      isLoading: false,
    });
  };

  onClickDrawerItem = (id: string) => {
    if (id !== DrawerItems.Search) this.setState({ isSearch: false });

    switch (id) {
      case DrawerItems.AllItems:
        this.scrollToTop();
        this.activateLoadingIndicator(() => this.getAllItemsToShow());
        break;
      case DrawerItems.Favorites:
        this.scrollToTop();
        this.activateLoadingIndicator(() => this.getFavorites());
        break;
      case DrawerItems.AddFeed:
        this.toggleAddFeedDialog();
        break;
      case DrawerItems.ReadItems:
        this.scrollToTop();
        this.activateLoadingIndicator(() => this.getReadItems());
        break;
      case DrawerItems.Search:
        this.setState({ isSearch: true });
        this.activateLoadingIndicator(() => this.getAllItemsToShow());
        break;
      case DrawerItems.Settings:
        this.toggleSettings();
        break;

      default:
        this.scrollToTop();
        this.activateLoadingIndicator(() => this.getFeedToShow(id));
        break;
    }
  };

  activateLoadingIndicator(func: () => void) {
    this.setState({ isLoading: true });
    func();
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }

  onClickStarToggle = (id: string) => {
    let favoritesCopy = new Map(this.state.favorites);
    let feedToShowCopy = new Map(this.state.feedToShow);
    const entry: any = feedToShowCopy.get(id);

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

    // Turn maps into array
    const fav = Array.from(favoritesCopy).map(([_, value]) => value);
    this.props.firebase.createFavoritesEntry(fav, this.state.authUser);
  };

  onClickCard = (id: string) => {
    let readCopy = new Map(this.state.read);
    let feedToShowCopy = new Map(this.state.feedToShow);
    const entry: any = feedToShowCopy.get(id);

    entry.isRead = true;
    readCopy.set(entry.link, entry);
    feedToShowCopy.set(entry.link, entry);

    this.setState({ feedToShow: feedToShowCopy, read: readCopy });

    // Turn maps into array
    const read = Array.from(readCopy).map(([_, value]) => value);
    this.props.firebase.createIsReadEntry(read, this.state.authUser);

    // Open article in ScreenReader mode or as standard website
    if (this.state.isScreenReader) this.screenReaderGetArticle(id);
    else window.open(id);
  };

  screenReaderGetArticle = (link: string) => {
    const apiLink = getArticleScreenReader(link);
    window.open(apiLink, "_blank");
  };

  onClickRefresh = () => {
    this.setState({ isLoading: true });
    this.scrollToTop();

    if (this.state.showsFeed === DrawerItems.AllItems) this.getAllItemsToShow();
    else this.getFeedToShow(this.state.showsFeed);
  };

  resetDialogToggle = () => {
    this.setState({ dialogMessage: null });
  };

  toggleSettings = () => {
    this.setState({ isShowSettings: !this.state.isShowSettings });
  };

  deleteFeed = (id: string) => {
    const newFeedListDrawer = this.state.feedListDrawer.filter(
      (feed) => feed.id !== id
    );
    this.setState({ feedListDrawer: newFeedListDrawer });
    this.props.firebase.createFeedlistEntry(
      newFeedListDrawer,
      this.state.authUser
    );
  };

  toggleDarkMode = () => {
    const isDarkMode = !this.state.isDarkMode;
    this.setState({ isDarkMode });
    this.props.firebase.createDarkmodeEntry(isDarkMode, this.state.authUser);
  };

  toggleCompactLayout = () => {
    const isCompact = !this.state.isCompact;
    this.setState({ isCompact });
    this.props.firebase.createIsCompactEntry(isCompact, this.state.authUser);
  };

  toggleAddFeedDialog = () => {
    this.setState({ isShowAddFeed: !this.state.isShowAddFeed });
  };

  toggleScreenReader = () => {
    const isScreenReader = !this.state.isScreenReader;
    this.setState({ isScreenReader });
    this.props.firebase.createIsScreenreaderEntry(
      isScreenReader,
      this.state.authUser
    );
  };

  handleAddFeed = (name: string, url: string, thumbnail: string = "") => {
    //Prevent duplicate feeds
    if (this.state.feedListDrawer.filter((item) => item.id === url).length) {
      this.setDialogTitle("Error", "The feed is already in your list.");
      return;
    }
    this.setState({ isLoading: true });

    const newFeedListDrawerEntry = {
      name: name.trim(),
      avatarName: name.trim().slice(0, 3),
      thumbnail,
      id: url,
    };

    getFeed(
      url,
      newFeedListDrawerEntry.avatarName,
      newFeedListDrawerEntry.thumbnail
    )
      .then((feed) => {
        let feedListDrawer: FeedList = [
          ...this.state.feedListDrawer,
          newFeedListDrawerEntry,
        ];

        this.setDialogTitle("Sucess", "Enjoy reading!");
        this.setState({
          feedToShow: feed,
          showsFeed: url,
          isLoading: false,
          feedListDrawer,
        });

        this.props.firebase.createFeedlistEntry(
          feedListDrawer,
          this.state.authUser
        );
      })
      .catch((error) => {
        this.setDialogTitle("Error", error.message);
        this.setState({ isLoading: false });
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
          loggedInAs={this.state.authUserEmail}
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
