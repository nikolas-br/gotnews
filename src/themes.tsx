import { createMuiTheme, Theme } from "@material-ui/core/styles";

declare module "@material-ui/core/styles/createMuiTheme" {
  interface Theme {
    appBar: object;
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    appBar: object;
  }
}

export const darkTheme: Theme = createMuiTheme({
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
