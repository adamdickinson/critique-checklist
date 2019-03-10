import { Client } from "./client"
import { Round } from "./round"

export interface Project {
  id:string
  name:string
  clientId:string
  client:Client
  rounds:Array<Round>
}
