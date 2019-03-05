import { IconButton, Typography } from "@material-ui/core"
import { Query } from "react-apollo"
import DeleteIcon from "mdi-react/DeleteIcon"
import PencilIcon from "mdi-react/PencilIcon"

import React, { useState } from "react"

import { Client } from "../models/client"
import { GetClients } from "../queries/client.graphql"
import ButtonItem from "../components/ButtonItem"
import CreateClientDialog from "../dialogs/CreateClientDialog"
import DeleteClientDialog from "../dialogs/DeleteClientDialog"
import MenuItem, { MenuItemActions } from "../components/MenuItem"
import Panel from "../components/Panel"
import gradients from "../config/gradients"

enum ClientDialog {
  Create = "CREATE",
  Delete = "DELETE",
  Update = "UPDATE",
}


export default () => {
  const [dialog, openDialog] = useState<ClientDialog>(null)
  const [client, setClient] = useState<Client>(null)
  const closeDialog = () => openDialog(null)

  const createClient = () => openDialog(ClientDialog.Create)
  const deleteClient = (client:Client) => () => {
    setClient(client)
    openDialog(ClientDialog.Delete)
  }
  const updateClient = (client:Client) => () => {
    setClient(client)
    openDialog(ClientDialog.Update)
  }

  return (
    <>
      <Panel 
        foreground="#FFF"
        gradient={gradients.purple}
        width="380px"
      >
        <Typography variant="h1" color="inherit" style={{ fontSize: 32, marginBottom: 32 }}>
          Critique
        </Typography>

        <Query query={GetClients}>
          {({ loading, error, data }) => {
            if( loading ) return "Loading clients..."
            if( error ) return "Unable to load clients"
            return data.clients.map((client:Client) => (
              <MenuItem
                bold
                key={client.id}
                label={client.name}
                to={`/client/${client.id}`}
              >
                <MenuItemActions showOnHover>
                  <IconButton color="inherit" onClick={updateClient(client)}>
                    <PencilIcon />
                  </IconButton>

                  <IconButton color="inherit" onClick={deleteClient(client)}>
                    <DeleteIcon />
                  </IconButton>
                </MenuItemActions>
              </MenuItem>
            ))
          }}
        </Query>
        <ButtonItem onClick={() => openDialog(ClientDialog.Create)}>New Client</ButtonItem>
      </Panel>
      
      <CreateClientDialog open={dialog === ClientDialog.Create} onClose={closeDialog} />
      <DeleteClientDialog open={dialog === ClientDialog.Delete} client={client} onClose={closeDialog} />
    </>
  )
}
