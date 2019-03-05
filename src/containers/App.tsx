import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks"
import { ApolloProvider } from "react-apollo"
import { CssBaseline, MuiThemeProvider } from "@material-ui/core"
import { BrowserRouter as Router, Route } from "react-router-dom"
import ApolloClient from "apollo-boost"

import * as React from "react"
import styled from "styled-components"

import { GlobalStyle } from "../config/styles"
import AuthProvider from "../components/AuthProvider"
import ClientPanel from "./ClientPanel"
import LogIn from "./LogIn"
import PrivateRoute from "../components/PrivateRoute"
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
                  <PrivateRoute path="/" component={ClientPanel} />
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
  background: #263238;
  display: flex;
  min-height: 100vh;
  align-items: stretch;
`
