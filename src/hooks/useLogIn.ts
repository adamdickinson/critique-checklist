import useInputValue from "@rehooks/input-value"

import React, { useState } from "react"

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

interface LogInHook {
  status?: string
  username: InputValueWithEnter<string>
  password: InputValueWithEnter<string>
  logIn: ButtonWithClick
}

function useLogIn() : LogInHook {
  const [status, setStatus] = React.useState("")

  let password: InputValueWithEnter<string>, username: InputValueWithEnter<string>

  function logIn(): void { 
    console.log(username, password)
    setStatus("Logging in...")
    setTimeout(() => setStatus("Login failed"), 1000)
  }

  function onClick(callback: () => void): OnClickCallback {
    return function(event: React.MouseEvent<HTMLButtonElement>): void {
      callback()
    }
  }

  function onEnter(callback: () => void): OnEnterCallback {
    return function(event: React.KeyboardEvent<HTMLInputElement>): void {
      if( event.key !== "Enter" ) return
      callback()
    }
  }

  username = { ...useInputValue(""), onKeyPress: onEnter(logIn) }
  password = { ...useInputValue(""), onKeyPress: onEnter(logIn) }

  const specs: LogInHook = {
    logIn: { onClick: onClick(logIn) },
    password,
    status,
    username,
  }
  return specs
}

export = useLogIn
