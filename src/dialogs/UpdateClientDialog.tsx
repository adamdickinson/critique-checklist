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

import { Client } from "../models/client"
import { UpdateClient, GetClients } from "../queries/client.graphql"
import { onEnter } from "../helpers/dom"

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
  const nameInput = useInputValue("")
  const [status, setStatus] = useState<LoadingStatus>({
    loading: false,
    error: null
  })

  useEffect(() => {
    nameInput.onChange({ currentTarget: { value: props.client ? props.client.name : "" } })
  }, [props.client])


  const updateClient = useMutation(UpdateClient)

  const onUpdate = async () => {
    const client = { id: props.client.id, name: nameInput.value }
    setStatus({ loading: true, error: null })
    const result = await updateClient({ variables: { client } })
    props.onClose()
    nameInput.onChange({ currentTarget: { value: "" } })
    setStatus({ loading: false, error: null })
  }

  return (
    <Dialog open={props.open}>
      <DialogTitle>Update Client</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          {...nameInput}
          onKeyPress={onEnter<HTMLInputElement>(onUpdate)}
          label="Client Name"
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
