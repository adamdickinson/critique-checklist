import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from "@material-ui/core"
import { useMutation } from "react-apollo-hooks"
import useInputValue from "@rehooks/input-value"

import React, { useEffect, useState } from "react"

import { Project } from "../models/project"
import { UpdateProject, GetProjects } from "../queries/project.graphql"
import { onEnter } from "../helpers/dom"

interface DialogProps {
  project?: Project
  onClose: () => void
  open: boolean
}

interface LoadingStatus {
  loading: boolean
  error?: string
}

export default (props: DialogProps) => {
  const nameInput = useInputValue("")
  const [status, setStatus] = useState<LoadingStatus>({
    loading: false,
    error: null
  })

  useEffect(() => {
    nameInput.onChange({ currentTarget: { value: props.project ? props.project.name : "" } })
  }, [props.project])


  const updateProject = useMutation(UpdateProject)

  const onUpdate = async () => {
    const project = { id: props.project.id, name: nameInput.value }
    setStatus({ loading: true, error: null })
    const result = await updateProject({ variables: { project } })
    props.onClose()
    nameInput.onChange({ currentTarget: { value: "" } })
    setStatus({ loading: false, error: null })
  }

  return (
    <Dialog open={props.open}>
      <DialogTitle>Update Project</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          {...nameInput}
          onKeyPress={onEnter<HTMLInputElement>(onUpdate)}
          label="Project Name"
        />
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
