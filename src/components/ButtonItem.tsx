import { rgba } from "polished"
import pink from "@material-ui/core/colors/pink"

import React from "react"
import styled from "styled-components"

export default (props: any) => (
  <ButtonWrap>
    <ButtonItem {...props} />
  </ButtonWrap>
)

const ButtonWrap = styled.div`
  margin: 0 -40px;
`

const ButtonItem = styled.button`
  background: ${() => rgba(pink["A400"],0.16)};
  border: none;
  color: ${pink["A400"]};
  cursor: pointer;
  display: block;
  font-family: inherit;
  font-size: 13px;
  font-weight: bold;
  line-height: 20px;
  outline: none;
  padding: 10px 40px;
  text-align: left;
  text-decoration: none;
  text-transform: uppercase;
  transition: 75ms background;
  width: 100%;

  :hover {
    background: ${() => rgba(pink["A400"],0.4)};
  }
`
