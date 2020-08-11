import React from "react";
import Fab from "@material-ui/core/Fab";
import SyncIcon from "@material-ui/icons/Sync";

export const RefreshFab = (props) => {
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
