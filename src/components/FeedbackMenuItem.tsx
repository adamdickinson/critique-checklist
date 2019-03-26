import { Chip } from "@material-ui/core"
import { Link } from "react-router-dom"
import CheckboxBlankOutlineIcon from "mdi-react/CheckboxBlankOutlineIcon"
import blueGrey from "@material-ui/core/colors/blueGrey"

import React from "react"
import styled from "styled-components"

import { Feedback } from "../models/feedback"
import MenuItem from "./MenuItem"

interface FeedbackMenuItemProps {
  active: boolean
  feedback: Feedback
  full: boolean
  onUpdate?: () => void
  onDelete?: () => void
}

interface IconStyleProps {
  full: boolean
}

export default ({ active, feedback, full, onUpdate, onDelete }: FeedbackMenuItemProps) => {
  const { id, completed, summary } = feedback
  return (
    <MenuItem
      active={active}
      bold
      colors={{ active: { background: blueGrey[50] } }}
      pending={completed}
    >
      <Icon full={full}>
        <CheckboxBlankOutlineIcon />
      </Icon>
      <Link to={`/feedback/${id}`}>{summary}</Link>
      {full && <Chip label={`with ${feedback.with}`} />}
    </MenuItem>
  )
}

const Icon = styled.i<IconStyleProps>`
  margin: ${({ full }) => full ? "0 8px 0 40px" : "0 8px 0 20px"};
`
