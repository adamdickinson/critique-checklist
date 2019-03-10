import { Button, IconButton, Typography } from "@material-ui/core"
import { Query } from "react-apollo"
import DeleteIcon from "mdi-react/DeleteIcon"
import PencilIcon from "mdi-react/PencilIcon"
import pink from "@material-ui/core/colors/pink"

import React, { useContext, useState } from "react"
import styled from "styled-components"

import { AuthConsumerValue, AuthContext } from "../components/AuthProvider"
import { Client } from "../models/client"
import { GetClients } from "../queries/client.graphql"
import ButtonItem from "../components/ButtonItem"
import CreateClientDialog from "../dialogs/CreateClientDialog"
import DeleteClientDialog from "../dialogs/DeleteClientDialog"
import MenuItem, { MenuContent, MenuItemActions } from "../components/MenuItem"
import Panel from "../components/Panel"
import UpdateClientDialog from "../dialogs/UpdateClientDialog"
import gradients from "../config/gradients"

enum ClientDialog {
  Create = "CREATE",
  Delete = "DELETE",
  Update = "UPDATE"
}

export default () => {
  const [dialog, openDialog] = useState<ClientDialog>(null)
  const [client, setClient] = useState<Client>(null)
  const closeDialog = () => openDialog(null)
  const { logOut } = useContext<AuthConsumerValue>(AuthContext)

  const createClient = () => openDialog(ClientDialog.Create)
  const deleteClient = (client: Client) => () => {
    setClient(client)
    openDialog(ClientDialog.Delete)
  }
  const updateClient = (client: Client) => () => {
    setClient(client)
    openDialog(ClientDialog.Update)
  }

  return (
    <>
      <ClientPanel foreground="#FFF" gradient={gradients.purple} width="380px">
        <section>
          <Typography
            variant="h1"
            color="inherit"
            style={{ fontSize: 40, marginBottom: 32 }}
          >
            Critique
          </Typography>

          <Query query={GetClients}>
            {({ loading, error, data }) => {
              let message
              if (loading) message = "Loading clients..."
              else if (error) message = "Unable to load clients"
              else if( !data.clients.length ) message = "No clients yet" 

              return (
                <>
                  {message && <MenuContent>{message}</MenuContent>}

                  {!message && data.clients.map((client: Client) => (
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
                  ))}

                  {!error && !loading && (
                    <ButtonItem color={pink["A400"]} onClick={() => openDialog(ClientDialog.Create)}>
                      New Client
                    </ButtonItem>
                  )}
                </>
              )

            }}
          </Query>
        </section>

        <section>
          {logOut && <Button color="inherit" onClick={logOut}>Log out</Button>}
        </section>
      </ClientPanel>

      <CreateClientDialog
        onClose={closeDialog}
        open={dialog === ClientDialog.Create}
      />

      <DeleteClientDialog
        client={client}
        onClose={closeDialog}
        open={dialog === ClientDialog.Delete}
      />

      <UpdateClientDialog
        client={client}
        onClose={closeDialog}
        open={dialog === ClientDialog.Update}
      />
    </>
  )
}

const ClientPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
