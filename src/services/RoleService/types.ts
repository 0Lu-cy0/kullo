export interface Permission {
  _id: string
  name: string
  description: string
  category: 'project' | 'task'
  _destroy: boolean
  createdAt: string
  updatedAt: string
}

export interface Role {
  _id: string
  project_id: string
  default_role_id: string
  name: string
  permissions: Permission[]
  _destroy: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectRolesResponse {
  Status: number
  StatusCode: number
  Object: string
  isOk: boolean
  isError: boolean
  message: string
  data: Role[]
}
