import React, { ComponentType } from "react";
import { SearchScreen } from "./searchScreen";
import { RefreshFab } from "./refreshFab";
import { MediaCard, MediaCardCompact } from "./mediaCards";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Feed } from "../types";

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

type MainProps = {
  isSearch: boolean;
  isLoading: boolean;
  isCompact: boolean;
  feedToShow: Map<string, Feed>;
  read: Map<string, Feed>;
  favorites: Map<string, Feed>;
  showsFeed: string;
  onClickRefresh: () => void;
  onClickCard: (id: string) => void;
  onClickStarToggle: (id: string) => void;
};

export const Main = ({
  isSearch,
  isLoading,
  isCompact,
  feedToShow,
  read,
  favorites,
  showsFeed,
  onClickRefresh,
  onClickCard,
  onClickStarToggle,
}: MainProps) => {
  const classes = useStyles();
  const CardLayout: React.ComponentType<any> = isCompact
    ? MediaCardCompact
    : MediaCard;

  // Render search screen
  if (isSearch && !isLoading)
    return (
      <SearchScreen
        classes={classes}
        CardLayout={CardLayout}
        feedToShow={feedToShow}
        favorites={favorites}
        read={read}
        onClickCard={onClickCard}
        onClickStarToggle={onClickStarToggle}
      />
    );

  // Render article cards
  return (
    <main className={classes.main}>
      <div className={classes.toolbar} />

      <RefreshFab showsFeed={showsFeed} onClickRefresh={onClickRefresh} />
      <br />

      {isLoading ? (
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

      {isLoading ? null : (
        <Grid container spacing={isCompact ? 1 : 3}>
          {Array.from(feedToShow).map((item: any) => (
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
              onClickStarToggle={onClickStarToggle}
              isRead={item[1].isRead}
              onClickCard={onClickCard}
            />
          ))}
        </Grid>
      )}

      <br />
    </main>
  );
};
