import { Query } from "react-apollo"
import { Typography } from "@material-ui/core"
import deepPurple from "@material-ui/core/colors/deepPurple"
import grey from "@material-ui/core/colors/grey"
import pink from "@material-ui/core/colors/pink"

import React, { useContext } from "react"
import styled from "styled-components"

import { AuthConsumerValue, AuthContext } from "../components/AuthProvider"
import { Client } from "../models/client"
import { GetProjects } from "../queries/project.graphql"
import { GetRounds } from "../queries/round.graphql"
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

interface ActiveProjectEntities {
  client: Client
  project?: Project
  round?: Round
}

interface ProjectPanelProps {
  current: ActiveProjectEntities
  loading: boolean
}

export default ({ current, loading }: ProjectPanelProps) => {
  current = { ...current }

  // Setup dialogs
  const { closeAllDialogs, dialog, dialogData: dialogProject, openDialog } = useDialog<Dialogs, Project>()
  const { logOut } = useContext<AuthConsumerValue>(AuthContext)

  // Setup actions
  const onCreateProject = () => openDialog(Dialogs.CreateProject)
  const onDeleteProject = (project: Project) => () => openDialog(Dialogs.DeleteProject, project)
  const onUpdateProject = (project: Project) => () => openDialog(Dialogs.UpdateProject, project)

  const onCreateRound = () => openDialog(Dialogs.CreateRound)
  const onDeleteRound = (round: Round) => () => openDialog(Dialogs.DeleteRound)
  const onUpdateRound = (round: Round) => () => openDialog(Dialogs.UpdateRound)

  // Show loading if required
  if( loading )
    return (
      <ProjectPanel foreground="#FFF" background={grey[900]} width="380px">
        Loading...
      </ProjectPanel>
    )

  return (
    <>
      <ProjectPanel foreground="#FFF" background={grey[900]} width="380px">
        <section>
          <Typography
            variant="h6"
            color="inherit"
            style={{ fontSize: 32, marginBottom: 32 }}
          >
            {current.client.name}
          </Typography>

          <Query query={GetProjects} variables={{ clientId: current.client.id }}>
            {({ loading, error, data }) => {
              let message
              if (loading) message = "Loading projects..."
              else if (error) message = "Unable to load projects"
              else if( !data.projects.length ) message = "No projects yet" 

              return (
                <>
                  {message && <MenuContent>{message}</MenuContent>}

                  {!message && data.projects.map((project: Project) => {
                    const isCurrent = current.project && project.id === current.project.id
                    return (
                      <React.Fragment key={project.id}>
                        <ProjectMenuItem 
                          active={isCurrent}
                          key={project.id}
                          onDelete={onDeleteProject(project)}
                          onUpdate={onUpdateProject(project)}
                          project={project}
                        />

                        {isCurrent && (
                          <>
                            <Query query={GetRounds} variables={{ projectId: current.project.id }}>
                              {({ loading, data }) => !loading && data.rounds.map((round:Round) => (
                                <RoundMenuItem 
                                  active={current.round && round.id === current.round.id}
                                  key={round.id}
                                  round={round}
                                  onUpdate={onUpdateRound(round)}
                                  onDelete={onDeleteRound(round)}
                                />
                              ))}
                            </Query>
                            <ButtonItem color={deepPurple["A100"]} onClick={onCreateRound}>
                              New Round 
                            </ButtonItem>
                          </>
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

      {current.client && (
        <CreateProjectDialog client={current.client} onClose={closeAllDialogs} open={dialog === Dialogs.CreateProject} />
      )}

      {dialogProject && (
        <>
          <DeleteProjectDialog project={dialogProject} onClose={closeAllDialogs} open={dialog === Dialogs.DeleteProject} />
          <UpdateProjectDialog project={dialogProject} onClose={closeAllDialogs} open={dialog === Dialogs.UpdateProject} />
          <CreateRoundDialog project={dialogProject} onClose={closeAllDialogs} open={dialog === Dialogs.CreateRound} />
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
