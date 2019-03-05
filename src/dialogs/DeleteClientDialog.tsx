import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core"
import { useMutation } from "react-apollo-hooks"

import React, { useState } from "react"

import { Client } from "../models/client"
import { DeleteClient, GetClients } from "../queries/client.graphql"

interface DialogProps {
  client?: Client
  onClose: () => void
  open: boolean
}

interface LoadingStatus {
  loading: boolean
  error?: string
}

export default (props: DialogProps) => {
  const [status, setStatus] = useState<LoadingStatus>({ loading: false, error: null })
  const deleteClient = useMutation(DeleteClient, {
    update: (cache, { data: { deleteClient } }) => {
      const { clients } = cache.readQuery({ query: GetClients })
      cache.writeQuery({
        query: GetClients,
        data: { clients: clients.filter((client:Client) => client.id != deleteClient.id) }
      })
    }
  })

  const onConfirm = async () => {
    setStatus({ loading: true, error: null })
    const result = await deleteClient({ variables: { id: props.client.id } })
    props.onClose()
    setStatus({ loading: false, error: null })
  }

  return (
    <Dialog
      open={props.open}
    >
      <DialogTitle>Delete Client</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you wish to delete <strong>{props.client ? props.client.name : "this client"}</strong>? This action cannot be reversed.
        </Typography>
        <Typography variant="caption" color="primary" style={{ marginTop: 8 }}>{status.error}</Typography>
      </DialogContent>

      <DialogActions>
        {!status.loading && <Button onClick={props.onClose} color="secondary">Cancel</Button>}
        <Button disabled={status.loading} onClick={onConfirm} color="primary">{status.loading ? "Deleting..." : "Confirm"}</Button>
      </DialogActions>
    </Dialog>
  )
}
