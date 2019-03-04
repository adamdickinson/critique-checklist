import { TextField } from "@material-ui/core"
import * as React from "react"
import styled from "styled-components"

export default styled(TextField)`
  background: #FFF;
  border-radius: 4px;
  color: inherit;
  width: 100%;

  && > div, && > div:hover {
    background: none;
  }
`
