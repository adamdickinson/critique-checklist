import { Project } from "./project"

export interface Round {
  id:string
  number:number
  projectId:string
  active:boolean
  openAt:string
  closedAt:string
  project:Project
}
