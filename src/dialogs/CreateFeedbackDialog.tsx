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

import React, { useState } from "react"

import { CreateFeedback, GetFeedbacks } from "../queries/feedback.graphql"
import { Round } from "../models/round"
import { onEnter } from "../helpers/dom"

interface DialogProps {
  round: Round
  open: boolean
  onClose: () => void
}

interface LoadingStatus {
  loading: boolean
  error?: Error
}

export default ({ round, open, onClose }: DialogProps) => {
  const form = {
    summary: useInputValue(""),
    detail: useInputValue(""),
    with: useInputValue(""),
  }

  const feedback = {
    completed: false,
    detail: form.detail.value,
    roundId: round.id,
    summary: form.summary.value,
    with: form.with.value,
  }

  const [status, setStatus] = useState<LoadingStatus>({
    loading: false,
    error: null
  })

  const createFeedback = useMutation(CreateFeedback, {
    update: (cache, { data: { createFeedback } }) => {
      const query = {
        query: GetFeedbacks,
        variables: { roundId: createFeedback.roundId }
      }

      let { feedbacks } = cache.readQuery(query)
      feedbacks = [...feedbacks, createFeedback]
      cache.writeQuery({
        ...query,
        data: { feedbacks }
      })
    }
  })

  const onCreate = async () => {
    setStatus({ loading: true, error: null })
    try {
      const result = await createFeedback({ variables: { feedback } })
      onClose()
      setStatus({ loading: false, error: null })

    } catch(error) {
      setStatus({ loading: false, error })
    }
  }

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Add Feedback</DialogTitle>
      <DialogContent>
        <FormGroup row style={{ marginBottom: 16 }}>
          <TextField
            autoFocus
            fullWidth
            label="Summary"
            onKeyPress={onEnter<HTMLInputElement>(onCreate)}
            {...form.summary}
          />
        </FormGroup>

        <FormGroup row style={{ marginBottom: 16 }}>
          <TextField
            fullWidth
            multiline
            label="Detail"
            onKeyPress={onEnter<HTMLInputElement>(onCreate)}
            {...form.detail}
          />
        </FormGroup>

        <FormGroup row style={{ marginBottom: 16 }}>
          <TextField
            autoFocus
            fullWidth
            label="With"
            onKeyPress={onEnter<HTMLInputElement>(onCreate)}
            {...form.with}
          />
        </FormGroup>

        <Typography variant="caption" color="primary" style={{ marginTop: 8 }}>
          {status.error && status.error.message}
        </Typography>
      </DialogContent>

      <DialogActions>
        {!status.loading && (
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
        )}
        <Button disabled={status.loading} onClick={onCreate} color="primary">
          {status.loading ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
