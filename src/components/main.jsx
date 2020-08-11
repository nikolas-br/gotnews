import React from "react";
import { SearchScreen } from "./searchScreen";
import { RefreshFab } from "./refreshFab";
import { MediaCard, MediaCardCompact } from "./mediaCards";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

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

export const Main = (props) => {
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
