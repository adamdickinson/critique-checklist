import { useApolloClient } from "react-apollo-hooks"
import gql from "graphql-tag"
import isString from "lodash/isString"
import jwt from "jsonwebtoken"
import store from "store"

import React, { useState } from "react"

export interface AuthResponse {
  success: boolean
  message: string
}

export interface AuthUser {
  id: number
  username: string
  firstName: string
  lastName: string
}

export interface AuthConsumerValue {
  logIn: (username: string, password: string) => Promise<AuthResponse>
  logOut: () => void
  user?: AuthUser
}

export type AuthLogInFunction = (username: string, password: string) => Promise<AuthResponse>

const LOG_IN = gql`
  query LogIn($username:String!,$password:String!) { 
    logIn (username:$username,password:$password) @client
  }
`

export const AuthContext = React.createContext({})

interface AuthProviderProps {
  children?: React.ReactNode
}

interface DecodedToken {
  id?: number
  username?: string
  firstName?: string
  lastName?: string
}

export const AuthProvider: React.FC = ({ children }: AuthProviderProps) => {
  const decode = (token: string): AuthUser => {
    if( !token ) return null
    const decoded: object | string = jwt.verify(token, "secret")
    if( !isString(decoded) ) {
      const { id, username, firstName, lastName } = decoded as DecodedToken
      if( id && username && firstName && lastName )
        return { id, username, firstName, lastName }
    }
  }

  const [user, setUser] = useState<AuthUser>(decode(store.get("token")))
  const client = useApolloClient()

  const logIn: (username: string, password: string) => Promise<AuthResponse> = async (username, password) => { 
    const { data: { logIn: token } } = await client.query({ 
      query: LOG_IN,
      variables: { username, password }
    })

    const user: AuthUser = decode(token)
    if( user ) {
      setUser(user)
      store.set("token", token)
    }

    return {
      success: !!token,
      message: token 
        ? "Logged in successfully!" 
        : "Invalid credentials, check and try again."
    }
  }

  const logOut: () => void = () => setUser(null)
  const value: AuthConsumerValue = { logIn, logOut, user }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const AuthConsumer = AuthContext.Consumer

export default AuthProvider
