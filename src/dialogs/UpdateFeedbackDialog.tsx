import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  TextField,
  Typography
} from "@material-ui/core"
import { useMutation } from "react-apollo-hooks"
import useInputValue from "@rehooks/input-value"

import React, { useEffect, useState } from "react"

import { Feedback } from "../models/feedback"
import { UpdateFeedback } from "../queries/feedback.graphql"
import { GetFeedbackRevisions } from "../queries/feedbackRevision.graphql"
import { onEnter } from "../helpers/dom"

interface DialogProps {
  feedback?: Feedback
  onClose: () => void
  open: boolean
}

interface LoadingStatus {
  loading: boolean
  error?: string
}

export default (props: DialogProps) => {
  const form = {
    detail: useInputValue(props.feedback.detail),
    summary: useInputValue(props.feedback.summary)
  }
  const [status, setStatus] = useState<LoadingStatus>({
    loading: false,
    error: null
  })

  useEffect(() => {
    form.detail.onChange({ currentTarget: { value: props.feedback ? props.feedback.detail : "" } })
    form.summary.onChange({ currentTarget: { value: props.feedback ? props.feedback.summary : "" } })
  }, [props.feedback])


  const updateFeedback = useMutation(UpdateFeedback)

  const onUpdate = async () => {
    const feedback = { 
      id: props.feedback.id,
      detail: form.detail.value,
      summary: form.summary.value
    }

    setStatus({ loading: true, error: null })
    const result = await updateFeedback({
      variables: { feedback },
      refetchQueries: () => [{ query: GetFeedbackRevisions, variables: { feedbackId: feedback.id } }]
    })
    props.onClose()
    setStatus({ loading: false, error: null })
  }

  return (
    <Dialog open={props.open}>
      <DialogTitle>Update Feedback</DialogTitle>
      <DialogContent>
        <FormGroup row style={{ marginBottom: 16 }}>
          <TextField
            autoFocus
            fullWidth
            label="Summary"
            onKeyPress={onEnter<HTMLInputElement>(onUpdate)}
            {...form.summary}
          />
        </FormGroup>

        <FormGroup row style={{ marginBottom: 16 }}>
          <TextField
            fullWidth
            multiline
            label="Detail"
            onKeyPress={onEnter<HTMLInputElement>(onUpdate)}
            {...form.detail}
          />
        </FormGroup>

        <Typography variant="caption" color="primary" style={{ marginTop: 8 }}>
          {status.error}
        </Typography>
      </DialogContent>

      <DialogActions>
        {!status.loading && (
          <Button onClick={props.onClose} color="secondary">
            Cancel
          </Button>
        )}
        <Button disabled={status.loading} onClick={onUpdate} color="primary">
          {status.loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
