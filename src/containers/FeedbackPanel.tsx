import { Query } from "react-apollo"
import blueGrey from "@material-ui/core/colors/blueGrey"
import pink from "@material-ui/core/colors/pink"

import React from "react"
import styled from "styled-components"

import { Client } from "../models/client"
import { Feedback } from "../models/feedback"
import { GetFeedbacks } from "../queries/feedback.graphql"
import { MenuContent } from "../components/MenuItem"
import { Project } from "../models/project"
import { Round } from "../models/round"
import ButtonItem from "../components/ButtonItem"
import CreateFeedbackDialog from "../dialogs/CreateFeedbackDialog"
import FeedbackMenuItem from "../components/FeedbackMenuItem"
import Panel from "../components/Panel"
import useDialog from "../hooks/useDialog"

enum Dialogs {
  CreateFeedback = "CREATE_FEEDBACK",
  DeleteFeedback = "DELETE_FEEDBACK",
  UpdateFeedback = "UPDATE_FEEDBACK",
}

interface ActiveFeedbackEntities {
  round?: Round
  feedback?: Feedback
}

interface FeedbackPanelProps {
  current: ActiveFeedbackEntities
  full?: boolean
  loading: boolean
}

interface FeedbackPanelStyleProps {
  full?: boolean
}

export default ({ current, full, loading }: FeedbackPanelProps) => {
  current = { ...current }

  const { closeAllDialogs, dialog, dialogData: dialogFeedback, openDialog } = useDialog<Dialogs, Feedback>()
  const onCreateFeedback = () => openDialog(Dialogs.CreateFeedback)
  const onDeleteFeedback = (feedback: Feedback) => () => openDialog(Dialogs.DeleteFeedback, feedback)
  const onUpdateFeedback = (feedback: Feedback) => () => openDialog(Dialogs.UpdateFeedback, feedback)

  // Show loading if required
  if( loading ) {
    return (
      <FeedbackPanel foreground="#FFF" full={full} background={blueGrey[900]} width="380px">
        Loading...
      </FeedbackPanel>
    )
  }

  return (
    <>
      <FeedbackPanel foreground="#FFF" full={full} background={blueGrey[900]} width="380px">
        <section>
          <Query query={GetFeedbacks} variables={{ roundId: current.round.id }}>
            {({ loading, error, data }) => {
              let message
              if (loading) message = "Loading feedback..."
              else if (error) message = "Unable to load feedback"
              else if( !data.feedbacks.length ) message = "No feedback yet" 

              return (
                <>
                  {message && <MenuContent>{message}</MenuContent>}

                  {!message && data.feedbacks.map((feedback: Feedback) => {
                    const { id } = feedback

                    return (
                      <FeedbackMenuItem 
                        active={current.feedback && current.feedback.id === feedback.id}
                        feedback={feedback}
                        key={id}
                        onDelete={onDeleteFeedback(feedback)}
                        onUpdate={onUpdateFeedback(feedback)}
                        full={full}
                      />
                    )}
                  )}

                  {!error && !loading && (
                    <ButtonItem color={pink["A400"]} onClick={onCreateFeedback}>
                      Add Feedback
                    </ButtonItem>
                  )}
                </>
              )
            }}
          </Query>
        </section>
      </FeedbackPanel>

      {current.round && (
        <CreateFeedbackDialog round={current.round} onClose={closeAllDialogs} open={dialog === Dialogs.CreateFeedback} />
      )}
    </>
  )
}

const FeedbackPanel = styled(Panel)<FeedbackPanelStyleProps>`
  display: flex;
  flex: ${({ full }) => full ? "1 0" : "0 0 auto"};
  flex-direction: column;
  justify-content: space-between;
`
