import http from '../index'
import type { ApiResponse } from '~/types/utils'
import URL_INVITES from './urls'
import type {
  Invite,
  InviteDetail,
  SendInvitePayload,
  AcceptInvitePayload,
  RejectInvitePayload,
} from '~/types/api/invite'

interface PermanentInvitePayload {
  _id?: string
  project_id?: string
  invite_link?: string
  invite_token?: string
  status?: string
  role_id?: string
  is_permanent?: boolean
}

interface PermanentInviteResponse {
  message?: string
  invite?: PermanentInvitePayload
  data?: PermanentInvitePayload
}

const getUserInvites = (): Promise<ApiResponse<Invite[]>> =>
  http.get(URL_INVITES.API_INVITES_ME_URL)

const getPermanentLink = (projectId: string): Promise<PermanentInviteResponse> =>
  http.get(URL_INVITES.API_INVITE_PERMANENT_LINK_URL.replace(':projectId', projectId))

const getEmailInvites = (projectId: string): Promise<ApiResponse<Invite[]>> =>
  http.get(URL_INVITES.API_INVITE_EMAILS_URL.replace(':projectId', projectId))

const sendInvite = (data: SendInvitePayload): Promise<ApiResponse<Invite>> =>
  http.post(URL_INVITES.API_INVITES_URL, data)

const acceptInvite = (inviteId: string, data?: AcceptInvitePayload): Promise<ApiResponse> =>
  http.patch(URL_INVITES.API_INVITE_ACCEPT_URL.replace(':inviteId', inviteId), data)

const rejectInvite = (inviteId: string, data?: RejectInvitePayload): Promise<ApiResponse> =>
  http.patch(URL_INVITES.API_INVITE_REJECT_URL.replace(':inviteId', inviteId), data)

const cancelInvite = (inviteId: string): Promise<ApiResponse> =>
  http.delete(URL_INVITES.API_INVITE_BY_ID_URL.replace(':id', inviteId))

const handleInviteLink = (inviteToken: string): Promise<ApiResponse<InviteDetail>> =>
  http.get(`${URL_INVITES.API_INVITES_URL}/${inviteToken}`)

export const InviteService = {
  getUserInvites,
  getPermanentLink,
  getEmailInvites,
  sendInvite,
  acceptInvite,
  rejectInvite,
  cancelInvite,
  handleInviteLink,
}
