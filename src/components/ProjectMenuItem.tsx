import { IconButton } from "@material-ui/core"
import { Link } from "react-router-dom"
import DeleteIcon from "mdi-react/DeleteIcon"
import PencilIcon from "mdi-react/PencilIcon"

import React from "react"

import { Project } from "../models/project"
import MenuItem, { MenuItemActions } from "./MenuItem"

interface ProjectMenuItemProps {
  active: boolean
  project: Project
  onUpdate?: () => void
  onDelete?: () => void
}

export default ({ active, onUpdate, onDelete, project }: ProjectMenuItemProps) => {
  const { id, name, clientId } = project
  return (
    <MenuItem
      active={active}
      bold
    >
      <Link to={`/project/${id}`}>{name}</Link>
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
