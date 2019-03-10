import { Query } from "react-apollo"
import { Redirect } from "react-router-dom"
import { RouteChildrenProps } from "react-router"
import { Typography } from "@material-ui/core"
import { useQuery } from "react-apollo-hooks"
import deepPurple from "@material-ui/core/colors/deepPurple"
import get from "lodash/get"
import grey from "@material-ui/core/colors/grey"
import pink from "@material-ui/core/colors/pink"

import React, { useContext } from "react"
import styled from "styled-components"

import { AuthConsumerValue, AuthContext } from "../components/AuthProvider"
import { GetClient } from "../queries/client.graphql"
import { GetProject, GetProjects } from "../queries/project.graphql"
import { GetRound } from "../queries/round.graphql"
import { MenuContent } from "../components/MenuItem"
import { Project } from "../models/project"
import { Round } from "../models/round"
import ButtonItem from "../components/ButtonItem"
import CreateProjectDialog from "../dialogs/CreateProjectDialog"
import CreateRoundDialog from "../dialogs/CreateRoundDialog"
import DeleteProjectDialog from "../dialogs/DeleteProjectDialog"
import Panel from "../components/Panel"
import ProjectMenuItem from "../components/ProjectMenuItem"
import RoundMenuItem from "../components/RoundMenuItem"
import UpdateProjectDialog from "../dialogs/UpdateProjectDialog"
import useDialog from "../hooks/useDialog"

enum Dialogs {
  CreateProject = "CREATE_PROJECT",
  DeleteProject = "DELETE_PROJECT",
  UpdateProject = "UPDATE_PROJECT",
  CreateRound = "CREATE_ROUND",
  DeleteRound = "DELETE_ROUND",
  UpdateRound = "UPDATE_ROUND",
}

interface ClientParams {
  clientId?: string
  projectId?: string
  roundId?: string
}

export default ({ match }: RouteChildrenProps<ClientParams>) => {

  // Get match data
  const { clientId, projectId, roundId } = match.params

  // Load entities
  const clientStatus = useQuery(GetClient, { variables: { id: clientId }, skip: !clientId })
  const projectStatus = useQuery(GetProject, { variables: { id: projectId }, skip: !projectId })
  const roundStatus = useQuery(GetRound, { variables: { id: roundId }, skip: !roundId })

  const client = get(clientStatus, ["data", "client"], null)
  const project = get(projectStatus, ["data", "project"], null)
  const round = get(roundStatus, ["data", "round"], null)

  // Setup dialogs
  const { dialog, openDialog, closeAllDialogs } = useDialog<Dialogs>(null)
  const { logOut } = useContext<AuthConsumerValue>(AuthContext)

  // Setup actions
  const onCreateProject = () => openDialog(Dialogs.CreateProject)
  const onDeleteProject = () => openDialog(Dialogs.DeleteProject)
  const onUpdateProject = () => openDialog(Dialogs.UpdateProject)

  const onCreateRound = () => openDialog(Dialogs.CreateRound)
  const onDeleteRound = () => openDialog(Dialogs.DeleteRound)
  const onUpdateRound = () => openDialog(Dialogs.UpdateRound)

  // Redirect if no client available
  if( !clientStatus.loading && !client )
    return <Redirect to="/" />

  // Show loading if required
  if( clientStatus.loading ) {
    <ProjectPanel foreground="#FFF" background={grey[900]} width="380px">
      Loading...
    </ProjectPanel>
  }

  return (
    <>
      <ProjectPanel foreground="#FFF" background={grey[900]} width="380px">
        <section>
          <Typography
            variant="title"
            color="inherit"
            style={{ fontSize: 32, marginBottom: 32 }}
          >
            {client && client.name}
          </Typography>

          <Query query={GetProjects} variables={{ clientId }}>
            {({ loading, error, data }) => {
              let message
              if (loading) message = "Loading projects..."
              else if (error) message = "Unable to load projects"
              else if( !data.projects.length ) message = "No projects yet" 

              return (
                <>
                  {message && <MenuContent>{message}</MenuContent>}

                  {!message && data.projects.map((item: Project) => {
                    const isCurrent = project && item.id === project.id
                    const { id } = item
                    const rounds = get(project, "rounds")

                    return (
                      <React.Fragment key={id}>
                        <ProjectMenuItem 
                          key={id}
                          project={item}
                          onUpdate={onUpdateProject}
                          onDelete={onDeleteProject}
                        />

                        {isCurrent && rounds && rounds.map((round:Round) => (
                          <RoundMenuItem 
                            key={round.id}
                            round={round}
                            onUpdate={onUpdateRound}
                            onDelete={onDeleteRound}
                          />
                        ))}

                        {isCurrent && (
                          <ButtonItem color={deepPurple["A100"]} onClick={onCreateRound}>
                            New Round 
                          </ButtonItem>
                        )}
                      </React.Fragment>
                    )}
                  )}

                  {!error && !loading && (
                    <ButtonItem color={pink["A400"]} onClick={onCreateProject}>
                      New Project
                    </ButtonItem>
                  )}
                </>
              )
            }}
          </Query>
        </section>
      </ProjectPanel>

      {client && (
        <CreateProjectDialog client={client} onClose={closeAllDialogs} open={dialog === Dialogs.CreateProject} />
      )}

      {project && (
        <>
          <DeleteProjectDialog project={project} onClose={closeAllDialogs} open={dialog === Dialogs.DeleteProject} />
          <UpdateProjectDialog project={project} onClose={closeAllDialogs} open={dialog === Dialogs.UpdateProject} />
          <CreateRoundDialog project={project} onClose={closeAllDialogs} open={dialog === Dialogs.CreateRound} />
        </>
      )}

    {/**
      <DeleteRoundDialog round={round} onClose={closeAllDialogs} open={dialog === Dialogs.DeleteRound} />
      <UpdateRoundDialog round={round} onClose={closeAllDialogs} open={dialog === Dialogs.UpdateRound} />
      **/}
    </>
  )
}

const ProjectPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
