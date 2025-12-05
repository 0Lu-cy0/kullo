import type { Task } from './task'

export interface ColumnMatchMeta {
  columnMatched: boolean
  cardsMatched: string[]
}

export interface Columndata {
  _id: string
  title?: string
  tittle_column?: string
  project_id: string
  createdBy: string
  cardOrderIds: string[]
  createdAt: string
  updatedAt: string
  cards: Task[]
  matchMeta?: ColumnMatchMeta
}
