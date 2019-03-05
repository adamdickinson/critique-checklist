import { NavLink, NavLinkProps } from "react-router-dom"
import styled from "styled-components"
import React from "react"

interface MenuItemActionsProps {
  showOnHover?: boolean
}

interface MenuItemWrapProps {
  bold?: boolean
}

interface MenuItemProps extends NavLinkProps, MenuItemWrapProps {
  label: string
  children: React.ReactNode
}

export default (props: MenuItemProps) => {
  const { bold, children, label, ...rest } = props

  return (
    <MenuItemWrap bold={!!bold}>
      <NavLink {...rest} activeClassName="active">
        {label}
      </NavLink>
      {children}
    </MenuItemWrap>
  )
}

const MenuItemWrap = styled.div`
  align-items: center;
  background: rgba(255,255,255,0);
  border-bottom: 1px solid rgba(0,0,0,0.12);
  display: flex;
  margin: 0 -40px;

  :hover {
    background: rgba(255,255,255,0.08);
  }

  &.active {
    background: rgba(255,255,255,1);
    color: #212121;
  }

  a {
    color: inherit;
    display: block;
    flex: 1 0;
    font-weight: ${(props: MenuItemWrapProps) => props.bold ? 700 : 400};
    line-height: 50px;
    padding-left: 40px;
    text-decoration: none;
    text-transform: uppercase;
    transition: 75ms background, 75ms color;

  }
`

export const MenuItemActions = styled.div`
  display: ${(props: MenuItemActionsProps) => props.showOnHover ? "none" : "block"};

  ${MenuItemWrap}:hover & {
    display: block;
  }
`
