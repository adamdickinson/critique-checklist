import * as React from "react"
import styled from "styled-components"
import { linearGradient } from "polished"

import { Gradient } from "../config/gradients"

interface PanelProps {
  background?: string
  foreground?: string
  gradient?: Gradient
  image?: string
  width?: string
}

export default styled.div`
  background: ${(props: PanelProps) => props.background};
  color: ${(props: PanelProps) => props.foreground};
  ${(props: PanelProps) => props.gradient ? linearGradient(props.gradient) : ""}
  width: ${(props: PanelProps) => props.width};
  flex: ${(props: PanelProps) => props.width ? "0 0 auto" : "1 0"};
  padding: 40px;
  box-sizing: border-box;
`
