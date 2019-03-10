import { IconButton } from "@material-ui/core"
import DeleteIcon from "mdi-react/DeleteIcon"
import PencilIcon from "mdi-react/PencilIcon"

import React from "react"

import { Project } from "../models/project"
import MenuItem, { MenuItemActions } from "./MenuItem"

interface ProjectMenuItemProps {
  project: Project
  onUpdate?: () => void
  onDelete?: () => void
}

export default ({ onUpdate, onDelete, project }: ProjectMenuItemProps) => {
  const { id, name, clientId } = project
  return (
    <MenuItem
      bold
      label={name}
      to={`/client/${clientId}/project/${id}`}
    >
      <MenuItemActions showOnHover>
        <IconButton color="inherit" onClick={onUpdate}>
          <PencilIcon />
        </IconButton>

        <IconButton color="inherit" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </MenuItemActions>
    </MenuItem>
  )
}
