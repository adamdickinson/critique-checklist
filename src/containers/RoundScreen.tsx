import { RouteChildrenProps } from "react-router"
import { useQuery } from "react-apollo-hooks"
import get from "lodash/get"

import React from "react"

import { GetProject } from "../queries/project.graphql"
import ClientPanel from "./ClientPanel"
import ProjectPanel from "./ProjectPanel"

interface ProjectRouteParams {
  projectId: string
}

export default ({ match }: RouteChildrenProps<ProjectRouteParams>) => {

  // Get match data
  const { projectId } = match.params

  // Load entities
  const projectStatus = useQuery(GetProject, { variables: { id: projectId }, skip: !projectId })
  const project = get(projectStatus, ["data", "project"], null)
  const client = project && project.client

  return (
    <>
      <ClientPanel current={{ client }} />
      <ProjectPanel current={{ client, project }} loading={projectStatus.loading} />
    </>
  )
}
