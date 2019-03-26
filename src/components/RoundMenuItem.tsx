import { IconButton } from "@material-ui/core"
import { Link } from "react-router-dom"
import DeleteIcon from "mdi-react/DeleteIcon"
import PencilIcon from "mdi-react/PencilIcon"
import moment from "moment"

import React from "react"

import { Round } from "../models/round"
import MenuItem, { MenuItemActions } from "./MenuItem"

interface RoundMenuItemProps {
  active: boolean
  round: Round
  onUpdate?: () => void
  onDelete?: () => void
}

export default ({ active, onUpdate, onDelete, round }: RoundMenuItemProps) => {
  const { closedAt, id, number, openAt, project } = round
  let notice = ""
  const now = moment()
  if( now.isAfter(closedAt) ) notice = `Closed ${moment(closedAt).fromNow(true)}`
  else if( now.isBefore(openAt) ) notice = `Scheduled to start ${moment(openAt).fromNow()}`

  return (
    <MenuItem
      active={active}
      key={id}
      pending={!round.active}
    >
      <Link to={`/round/${id}`}>
        <span>Round {number}</span>
        <small>{notice}</small>
      </Link>
      <MenuItemActions showOnHover>
        {onUpdate && (
          <IconButton color="inherit" onClick={onUpdate}>
            <PencilIcon />
          </IconButton>
        )}

        {onDelete && (
          <IconButton color="inherit" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        )}
      </MenuItemActions>
    </MenuItem>
  )
}
