import { Link, LinkProps, Route } from "react-router-dom"

import React from "react"
import styled from "styled-components"

interface MenuItemActionsProps {
  showOnHover?: boolean
}

interface MenuItemWrapProps {
  bold?: boolean
  pending?: boolean
}

interface MenuItemProps extends LinkProps, MenuItemWrapProps {
  bold?: boolean
  children?: React.ReactNode
  label: string
  sublabel?: string
  pending?: boolean
}

interface MenuContentProps extends MenuItemWrapProps {
  children?: React.ReactNode
}

export default (props: MenuItemProps) => {
  const { bold, children, label, pending, sublabel, ...rest } = props
  const path: string = typeof rest.to === "object" ? rest.to.pathname : rest.to

  return (
    <Route path={path} children={({ match }) => (
      <>
        <MenuItemWrap bold={!!bold} pending={!!pending} className={!!match ? "active" : null}>
          <Link {...rest}>
            <span>{label}</span>
            {sublabel && <small>{sublabel}</small>}
          </Link>
          {children}
        </MenuItemWrap>
        
      </>
    )} />
  )
}

const MenuItemWrap = styled.div`
  align-items: center;
  background: rgba(255, 255, 255, 0);
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  display: flex;
  font-weight: ${(props: MenuItemWrapProps) => (props.bold ? 700 : 400)};
  margin: 0 -40px;
  min-height: 50px;
  text-transform: uppercase;
  opacity: ${(props: MenuItemWrapProps) => (props.pending ? 0.5 : 1)};

  &.active {
    background: rgba(255, 255, 255, 1);
    color: #212121;
  }

  > * {
    :first-child {
      display: block;
      flex: 1 0;
      padding-left: 40px;
    }
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  small {
    display: block;
    font-weight: bold;
    font-size: 0.5em;
    opacity: 0.75;
    text-decoration: none;
  }

  span {
    text-decoration: ${(props: MenuItemWrapProps) => (props.pending ? "line-through" : "none")};
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

  ${MenuItemWrap}:hover & {
    display: block;
  }
`
