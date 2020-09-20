import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import SearchIcon from "@material-ui/icons/Search";
import AllInboxIcon from "@material-ui/icons/AllInbox";
import StarIcon from "@material-ui/icons/Star";
import CheckIcon from "@material-ui/icons/Check";
import { TextField, Divider, Typography, Button } from "@material-ui/core";
import { Feed } from "../types";

type SearchScreenProps = {
  classes: any;
  CardLayout: React.ComponentType<any>;
  feedToShow: Map<string, Feed>;
  favorites: Map<string, Feed>;
  read: Map<string, Feed>;
  onClickStarToggle: (id: string) => void;
  onClickCard: (id: string) => void;
};

export const SearchScreen = ({
  classes,
  CardLayout,
  feedToShow,
  favorites,
  read,
  onClickStarToggle,
  onClickCard,
}: SearchScreenProps) => {
  const [searchTerms, updateSearchTerms] = useState("");
  const [articlesMatches, updateArticlesMatches] = useState<Feed[]>([]);
  const [favoritesMatches, updateFavoritesMatches] = useState<Feed[]>([]);
  const [clickedMatches, updateClickedMatches] = useState<Feed[]>([]);

  const articlesArr = Array.from(feedToShow.values());
  const favoritesArr = Array.from(favorites.values());
  const readArr = Array.from(read.values());

  const onSearchChange = (e: any) => {
    updateSearchTerms(e.target.value);
  };

  const onSearchClick = () => {
    const terms = searchTerms.toLowerCase().trim().split(/\s+/);

    const articles = getSearchedArticles(articlesArr, terms);
    updateArticlesMatches(articles);

    const favorites = getSearchedArticles(favoritesArr, terms);
    updateFavoritesMatches(favorites);

    const read = getSearchedArticles(readArr, terms);
    updateClickedMatches(read);
  };

  const getSearchedArticles = (
    articlesArr: Feed[],
    searchTermsArr: string[]
  ) => {
    return articlesArr.filter((e) => {
      const searchText = [e.title, e.rootTitle, e.description]
        .join(" ")
        .toLowerCase();

      for (let term of searchTermsArr) {
        if (term.length < 3) continue;

        if (!searchText.includes(term)) return false;
      }

      return true;
    });
  };

  return (
    <main className={classes.main}>
      <div className={classes.toolbar} />

      <form
        onChange={(e) => {
          e.preventDefault();
        }}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginTop: 40,
          marginBottom: 40,
        }}
      >
        <TextField
          id="search-text-field"
          style={{ marginRight: 20 }}
          placeholder="Search terms"
          variant="outlined"
          fullWidth
          autoFocus={true}
          onChange={onSearchChange}
        />

        <Button
          type="submit"
          variant="outlined"
          style={{ height: 56 }}
          color="default"
          className={classes.button}
          startIcon={<SearchIcon />}
          onClick={(e) => {
            e.preventDefault();
            onSearchClick();
          }}
        >
          Search
        </Button>
      </form>

      <SearchResults
        articlesMatches={articlesMatches}
        favoritesMatches={favoritesMatches}
        clickedMatches={clickedMatches}
        onClickCard={onClickCard}
        onClickStarToggle={onClickStarToggle}
        CardLayout={CardLayout}
      />
    </main>
  );
};

type SearchResultsProps = {
  articlesMatches: Feed[];
  favoritesMatches: Feed[];
  clickedMatches: Feed[];
  onClickCard: (id: string) => void;
  onClickStarToggle: (id: string) => void;
  CardLayout: React.ComponentType<any>;
};

const SearchResults = ({
  articlesMatches,
  favoritesMatches,
  clickedMatches,
  onClickCard,
  onClickStarToggle,
  CardLayout,
}: SearchResultsProps) => {
  // Default value for compact layout
  const isCompact = 1;

  return (
    <React.Fragment>
      {[
        {
          name: "Articles",
          data: articlesMatches,
          icon: <AllInboxIcon />,
        },
        {
          name: "Favorites",
          data: favoritesMatches,
          icon: <StarIcon style={{ color: "#FFD700" }} />,
        },
        {
          name: "Clicked articles",
          data: clickedMatches,
          icon: <CheckIcon style={{ color: "green" }} />,
        },
      ].map((e) => (
        <React.Fragment key={e.name}>
          <div
            style={{
              display: "flex",
              marginTop: 50,
              alignItems: "center",
              justifyContent: "space-between",
              padding: 5,
            }}
          >
            <Typography variant="h5">{e.name}</Typography>
            {e.icon}
          </div>
          <Divider style={{ marginBottom: 20 }} />
          <Grid container spacing={isCompact ? 1 : 3}>
            {e.data.map((item) => (
              <CardLayout
                key={item.link}
                title={item.title}
                description={item.description}
                link={item.link}
                date={item.pubDate}
                avatarText={item.avatarText}
                avatarThumbnail={item.avatarThumbnail}
                isFavorite={item.isFavorite}
                rootTitle={item.rootTitle}
                onClickStarToggle={onClickStarToggle}
                isRead={item.isRead}
                onClickCard={onClickCard}
              />
            ))}
          </Grid>
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};
