import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core"
import { useMutation } from "react-apollo-hooks"
import useInputValue from "@rehooks/input-value"

import React, { useState } from "react"

import { AddClient, GetClients } from "../queries/client.graphql"
import { onEnter } from "../helpers/dom"

interface DialogProps {
  open: boolean
  onClose: () => void
}

interface LoadingStatus {
  loading: boolean
  error?: string
}

export default (props: DialogProps) => {
  const nameInput = useInputValue("")
  const [status, setStatus] = useState<LoadingStatus>({ loading: false, error: null })
  const addClient = useMutation(AddClient, {
    update: (cache, { data: { addClient } }) => {
      const { clients } = cache.readQuery({ query: GetClients })
      cache.writeQuery({
        query: GetClients,
        data: { clients: clients.concat([addClient]) }
      })
    }
  })

  const onAdd = async () => {
    const client = { name: nameInput.value }
    setStatus({ loading: true, error: null })
    const result = await addClient({ variables: { client } })
    props.onClose()
    nameInput.onChange({ currentTarget: { value: "" } })
    setStatus({ loading: false, error: null })
  }

  return (
    <Dialog
      open={props.open}
    >
      <DialogTitle>Add Client</DialogTitle>
      <DialogContent>
        <TextField autoFocus {...nameInput} onKeyPress={onEnter(onAdd)} label="Client Name" />
        <Typography variant="caption" color="primary" style={{ marginTop: 8 }}>{status.error}</Typography>
      </DialogContent>

      <DialogActions>
        {!status.loading && <Button onClick={props.onClose} color="secondary">Cancel</Button>}
        <Button disabled={status.loading} onClick={onAdd} color="primary">{status.loading ? "Adding..." : "Add"}</Button>
      </DialogActions>
    </Dialog>
  )
}
