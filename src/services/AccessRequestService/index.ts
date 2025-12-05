import http from '../index'
import type { ApiResponse } from '~/types/utils'
import URL_ACCESS_REQUESTS from './urls'
import type {
  AccessRequest,
  AccessRequestDetail,
  CreateAccessRequestPayload,
  ApproveAccessRequestPayload,
} from '~/types/api/accessRequest'

const getUserRequests = (): Promise<ApiResponse<AccessRequest[]>> =>
  http.get(URL_ACCESS_REQUESTS.API_ACCESS_REQUESTS_ME_URL)

const requestAccess = (data: CreateAccessRequestPayload): Promise<ApiResponse<AccessRequest>> =>
  http.post(URL_ACCESS_REQUESTS.API_ACCESS_REQUESTS_URL, data)

const getProjectRequests = (projectId: string): Promise<ApiResponse<AccessRequestDetail[]>> =>
  http.get(URL_ACCESS_REQUESTS.API_PROJECT_ACCESS_REQUESTS_URL.replace(':projectId', projectId))

const approveRequest = (
  requestId: string,
  data?: ApproveAccessRequestPayload
): Promise<ApiResponse> =>
  http.patch(
    URL_ACCESS_REQUESTS.API_ACCESS_REQUEST_ACCEPT_URL.replace(':requestId', requestId),
    data
  )

const rejectRequest = (requestId: string): Promise<ApiResponse> =>
  http.patch(URL_ACCESS_REQUESTS.API_ACCESS_REQUEST_REJECT_URL.replace(':requestId', requestId))

export const AccessRequestService = {
  getUserRequests,
  requestAccess,
  getProjectRequests,
  approveRequest,
  rejectRequest,
}
