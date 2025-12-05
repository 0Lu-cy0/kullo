import http from '../index'
import type { ApiResponse } from '~/types/utils'
import URL_PROJECTS from './urls'
import type { Project } from '~/types/api/project'
import type { CardMovePayload } from '~/types/api/card'

const projectGetAll = (): Promise<ApiResponse<Project[]>> => http.get(URL_PROJECTS.API_PROJECTS_URL)
const projectCreate = (body: {
  name: string
  description?: string
}): Promise<ApiResponse<Project>> => http.post(URL_PROJECTS.API_PROJECTS_URL, body)
const projectById = (projectId: string): Promise<ApiResponse<Project>> =>
  http.get(URL_PROJECTS.API_PROJECT_BY_ID_URL.replace(':id', projectId))

const projectMoveCard = (body: CardMovePayload): Promise<ApiResponse> =>
  http.patch(URL_PROJECTS.API_MOVE_CARD_URL, body)

// New methods
const reorderColumns = (
  projectId: string,
  columnOrderIds: string[]
): Promise<ApiResponse<Project>> =>
  http.patch(URL_PROJECTS.API_REORDER_COLUMNS_URL.replace(':projectId', projectId), {
    columnOrderIds,
  })

const updateProject = (projectId: string, data: Partial<Project>): Promise<ApiResponse<Project>> =>
  http.put(URL_PROJECTS.API_PROJECT_BY_ID_URL.replace(':id', projectId), data)

const deleteProject = (projectId: string): Promise<ApiResponse> =>
  http.delete(URL_PROJECTS.API_PROJECT_BY_ID_URL.replace(':id', projectId))

const removeMember = (projectId: string, userId: string): Promise<ApiResponse> =>
  http.delete(
    URL_PROJECTS.API_PROJECT_MEMBERS_URL.replace(':projectId', projectId).replace(':userId', userId)
  )

const updateMemberRole = (
  projectId: string,
  changes: Array<{ user_id: string; project_role_id: string }>
): Promise<ApiResponse> =>
  http.put(URL_PROJECTS.API_PROJECT_MEMBER_ROLE_URL.replace(':projectId', projectId), { changes })

const toggleFreeMode = (projectId: string, free_mode: boolean): Promise<ApiResponse<Project>> =>
  http.patch(URL_PROJECTS.API_PROJECT_SETTINGS_URL.replace(':projectId', projectId), {
    free_mode,
  })

const toggleFavorite = (
  projectId: string,
  liked: boolean
): Promise<ApiResponse<Pick<Project, '_id' | 'name' | 'liked'>>> =>
  http.patch(URL_PROJECTS.API_PROJECT_FAVORITE_URL.replace(':projectId', projectId), { liked })

export const ProjectService = {
  projectGetAll,
  projectCreate,
  projectById,
  projectMoveCard,
  reorderColumns,
  updateProject,
  deleteProject,
  removeMember,
  updateMemberRole,
  toggleFreeMode,
  toggleFavorite,
}
