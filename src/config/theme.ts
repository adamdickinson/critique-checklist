import { createMuiTheme } from "@material-ui/core"
import grey from "@material-ui/core/colors/grey"
import pink from "@material-ui/core/colors/pink"

export default createMuiTheme({
  palette: {
    primary: {
      main: pink["A400"]
    },
    secondary: {
      main: grey[600],
    }
  },

  typography: {
    fontFamily: "Roboto Condensed",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 700,
    title: {
      fontFamily: "Polar Vertex",
      fontWeight: 400
    }
  }
})
