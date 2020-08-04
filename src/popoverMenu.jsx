import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { FormControlLabel, Checkbox } from "@material-ui/core";

export default function PopoverMenu({
  isCompact,
  isDarkMode,
  isScreenReader,
  toggleCompactLayout,
  toggleDarkMode,
  toggleScreenReader,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onToggleDarkMode = () => {
    handleClose();
    setTimeout(() => {
      toggleDarkMode();
    }, 100);
  };

  const onToggleCompactLayout = () => {
    handleClose();
    setTimeout(() => {
      toggleCompactLayout();
    }, 100);
  };

  const onToggleScreenReader = () => {
    handleClose();
    setTimeout(() => {
      toggleScreenReader();
    }, 100);
  };
  return (
    <div>
      <IconButton
        onClick={handleClick}
        aria-controls="popover-menu"
        aria-haspopup="true"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="popover-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={onToggleDarkMode}>
          {isDarkMode ? "Light" : "Dark"} mode
        </MenuItem>

        <MenuItem onClick={onToggleCompactLayout}>
          {isCompact ? "Standard" : "Compact"} layout
        </MenuItem>
        <MenuItem
          onClick={onToggleScreenReader}
          style={{ color: isScreenReader ? "red" : "inherit" }}
        >
          {isScreenReader ? "Disable" : "Enable"} ScreenReader (BETA)
        </MenuItem>
      </Menu>
    </div>
  );
}
