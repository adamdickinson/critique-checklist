import { Button, IconButton, Typography } from "@material-ui/core"
import { Link } from "react-router-dom"
import { Query } from "react-apollo"
import DeleteIcon from "mdi-react/DeleteIcon"
import PencilIcon from "mdi-react/PencilIcon"
import pink from "@material-ui/core/colors/pink"

import React, { useContext } from "react"
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
import useDialog from "../hooks/useDialog"

enum ClientDialog {
  Create = "CREATE",
  Delete = "DELETE",
  Update = "UPDATE"
}

interface ActiveClientEntities {
  client?: Client
}

interface ClientPanelProps {
  current?: ActiveClientEntities
}

export default ({ current }: ClientPanelProps) => {
  current = { ...current }
  const { closeAllDialogs, dialog, dialogData: dialogClient, openDialog } = useDialog<ClientDialog, Client>()
  const { logOut } = useContext<AuthConsumerValue>(AuthContext)

  const createClient = () => openDialog(ClientDialog.Create)
  const deleteClient = (client: Client) => () => openDialog(ClientDialog.Delete, client)
  const updateClient = (client: Client) => () => openDialog(ClientDialog.Update, client)

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
                      active={current.client && current.client.id === client.id}
                      bold
                      key={client.id}
                    >
                      <Link to={`/client/${client.id}`}>{client.name}</Link>
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
                    <ButtonItem color={pink["A400"]} onClick={createClient}>
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

      <CreateClientDialog onClose={closeAllDialogs} open={dialog === ClientDialog.Create} />
      <DeleteClientDialog client={dialogClient} onClose={closeAllDialogs} open={dialog === ClientDialog.Delete} />
      <UpdateClientDialog client={dialogClient} onClose={closeAllDialogs} open={dialog === ClientDialog.Update} />
    </>
  )
}

const ClientPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
