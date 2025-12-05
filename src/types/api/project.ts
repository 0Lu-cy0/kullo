export interface Member {
  user_id: string
  project_role_id: string
  joined_at: string
}

export interface Project {
  _id: string
  name: string
  description: string
  status: string
  priority: string
  end_date: null
  member_count: 1
  last_activity: string
  _destroy: boolean
  free_mode: boolean
  liked?: boolean
  members: Member[]
  createdAt: string
  updatedAt: string
  columns: string[]
}

export interface CreateProjectResponse {
  name: string
  description: string
  created_by: string
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold'
  priority: 'low' | 'medium' | 'high'
}
