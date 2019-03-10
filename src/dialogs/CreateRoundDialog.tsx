import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
  Typography
} from "@material-ui/core"
import { useMutation } from "react-apollo-hooks"
import moment from "moment"
import useInputValue from "@rehooks/input-value"

import React, { useState } from "react"

import { CreateRound } from "../queries/round.graphql"
import { GetProject } from "../queries/project.graphql"
import { Project } from "../models/project"
import { onEnter } from "../helpers/dom"

interface DialogProps {
  project: Project
  open: boolean
  onClose: () => void
}

interface LoadingStatus {
  loading: boolean
  error?: Error
}

export default ({ project, open, onClose }: DialogProps) => {
  const [toSchedule, setToSchedule] = useState(false)
  const toggleToSchedule = () => setToSchedule(!toSchedule)
  const defaultScheduleDate = moment().add("day", 1).startOf("day").format(moment.HTML5_FMT.DATETIME_LOCAL)
  const openAt = useInputValue(defaultScheduleDate)

  const reset = () => {
    setToSchedule(false)
    openAt.onChange({ currentTarget: { value: defaultScheduleDate } })
  }

  const round = {
    openAt: toSchedule ? moment(openAt.value).toISOString() : null,
    projectId: project.id
  }

  const [status, setStatus] = useState<LoadingStatus>({
    loading: false,
    error: null
  })

  const createRound = useMutation(CreateRound, {
    update: (cache, { data: { createRound } }) => {
      const query = {
        query: GetProject,
        variables: { id: createRound.projectId }
      }

      const { project } = cache.readQuery(query)
      project.rounds.push(createRound)
      cache.writeQuery({
        ...query,
        data: { project }
      })
    }
  })

  const onCreate = async () => {
    setStatus({ loading: true, error: null })
    try {
      const result = await createRound({ variables: { round } })
      onClose()
      reset()
      setStatus({ loading: false, error: null })

    } catch(error) {
      setStatus({ loading: false, error })
    }
  }

  return (
    <Dialog open={open}>
      <DialogTitle>Create Round</DialogTitle>
      <DialogContent>
        <FormGroup row style={{ marginBottom: 16 }}>
          <FormControlLabel
            style={{ marginRight: 16 }}
            control={
              <Switch
                color="primary"
                checked={!!round.openAt}
                onChange={toggleToSchedule}
              />
            }
            label="Schedule"
          />

          <TextField
            autoFocus
            disabled={!round.openAt}
            label="Scheduled Time"
            onKeyPress={onEnter<HTMLInputElement>(onCreate)}
            type="datetime-local"
            {...openAt}
          />
        </FormGroup>

        <Typography variant="body1">
          By starting a new round, any previous round will be closed and all
          tasks will be brought across. You can schedule a round to start at a
          specific time and date, or you can open it immediately.
        </Typography>
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
