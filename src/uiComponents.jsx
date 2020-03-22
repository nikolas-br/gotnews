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

const useStyles = makeStyles({
  root: {
    maxWidth: "100%"
  },
  media: {
    height: 150,
    width: 150
  }
});

export function MediaCard({
  title,
  description,
  link,
  headerTitle,
  date,
  avatarText,
  avatarThumbnail,
  isFavorite,
  rootTitle,
  onClickStarToggle,
  isRead,
  onClickCard
}) {
  const classes = useStyles();

  return (
    <Grid item lg={6} sm={12} xs={12}>
      <Card className={classes.root}>
        {/* <CardMedia
            className={classes.media}
            image={}
            title="Contemplative Reptile"
          /> */}
        <CardHeader
          avatar={
            <Avatar
              aria-label="avatarThumbnail"
              src={avatarThumbnail}
              className={classes.avatar}
            >
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
              <IconButton
                aria-label="settings"
                onClick={() => onClickStarToggle(link)}
              >
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
            href={link}
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
}
