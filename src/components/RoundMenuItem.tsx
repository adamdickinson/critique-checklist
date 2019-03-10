import { IconButton } from "@material-ui/core"
import DeleteIcon from "mdi-react/DeleteIcon"
import PencilIcon from "mdi-react/PencilIcon"
import moment from "moment"

import React from "react"

import { Round } from "../models/round"
import MenuItem, { MenuItemActions } from "./MenuItem"

interface RoundMenuItemProps {
  round: Round
  onUpdate?: () => void
  onDelete?: () => void
}

export default ({ onUpdate, onDelete, round }: RoundMenuItemProps) => {
  const { closeAt, id, number, openAt, project } = round
  let notice = ""
  const now = moment()
  if( now.isAfter(closeAt) ) notice = `Closed ${moment(closeAt).fromNow(true)}`
  else if( now.isBefore(openAt) ) notice = `Scheduled to start ${moment(openAt).fromNow()}`

  return (
    <MenuItem
      key={id}
      label={`Round ${number}`}
      sublabel={notice}
      to={`/client/${project.clientId}/project/${project.id}/round/${id}`}
      pending={!round.active}
    >
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
