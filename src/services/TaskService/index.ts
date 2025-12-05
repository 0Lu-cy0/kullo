import http from '../index'
import type { ApiResponse } from '~/types/utils'
import URL_TASKS from './urls'
import type {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  AssignTaskPayload,
  TaskFilters,
} from '~/types/api/task'

const getTasks = (filters?: TaskFilters): Promise<ApiResponse<Task[]>> => {
  const params = new URLSearchParams()
  if (filters?.status) params.append('status', filters.status)
  if (filters?.priority) params.append('priority', filters.priority)
  if (filters?.assigned_to) params.append('assigned_to', filters.assigned_to)
  if (filters?.project_id) params.append('project_id', filters.project_id)
  if (filters?.column_id) params.append('column_id', filters.column_id)
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.limit) params.append('limit', filters.limit.toString())

  const queryString = params.toString()
  return http.get(`${URL_TASKS.API_TASKS_URL}${queryString ? `?${queryString}` : ''}`)
}

const getTaskById = (projectId: string, taskId: string): Promise<ApiResponse<Task>> =>
  http.get(URL_TASKS.API_TASK_BY_ID_URL.replace(':projectId', projectId).replace(':id', taskId))

const createTask = (data: CreateTaskPayload): Promise<ApiResponse<Task>> =>
  http.post(URL_TASKS.API_TASKS_URL, data)

const updateTask = (
  projectId: string,
  taskId: string,
  data: UpdateTaskPayload
): Promise<ApiResponse<Task>> =>
  http.put(
    URL_TASKS.API_TASK_BY_ID_URL.replace(':projectId', projectId).replace(':id', taskId),
    data
  )

const deleteTask = (projectId: string, taskId: string): Promise<ApiResponse> =>
  http.delete(URL_TASKS.API_TASK_BY_ID_URL.replace(':projectId', projectId).replace(':id', taskId))

const assignTask = (
  projectId: string,
  taskId: string,
  data: AssignTaskPayload
): Promise<ApiResponse> =>
  http.post(
    URL_TASKS.API_TASK_ASSIGNMENTS_URL.replace(':projectId', projectId).replace(':id', taskId),
    data
  )

const unassignTask = (projectId: string, taskId: string, userId: string): Promise<ApiResponse> =>
  http.delete(
    `${URL_TASKS.API_TASK_ASSIGNMENTS_URL.replace(':projectId', projectId).replace(':id', taskId)}?user_id=${userId}`
  )

const updateTaskStatus = (
  projectId: string,
  taskId: string,
  status: string
): Promise<ApiResponse<Task>> =>
  http.patch(
    URL_TASKS.API_TASK_STATUS_URL.replace(':projectId', projectId).replace(':id', taskId),
    { status }
  )

export const TaskService = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  assignTask,
  unassignTask,
  updateTaskStatus,
}
