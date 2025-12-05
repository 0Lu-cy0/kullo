export interface AccessRequest {
  _id: string
  project_id: string
  user_id: string
  status: 'pending' | 'approved' | 'rejected'
  message?: string
  createdAt: string
  updatedAt: string
}

export interface AccessRequestDetail extends AccessRequest {
  project: {
    _id: string
    name: string
    description?: string
  }
  user: {
    _id: string
    name: string
    email: string
  }
}

export interface CreateAccessRequestPayload {
  project_id: string
  message?: string
}

export interface ApproveAccessRequestPayload {
  role?: string
}
