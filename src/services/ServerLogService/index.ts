import http from '../index'
import type { ApiResponse } from '~/types/utils'
import URL_LOGS from './urls'

export interface CreateLogPayload {
  content: string
  projectId: string
  logHistory?: string
}

export interface ServerLog {
  _id: string
  user: string
  content: string
  project: string
  logHistory?: string
  createdAt: string
  updatedAt: string
}

export interface GetLogsQuery {
  page?: number
  limit?: number
}

export interface LogsResponse {
  logs: ServerLog[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const createLog = (data: CreateLogPayload): Promise<ApiResponse<ServerLog>> =>
  http.post(URL_LOGS.API_LOGS_URL, data)

const getLogs = (
  projectId: string,
  userId: string,
  query?: GetLogsQuery
): Promise<ApiResponse<LogsResponse>> => {
  const params = new URLSearchParams()
  if (query?.page) params.append('page', query.page.toString())
  if (query?.limit) params.append('limit', query.limit.toString())

  const url = URL_LOGS.API_LOGS_BY_PROJECT_USER_URL
    .replace(':projectId', projectId)
    .replace(':userId', userId)
  const queryString = params.toString()
  return http.get(`${url}${queryString ? `?${queryString}` : ''}`)
}

export const ServerLogService = {
  createLog,
  getLogs,
}
