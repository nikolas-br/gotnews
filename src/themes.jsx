import { createMuiTheme } from "@material-ui/core/styles";

export const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
  appBar: {
    backgroundColor: "#093170",
  },
});

export const lightTheme = createMuiTheme({
  palette: {
    type: "light",
  },
  appBar: {
    backgroundColor: "#041a3d",
  },
});
