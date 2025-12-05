import type { Columndata } from './column'

export interface SearchResult {
  projects: ProjectSearchResult[]
  tasks: TaskSearchResult[]
  users: UserSearchResult[]
  total_results: number
}

export interface ProjectSearchResult {
  _id: string
  name: string
  description?: string
  status: string
  priority: string
  member_count: number
  end_date?: string | null
  liked?: boolean
}

export interface TaskSearchResult {
  _id: string
  name: string
  description?: string
  status: string
  priority: string
  project_id: string
  project_name?: string
}

export interface UserSearchResult {
  _id: string
  name: string
  email: string
  role?: string
}

export interface SearchFilters {
  q: string
  type?: 'projects' | 'tasks' | 'users' | 'all'
  limit?: number
  page?: number
}

export interface ProjectSearchFiltersRequest {
  limit?: number
  page?: number
  status?: string | string[]
  priority?: string | string[]
}

export interface BoardSearchMeta {
  query: string
  totalColumns: number
  totalCards: number
  matchedColumns: number
  matchedCards: number
}

export interface BoardSearchResponse {
  columns: Columndata[]
  meta: BoardSearchMeta
}

export interface BoardSearchFiltersRequest {
  priority?: string[]
  dueEnd?: string | null
}
