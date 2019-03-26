import blueGrey from "@material-ui/core/colors/blueGrey"

import React from "react"
import styled from "styled-components"

import { Feedback } from "../models/feedback"
import Panel from "../components/Panel"

interface FeedbackDetailProps {
  feedback?: Feedback
  loading: boolean
}

export default ({ feedback }: FeedbackDetailProps) => {
  return <FeedbackDetailPanel background="#FFF" foreground={blueGrey[900]} />
}

const FeedbackDetailPanel = styled(Panel)`
  display: flex;
  flex: 1 0;
  flex-direction: column;
  justify-content: space-between;
`
