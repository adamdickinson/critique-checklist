import { Project } from "./project"

export interface Round {
  id:string
  number:number
  projectId:string
  active:boolean
  openAt:string
  closeAt:string
  project:Project
}
