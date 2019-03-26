import { RouteChildrenProps } from "react-router"
import { useQuery } from "react-apollo-hooks"
import get from "lodash/get"

import React from "react"

import { Feedback } from "../models/feedback"
import { GetFeedback } from "../queries/feedback.graphql"
import FeedbackDetail from "./FeedbackDetail"
import FeedbackFeed from "./FeedbackFeed"
import FeedbackPanel from "./FeedbackPanel"
import UpdateFeedbackDialog from "../dialogs/UpdateFeedbackDialog"
import useDialog from "../hooks/useDialog"

interface FeedbackRouteParams {
  feedbackId: string
}

enum Dialogs {
  CreateFeedback = "CREATE_FEEDBACK",
  DeleteFeedback = "DELETE_FEEDBACK",
  UpdateFeedback = "UPDATE_FEEDBACK",
}

export default ({ match }: RouteChildrenProps<FeedbackRouteParams>) => {

  // Get match data
  const { feedbackId } = match.params

  // Load entities
  const feedbackStatus = useQuery(GetFeedback, { variables: { id: feedbackId }, skip: !feedbackId })
  const feedback = get(feedbackStatus, ["data", "feedback"], null)
  const round = feedback && feedback.round

  // Setup dialogs
  const { closeAllDialogs, dialog, dialogData: dialogFeedback, openDialog } = useDialog<Dialogs, Feedback>()
  const onCreateFeedback = () => openDialog(Dialogs.CreateFeedback)
  const onDeleteFeedback = (feedback: Feedback) => () => openDialog(Dialogs.DeleteFeedback, feedback)
  const onUpdateFeedback = (feedback: Feedback) => () => openDialog(Dialogs.UpdateFeedback, feedback)

  return (
    <>
      <FeedbackPanel current={{ round, feedback }} loading={feedbackStatus.loading} />
      <FeedbackFeed feedback={feedback} loading={feedbackStatus.loading} onUpdateFeedback={onUpdateFeedback} />
      <FeedbackDetail feedback={feedback} loading={feedbackStatus.loading} />

      {dialogFeedback && (
        <UpdateFeedbackDialog feedback={dialogFeedback} onClose={closeAllDialogs} open={dialog === Dialogs.UpdateFeedback} />
      )}
    </>
  )
}
