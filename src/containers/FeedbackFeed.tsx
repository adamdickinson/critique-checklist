import {
  Button,
  Card,
  CardContent,
  Divider,
  Typography
} from "@material-ui/core"
import { Query } from "react-apollo"
import blueGrey from "@material-ui/core/colors/blueGrey"
import moment from "moment"

import React, { useState } from "react"
import styled from "styled-components"

import { Feedback } from "../models/feedback"
import { FeedbackRevision } from "../models/feedbackRevision"
import { GetFeedbackRevisions } from "../queries/feedbackRevision.graphql"
import Panel from "../components/Panel"

interface FeedbackDetailProps {
  feedback?: Feedback
  loading: boolean
  onUpdateFeedback?: (feedback: Feedback) => () => void 
}

export default ({ feedback, loading, onUpdateFeedback }: FeedbackDetailProps) => {
  const [showAll, setShowAll] = useState(false)
  const onToggleShowAll = () => setShowAll(!showAll)

  return (
    <FeedbackDetailPanel background={blueGrey[50]} foreground={blueGrey[900]}>
      {!loading && (
        <div>
          <Typography variant="h5">{feedback.summary}</Typography>
          <Typography variant="subtitle1">#A0-001</Typography>
          <Typography variant="h6">Feedback</Typography>
          <Card>
            <Query
              query={GetFeedbackRevisions}
              variables={{ feedbackId: feedback.id }}
            >
              {({ loading, error, data }) => {
                if( loading ) return (
                  <>
                    <CardContent>{feedback.detail}</CardContent>
                    <Divider />
                    <CardContent>Loading more...</CardContent>
                  </>
                )

                const latest = data.feedbackRevisions[0]
                const others = data.feedbackRevisions.slice(1)
                return (
                  <>
                    <CardContent>
                      {latest.detail}
                      <Typography variant="caption">{others.length > 0 ? "Updated": "Created"} {moment(feedback.updatedAt).fromNow()}</Typography>
                    </CardContent>

                    {showAll && others.map((revision: FeedbackRevision, r:number) => (
                      <React.Fragment key={revision.id}>
                        <Divider />
                        <CardContent>
                          <Typography variant="caption">{revision.summary}</Typography>
                          {revision.detail}
                          <Typography variant="caption">Saved {moment(revision.createdAt).fromNow()}</Typography>
                        </CardContent>
                      </React.Fragment>
                    ))}
                    
                    <Divider />
                    <Actions>
                      <Button onClick={onUpdateFeedback(feedback)}>Amend Feedback</Button>
                      {others.length > 0 && (
                        <Button onClick={onToggleShowAll}>
                          {showAll ? "Hide history" : `Show ${others.length} more`}
                        </Button>
                      )}
                    </Actions>
                  </>
                )
            }}
            </Query>
          </Card>
        </div>
      )}
    </FeedbackDetailPanel>
  )
}

const FeedbackDetailPanel = styled(Panel)`
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  width: 480px;
  justify-content: space-between;
`

const Actions = styled.div`
  display: flex;
  justify-content: stretch; 

  button {
    flex: 1;
  }
`
