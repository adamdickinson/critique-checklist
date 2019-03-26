import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core"
import { useMutation } from "react-apollo-hooks"

import React, { useState } from "react"

import { Project } from "../models/project"
import { DeleteProject, GetProjects } from "../queries/project.graphql"
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
  const [status, setStatus] = useState<LoadingStatus>({
    loading: false,
    error: null
  })
  const deleteProject = useMutation(DeleteProject, {
    update: (cache, { data: { deleteProject } }) => {
      const query = {
        query: GetProjects,
        variables: { clientId: deleteProject.clientId }
      }

      const { projects } = cache.readQuery(query)
      cache.writeQuery({
        ...query,
        data: {
          projects: projects.filter(
            (project: Project) => project.id != deleteProject.id
          )
        }
      })
    }
  })

  const onConfirm = async () => {
    setStatus({ loading: true, error: null })
    const result = await deleteProject({ variables: { id: props.project.id } })
    props.onClose()
    setStatus({ loading: false, error: null })
  }

  return (
    <Dialog open={props.open}>
      <DialogTitle>Delete Project</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you wish to delete{" "}
          {props.project ? `project '${props.project.name}'` : "this project"}?
          This action cannot be reversed.
        </Typography>
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
        <Button disabled={status.loading} onKeyPress={onEnter<HTMLButtonElement>(onConfirm)} autoFocus onClick={onConfirm} color="primary">
          {status.loading ? "Deleting..." : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
