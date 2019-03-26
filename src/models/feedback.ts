import { Round } from "./round"

export interface Feedback {
  id:string
  name:string
  createdAt:string
  updatedAt:string
  roundId:string
  round:Round
  summary:string
  detail:string
  completed:boolean
  with:string
}
