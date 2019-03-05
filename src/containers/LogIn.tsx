import { Button, Typography } from "@material-ui/core"
import { Redirect } from "react-router-dom"

import * as React from "react"
import styled from "styled-components"

import { AuthConsumer, AuthConsumerValue } from "../components/AuthProvider"
import LoginBackground from "../images/LoginBackground.jpg"
import Panel from "../components/Panel"
import TextField from "../components/TextField"
import gradients from "../config/gradients"
import useLogIn from "../hooks/useLogIn"

export default () => {
  const {
    getFormProps,
    status
  } = useLogIn()

  return (
    <>
      <BackgroundPanel />
      <MainPanel
        foreground="#FFF"
        gradient={gradients.purple}
        width="380px"
      >
        <Mid>
          <section>
            <Typography variant="h1" style={{ fontSize: 64 }} color="inherit">
              Critique
            </Typography>
            <Typography variant="caption" color="inherit" style={{ marginBottom: 12 }}>
              {status}
            </Typography>
            <AuthConsumer>
              {({ logIn, user }: AuthConsumerValue) => {
                if( user ) return <Redirect to="/" />

                const { submitProps, usernameProps, passwordProps } = getFormProps(logIn)
                return (
                  <>
                    <TextField variant="filled" label="Username" {...usernameProps} />
                    <TextField variant="filled" label="Password" type="password" {...passwordProps} />
                    <Button variant="contained" size="large" color="primary" {...submitProps}>Log In</Button>
                    <Button variant="contained" size="large" color="secondary">Sign Up</Button>
                  </>
                )
              }}
            </AuthConsumer>
          </section>
        </Mid>

        <End>
          <Typography variant="body1" color="inherit">
            <strong>Critique Checklist</strong>
            v0.0.0 Prototype
          </Typography>
        </End>
      </MainPanel>
    </>
  )
}

const BackgroundPanel = styled(Panel)`
  background: url(${LoginBackground}) no-repeat 0% 50%;
  background-size: cover;
`

const End = styled.section`
  flex: 0 0 auto;
  padding: 40px;
  text-transform: uppercase;

  strong {
    display: block;
    font-weight: 700;
  }
`

const MainPanel = styled(Panel)`
  display: flex;
  align-items: stretch;
  flex-direction: column;
  padding: 0;
`

const Mid = styled.section`
  padding: 40px;
  flex: 1 0;
  display: flex;
  align-items: center;

  > section {
    > h2, > div {
      margin-bottom: 12px;
    }

    > button {
      margin-right: 8px;
    }
  }
`
