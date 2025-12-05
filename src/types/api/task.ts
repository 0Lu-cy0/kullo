export interface Task {
  _id: string
  title?: string
  tittle_card?: string
  name?: string
  description?: string
  status: 'todo' | 'in_progress' | 'testing' | 'completed'
  priority: 'low' | 'medium' | 'high'
  project_id: string
  columnId?: string
  column_id?: string
  assignees?: AssignedUser[]
  assigned_to?: AssignedUser[]
  due_date?: string
  start_date?: string
  created_by: string
  _destroy: boolean
  createdAt: string
  updatedAt: string
}

export interface AssignedUser {
  user_id: string
  assigned_at: string
}

export interface CreateTaskPayload {
  name: string
  description?: string
  status?: string
  priority?: string
  project_id: string
  column_id: string
  due_date?: string
  start_date?: string
}

export interface UpdateTaskPayload {
  name?: string
  description?: string
  status?: string
  priority?: string
  due_date?: string
  start_date?: string
}

export interface AssignTaskPayload {
  user_id: string
}

export interface TaskFilters {
  status?: string
  priority?: string
  assigned_to?: string
  project_id?: string
  column_id?: string
  page?: number
  limit?: number
}
