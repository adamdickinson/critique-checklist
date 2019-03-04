import { CssBaseline, MuiThemeProvider } from "@material-ui/core"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

import * as React from "react"
import styled from "styled-components"

import LogIn from "./LogIn"
import theme from "../config/theme"



export default () => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <App>
        <Router>
          <Switch>
            <Route component={LogIn} />
          </Switch>
        </Router>
      </App>
    </MuiThemeProvider>
  )
}



const App = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: stretch;
`
