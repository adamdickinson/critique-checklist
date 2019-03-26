import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks"
import { ApolloProvider } from "react-apollo"
import { CssBaseline, MuiThemeProvider } from "@material-ui/core"
import { BrowserRouter as Router, Route } from "react-router-dom"
import ApolloClient from "apollo-boost"
import blueGrey from "@material-ui/core/colors/blueGrey"

import * as React from "react"
import styled from "styled-components"

import { GlobalStyle } from "../config/styles"
import AuthProvider from "../components/AuthProvider"
import ClientScreen from "./ClientScreen"
import FeedbackScreen from "./FeedbackScreen"
import LogIn from "./LogIn"
import PrivateRoute from "../components/PrivateRoute"
import ProjectScreen from "./ProjectScreen"
import RoundScreen from "./RoundScreen"
import WorkScreen from "./WorkScreen"
import theme from "../config/theme"

const client = new ApolloClient({
  uri: `http://${window.location.hostname}:8081/graphql`
})

export default () => {
  return (
    <MuiThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <ApolloHooksProvider client={client}>
          <AuthProvider>
            <GlobalStyle />
            <CssBaseline />
            <App>
              <Router>
                <>
                  <PrivateRoute exact path="/" component={ClientScreen} />
                  <PrivateRoute path="/client/:clientId" component={ProjectScreen} />
                  <PrivateRoute path="/project/:projectId" component={RoundScreen} />
                  <PrivateRoute path="/round/:roundId" component={FeedbackScreen} />
                  <PrivateRoute path="/feedback/:feedbackId" component={WorkScreen} />
                  <Route path="/login" component={LogIn} />
                </>
              </Router>
            </App>
          </AuthProvider>
        </ApolloHooksProvider>
      </ApolloProvider>
    </MuiThemeProvider>
  )
}

const App = styled.div`
  background: ${blueGrey[900]};
  display: flex;
  min-height: 100vh;
  align-items: stretch;
`
