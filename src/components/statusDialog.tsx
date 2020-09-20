import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

type StatusDialogProps = {
  title: string;
  message: string | null;
  resetDialogToggle: () => void;
};

export function StatusDialog({
  title,
  message,
  resetDialogToggle,
}: StatusDialogProps) {
  return (
    <React.Fragment>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={message !== null ? true : false}
        onClose={resetDialogToggle}
        aria-labelledby="dialog"
      >
        <DialogTitle id="dialog">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetDialogToggle} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
