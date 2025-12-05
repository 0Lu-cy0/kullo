export interface Invite {
  _id: string
  project_id: string
  invited_by: string
  invited_user?: string
  invite_email?: string
  role: string
  invite_token: string
  invite_link: string
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
  expires_at?: string
  is_permanent: boolean
  createdAt: string
  updatedAt: string
}

export interface InviteDetail extends Invite {
  project: {
    _id: string
    name: string
    description?: string
  }
  inviter: {
    _id: string
    name: string
    email: string
  }
}

export interface SendInvitePayload {
  project_id: string
  invite_email: string
  role?: string
  message?: string
}

export interface AcceptInvitePayload {
  invite_token?: string
}

export interface RejectInvitePayload {
  invite_token?: string
}
