import { rgba } from "polished"

import React from "react"
import styled from "styled-components"

interface ButtonItemProps {
  color: string
  onClick: () => void
}

export default (props: React.PropsWithChildren<ButtonItemProps>) => (
  <ButtonWrap>
    <ButtonItem {...props} />
  </ButtonWrap>
)

const ButtonWrap = styled.div`
  margin: 0 -40px;
`

const ButtonItem = styled.button`
  background: ${({ color }: ButtonItemProps) => rgba(color, 0.16)};
  border: none;
  color: ${({ color }: ButtonItemProps) => color};
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
  background: ${({ color }: ButtonItemProps) => rgba(color, 0.4)};
  }
`
