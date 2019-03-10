import { Redirect, Route, RouteProps } from "react-router-dom"

import React from "react"

import { AuthConsumer, AuthConsumerValue } from "./AuthProvider"

export default ({ component: Component, ...rest }: RouteProps) => (
  <AuthConsumer>
    {({ user }: AuthConsumerValue) => (
      <Route
        {...rest}
        render={props => {
          if( props.location.pathname === "/login" ) return null
          return user ? <Component {...props} /> : <Redirect to="/login" />
        }}
      />
    )}
  </AuthConsumer>
)
