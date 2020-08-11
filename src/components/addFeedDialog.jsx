import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Pagination from "@material-ui/lab/Pagination";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import { API_ADRESS_SEARCH } from "../constants";
import { MediaCardSearch } from "./mediaCards";

const addFeedDialogStyle = makeStyles({
  rootDark: {
    backgroundColor: "#303030",
  },
  rootLight: {
    backgroundColor: "white",
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export function AddFeedDialog({
  isOpen,
  isDarkMode,
  isLoading,
  handleAddFeed,
  toggleAddFeedDialog,
  feedListDrawer,
}) {
  const [isOption1, setIsOption1] = useState(true);

  const classes = addFeedDialogStyle();

  return (
    <div>
      <Dialog
        fullScreen
        open={isOpen}
        TransitionComponent={Transition}
        classes={{
          paper: isDarkMode ? classes.rootDark : classes.rootLight,
        }}
      >
        <AppBar position="fixed" style={{ textAlign: "center" }}>
          <Toolbar>
            <Grid item xs={12}>
              <Typography variant="h6">Add feed</Typography>
            </Grid>
            <IconButton onClick={() => toggleAddFeedDialog()}>
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
                  <ButtonGroup
                    style={{ marginBottom: 20 }}
                    fullWidth={true}
                    variant="contained"
                    color="primary"
                  >
                    <Button
                      color={isOption1 ? "primary" : "default"}
                      onClick={() => setIsOption1(true)}
                    >
                      Search feeds
                    </Button>
                    <Button
                      color={!isOption1 ? "primary" : "default"}
                      onClick={() => setIsOption1(false)}
                    >
                      Add feed from URL
                    </Button>
                  </ButtonGroup>

                  {isOption1 ? (
                    <SearchFeeds
                      isLoading={isLoading}
                      handleAddFeed={handleAddFeed}
                      feedListDrawer={feedListDrawer}
                    />
                  ) : (
                    <AddFeedFromURL
                      handleAddFeed={handleAddFeed}
                      isLoading={isLoading}
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </div>
  );
}

export function AddFeedFromURL({ handleAddFeed, isLoading }) {
  const [name, setName] = useState("");
  const [url, setURL] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    handleAddFeed(name, url);
  };

  const isDisabled = name.length === 0 || url.length === 0 ? true : false;

  return (
    <Grid item xs={12}>
      <form>
        <TextField
          onChange={(event) => setName(event.target.value)}
          name="name"
          label="Name"
          placeholder="Choose a name for the feed"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
        <TextField
          onChange={(event) => setURL(event.target.value)}
          name="url"
          label="RSS URL"
          placeholder="URL of the news source, must be RSS"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
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

      <AddFeedLoadingIndicator isLoading={isLoading} />
    </Grid>
  );
}

export function SearchFeeds({ isLoading, handleAddFeed, feedListDrawer }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const onSearch = (event) => {
    event.preventDefault();

    setPage(1);
    onPaginate(0);
  };

  // Loads search result, newPage=0 for first load
  const onPaginate = (newPage) => {
    const payload = { data: { search: searchTerm, page: newPage } };

    fetch(API_ADRESS_SEARCH, {
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
      .then((json) => {
        if (json.length === 0) {
          // ERROR HANDLING NEEDED !!!!
          console.error("Search results cannot be loaded");
          return;
        }

        setSearchResults(json.data);

        if (json.totalPages > 0) setTotalPages(json.totalPages);
        else setTotalPages(0);
      });
  };

  return (
    <Grid item xs={12}>
      <form>
        <Box mt={5}>
          <TextField
            onChange={(event) => setSearchTerm(event.target.value)}
            name="search"
            label="Search"
            placeholder="Select from more than 1700 feeds: CNN, BBC, Economist, ...  "
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
          />

          <Box mt={3}>
            <Button
              onClick={onSearch}
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth={true}
            >
              Search
            </Button>
          </Box>
        </Box>
      </form>

      <Box mt={5}>
        <SearchResults
          searchResults={searchResults}
          handleAddFeed={handleAddFeed}
          feedListDrawer={feedListDrawer}
        />
      </Box>

      <Box mt={10} mb={5} justifyContent="center" display="flex">
        <Pagination
          count={totalPages}
          hidePrevButton
          hideNextButton
          hidden={totalPages > 0 ? false : true}
          onChange={(event, value) => {
            setPage(value);
            onPaginate(value - 1);
          }}
          page={page}
          color="primary"
          size="large"
        />
      </Box>
      <AddFeedLoadingIndicator isLoading={isLoading} />
    </Grid>
  );
}

const SearchResults = ({ searchResults, handleAddFeed, feedListDrawer }) => {
  if (!searchResults) return null;

  // Get already subscribed feeds (urls) into a map for quicker access
  const existingFeedSubs = new Map();
  feedListDrawer.forEach((e) => {
    existingFeedSubs.set(e.id);
  });

  return (
    <Grid container spacing={1}>
      {searchResults.map((e, i) => (
        <MediaCardSearch
          key={i}
          title={e.title}
          description={e.description}
          avatarThumbnail={e.image}
          feedURL={e.feedURL}
          link={e.link}
          handleAddFeed={handleAddFeed}
          isSubscribed={existingFeedSubs.has(e.feedURL) ? true : false}
        />
      ))}
    </Grid>
  );
};

const AddFeedLoadingIndicator = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <Grid
      style={{ marginTop: "70px" }}
      container
      direction="row"
      justify="center"
      alignItems="center"
    >
      <CircularProgress />
    </Grid>
  );
};
