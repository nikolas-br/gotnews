import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import CardHeader from "@material-ui/core/CardHeader";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarIcon from "@material-ui/icons/Star";
import Link from "@material-ui/core/Link";
import CheckIcon from "@material-ui/icons/Check";
import AddBoxIcon from "@material-ui/icons/AddBox";

const useStyles = makeStyles({
  root: {
    maxWidth: "100%",
  },
  media: {
    height: 150,
    width: 150,
  },
  actionArea: {
    padding: 0,
    // minHeight: 65,
    "&:last-child": {
      paddingBottom: 0,
    },
  },
});

export type MediaCardProps = {
  title: string;
  description: string;
  link: string;
  date: string;
  avatarText: string;
  avatarThumbnail: string;
  isFavorite: boolean;
  rootTitle: string;
  onClickStarToggle: (id: string) => void;
  isRead: boolean;
  onClickCard: (id: string) => void;
};

export const MediaCard = ({
  title,
  description,
  link,
  date,
  avatarText,
  avatarThumbnail,
  isFavorite,
  rootTitle,
  onClickStarToggle,
  isRead,
  onClickCard,
}: MediaCardProps) => {
  const classes = useStyles();

  return (
    <Grid item lg={12} sm={12} xs={12}>
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar aria-label="avatarThumbnail" src={avatarThumbnail}>
              {avatarText}
            </Avatar>
          }
          action={
            <div>
              {isRead ? (
                <IconButton disabled>
                  <CheckIcon style={{ color: "green" }} />
                </IconButton>
              ) : null}
              <IconButton onClick={() => onClickStarToggle(link)}>
                {isFavorite ? (
                  <StarIcon style={{ color: "#FFD700" }} />
                ) : (
                  <StarBorderIcon style={{ color: "#FFD700" }} />
                )}
              </IconButton>
            </div>
          }
          title={rootTitle}
          subheader={date}
        />
        <CardActionArea>
          <Link
            // href={link}
            target="_blank"
            underline="none"
            onClick={() => onClickCard(link)}
          >
            <CardContent>
              <Typography
                gutterBottom
                variant="body1"
                color="textPrimary"
                component="p"
              >
                {title}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {description}
              </Typography>
            </CardContent>
          </Link>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export const MediaCardCompact = ({
  title,
  description,
  link,
  date,
  avatarText,
  avatarThumbnail,
  isFavorite,
  rootTitle,
  onClickStarToggle,
  isRead,
  onClickCard,
}: MediaCardProps) => {
  const classes = useStyles();

  return (
    <Grid item lg={12} sm={12} xs={12}>
      <Card className={classes.root}>
        <CardHeader
          avatar={<Avatar src={avatarThumbnail}>{avatarText}</Avatar>}
          action={
            <div>
              {isRead ? (
                <IconButton disabled>
                  <CheckIcon style={{ color: "green" }} />
                </IconButton>
              ) : null}
              <IconButton onClick={() => onClickStarToggle(link)}>
                {isFavorite ? (
                  <StarIcon style={{ color: "#FFD700" }} />
                ) : (
                  <StarBorderIcon style={{ color: "#FFD700" }} />
                )}
              </IconButton>
            </div>
          }
          title={rootTitle}
          style={{ paddingTop: "11px", paddingBottom: "7px" }}
        />
        <CardActionArea className={classes.actionArea}>
          <Link
            // href={link}
            target="_blank"
            underline="none"
            onClick={() => onClickCard(link)}
          >
            <CardContent style={{ paddingTop: "5px", paddingBottom: "7px" }}>
              <Typography variant="body1" color="textPrimary" component="p">
                {title}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {description}
              </Typography>
            </CardContent>
          </Link>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

// const mediaCardSearchStyles = makeStyles({
//   img: {
//     objectFit: "contain",
//   },
// });

type MediaCardSearchProps = {
  title: string;
  description: string;
  link: string;
  feedURL: string;
  avatarThumbnail: string;
  handleAddFeed: (
    title: string,
    feedURL: string,
    avatarThumbnail: string
  ) => void;
  isSubscribed: boolean;
};

export const MediaCardSearch = ({
  title,
  description,
  link,
  feedURL,
  avatarThumbnail,
  handleAddFeed,
  isSubscribed,
}: MediaCardSearchProps) => {
  // const classes = mediaCardSearchStyles();

  const onAddFeedClick = () => {
    if (!isSubscribed) handleAddFeed(title, feedURL, avatarThumbnail);
  };

  return (
    <Grid item lg={12} sm={12} xs={12}>
      <Card>
        <CardHeader
          avatar={
            <Avatar
              src={avatarThumbnail}
              // classes={{ img: classes.img }}
            >
              {title.slice(0, 2)}
            </Avatar>
          }
          action={
            <div>
              <IconButton onClick={onAddFeedClick}>
                <AddBoxIcon
                  fontSize="large"
                  htmlColor={isSubscribed ? "green" : "#1976d2"}
                />
              </IconButton>
            </div>
          }
          title={title}
          titleTypographyProps={{ variant: "body1" }}
          style={{ paddingTop: "11px", paddingBottom: "11px" }}
        />
        <CardContent style={{ paddingTop: "5px", paddingBottom: "10px" }}>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            style={{ marginTop: 5 }}
          >
            {link}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};
