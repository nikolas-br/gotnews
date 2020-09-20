import React from "react";
import Fab from "@material-ui/core/Fab";
import SyncIcon from "@material-ui/icons/Sync";
import { DrawerItems } from "../types";

type RefreshFabProps = {
  showsFeed: string;
  onClickRefresh: () => void;
};

export const RefreshFab = ({ showsFeed, onClickRefresh }: RefreshFabProps) => {
  if (
    showsFeed === DrawerItems.Favorites ||
    showsFeed === DrawerItems.ReadItems
  )
    return <div></div>;

  return (
    <Fab
      color="primary"
      aria-label="refresh"
      style={{
        position: "fixed",
        bottom: "15px",
        right: "15px",
        // zIndex: "1",
      }}
      onClick={onClickRefresh}
    >
      <SyncIcon />
    </Fab>
  );
};
