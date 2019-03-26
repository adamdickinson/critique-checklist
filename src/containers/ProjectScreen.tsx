import { RouteChildrenProps } from "react-router"
import { useQuery } from "react-apollo-hooks"
import get from "lodash/get"

import React from "react"

import { GetClient } from "../queries/client.graphql"
import ClientPanel from "./ClientPanel"
import ProjectPanel from "./ProjectPanel"

interface ProjectRouteParams {
  clientId: string
}

export default ({ match }: RouteChildrenProps<ProjectRouteParams>) => {

  // Get match data
  const { clientId } = match.params

  // Load entities
  const clientStatus = useQuery(GetClient, { variables: { id: clientId }, skip: !clientId })
  const client = get(clientStatus, ["data", "client"], null)

  return (
    <>
      <ClientPanel current={{ client }} />
      <ProjectPanel current={{ client }} loading={clientStatus.loading} />
    </>
  )
}
