import useInputValue from "@rehooks/input-value"

import React from "react"

import { AuthLogInFunction, AuthResponse } from "../components/AuthProvider"

type OnEnterCallback = (event: React.KeyboardEvent<HTMLInputElement>) => void
type OnClickCallback = (event: React.MouseEvent<HTMLButtonElement>) => void

interface InputValueWithEnter<T> {
  value: T
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onKeyPress: OnEnterCallback
}

interface ButtonWithClick {
  onClick: OnClickCallback
}

interface LogInFormProps {
  passwordProps: InputValueWithEnter<string>
  submitProps: ButtonWithClick
  usernameProps: InputValueWithEnter<string>
}

interface LogInHook {
  getFormProps: (logIn: AuthLogInFunction) => LogInFormProps
  status?: string
}

function useLogIn(): LogInHook {
  const [status, setStatus] = React.useState("")
  const usernameInput = useInputValue("")
  const passwordInput = useInputValue("")

  function onClick(logIn: () => Promise<AuthResponse>): OnClickCallback {
    return async function(
      event: React.MouseEvent<HTMLButtonElement>
    ): Promise<void> {
      setStatus("Logging in...")
      const { message, success } = await logIn()
      if (!success) setStatus(message)
    }
  }

  function onEnter(logIn: () => Promise<AuthResponse>): OnEnterCallback {
    return async function(
      event: React.KeyboardEvent<HTMLInputElement>
    ): Promise<void> {
      if (event.key !== "Enter") return
      setStatus("Logging in...")
      const { message, success } = await logIn()
      if (!success) setStatus(message)
    }
  }

  const getFormProps = (
    logIn: (username: string, password: string) => Promise<AuthResponse>
  ) => {
    const usernameProps: InputValueWithEnter<string> = {
      ...usernameInput,
      onKeyPress: onEnter(() => logIn(usernameInput.value, passwordInput.value))
    }

    const passwordProps: InputValueWithEnter<string> = {
      ...passwordInput,
      onKeyPress: onEnter(() => logIn(usernameInput.value, passwordInput.value))
    }

    const formProps = {
      usernameProps,
      passwordProps,
      submitProps: {
        onClick: onClick(() => logIn(usernameProps.value, passwordProps.value))
      }
    }

    return formProps
  }

  const specs: LogInHook = {
    getFormProps,
    status
  }

  return specs
}

export = useLogIn
