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

import React, { useState } from "react"

import { Client } from "../models/client"
import { CreateProject, GetProjects } from "../queries/project.graphql"
import { onEnter } from "../helpers/dom"

interface DialogProps {
  client: Client
  open: boolean
  onClose: () => void
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
  const createProject = useMutation(CreateProject, {
    update: (cache, { data: { createProject } }) => {
      const query = {
        query: GetProjects,
        variables: { clientId: createProject.clientId }
      }

      const { projects } = cache.readQuery(query)
      cache.writeQuery({
        ...query,
        data: { projects: projects.concat([createProject]) }
      })
    }
  })

  const onCreate = async () => {
    const project = { name: nameInput.value, clientId: props.client.id }
    setStatus({ loading: true, error: null })
    const result = await createProject({ variables: { project } })
    props.onClose()
    nameInput.onChange({ currentTarget: { value: "" } })
    setStatus({ loading: false, error: null })
  }

  return (
    <Dialog open={props.open}>
      <DialogTitle>Create Project</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          {...nameInput}
          onKeyPress={onEnter<HTMLInputElement>(onCreate)}
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
        <Button disabled={status.loading} onClick={onCreate} color="primary">
          {status.loading ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
