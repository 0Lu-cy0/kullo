import http from '../index'
import type { ApiResponse } from '~/types/utils'
import URL_MEMBER from './urls'
import type { Member } from './type'

const getProjectMembers = (projectId: string): Promise<ApiResponse<Member[]>> =>
  http.get(URL_MEMBER.API_GET_PROJECT_MEMBERS.replace(':projectId', projectId))

const getAllMembers = (): Promise<ApiResponse<Member[]>> => http.get(URL_MEMBER.API_GET_ALL_MEMBERS) // ← THÊM FUNCTION NÀY

export const MemberService = {
  getProjectMembers,
  getAllMembers, // ← THÊM DÒNG NÀY
}
