// Member types based on backend response
export interface Member {
  user_id: string
  name: string
  email: string
  role: string
  role_id: string
  joined_at: string
}

export interface GetMembersResponse {
  status: string
  message: string
  data: Member[]
}
