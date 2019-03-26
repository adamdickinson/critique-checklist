import classnames from "classnames"
import get from "lodash/get"
import grey from "@material-ui/core/colors/grey"

import React from "react"
import styled from "styled-components"

interface MenuItemActionsProps {
  showOnHover?: boolean
}

interface ColorSpec {
  foreground?: string
  background?: string
}

interface SectionSpec {
  active?: ColorSpec
}

interface MenuItemWrapProps {
  bold?: boolean
  colors?: SectionSpec
  pending?: boolean
}

interface MenuItemProps extends MenuItemWrapProps {
  active?: boolean
  bold?: boolean
  children?: React.ReactNode
  pending?: boolean
}

interface MenuContentProps extends MenuItemWrapProps {
  children?: React.ReactNode
}

export default (props: MenuItemProps) => {
  const { active, bold, children, colors, pending } = props
  return (
    <MenuItemWrap
      bold={!!bold}
      pending={!!pending}
      className={classnames({ active })}
      colors={colors}
    >
      {children}
    </MenuItemWrap>
  )
}

const MenuItemWrap = styled.div<MenuItemWrapProps>`
  align-items: center;
  background: rgba(255, 255, 255, 0);
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  display: flex;
  font-weight: ${(props: MenuItemWrapProps) => (props.bold ? 700 : 400)};
  margin: 0 -40px;
  padding-right: 20px;
  min-height: 44px;
  text-transform: uppercase;
  opacity: ${(props: MenuItemWrapProps) => (props.pending ? 0.5 : 1)};

  &.active {
    background: ${props => get(props, ["colors", "active", "background"], "#FFF")};
    color: ${props => get(props, ["colors", "active", "foreground"], grey[900])};
    color: #212121;
  }

  > a:first-child {
    margin-left: 0;
    margin-right: 0;
    padding-left: 40px;
  }

  a {
    align-items: center;
    align-self: stretch;
    color: inherit;
    display: flex;
    flex: 1 0;
    text-decoration: ${(props: MenuItemWrapProps) => (props.pending ? "line-through" : "none")};
  }

  small {
    display: block;
    font-weight: bold;
    font-size: 0.5em;
    opacity: 0.75;
    text-decoration: none;
  }
`

export const MenuContent = (props: MenuContentProps) => {
  const { bold, children, ...rest } = props
  return (
    <MenuItemWrap bold={!!bold}>
      <div {...rest}>
        {children}
      </div>
    </MenuItemWrap>
  )
}

export const MenuItemActions = styled.div`
  display: ${(props: MenuItemActionsProps) =>
    props.showOnHover ? "none" : "block"};
  margin: -3px 0;

  ${MenuItemWrap}:hover & {
    display: block;
  }
`
