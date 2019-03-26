import { RouteChildrenProps } from "react-router"
import { useQuery } from "react-apollo-hooks"
import get from "lodash/get"

import React from "react"

import { GetRound } from "../queries/round.graphql"
import ClientPanel from "./ClientPanel"
import FeedbackPanel from "./FeedbackPanel"
import ProjectPanel from "./ProjectPanel"

interface RoundRouteParams {
  roundId: string
}

export default ({ match }: RouteChildrenProps<RoundRouteParams>) => {

  // Get match data
  const { roundId } = match.params

  // Load entities
  const roundStatus = useQuery(GetRound, { variables: { id: roundId }, skip: !roundId })
  const round = get(roundStatus, ["data", "round"], null)
  const project = round && round.project
  const client = project && project.client

  return (
    <>
      <ClientPanel current={{ client }} />
      <ProjectPanel current={{ client, project, round }} loading={roundStatus.loading} />
      <FeedbackPanel full current={{ round }} loading={roundStatus.loading} />
    </>
  )
}
