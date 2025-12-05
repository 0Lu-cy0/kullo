import http from '../index'
import type { ApiResponse } from '~/types/utils'
import URL_SEARCH from './urls'
import type {
  SearchResult,
  ProjectSearchResult,
  TaskSearchResult,
  UserSearchResult,
  SearchFilters,
  BoardSearchResponse,
  BoardSearchFiltersRequest,
  ProjectSearchFiltersRequest,
} from '~/types/api/search'

const globalSearch = (
  query: string,
  filters?: SearchFilters
): Promise<ApiResponse<SearchResult>> => {
  const params = new URLSearchParams({ q: query })
  if (filters?.limit) params.append('limit', filters.limit.toString())
  if (filters?.page) params.append('page', filters.page.toString())

  return http.get(`${URL_SEARCH.API_SEARCH_URL}?${params.toString()}`)
}

const searchProjects = (
  query: string,
  filters?: ProjectSearchFiltersRequest
): Promise<ApiResponse<ProjectSearchResult[]>> => {
  const params = new URLSearchParams({ q: query })
  if (filters?.limit) params.append('limit', filters.limit.toString())
  if (filters?.page) params.append('page', filters.page.toString())

  const appendMultiValue = (key: string, value?: string | string[]) => {
    if (!value) return
    const values = Array.isArray(value) ? value : [value]
    values
      .map((item) => item?.trim())
      .filter((item): item is string => Boolean(item))
      .forEach((item) => params.append(key, item))
  }

  appendMultiValue('status', filters?.status)
  appendMultiValue('priority', filters?.priority)

  return http.get(`${URL_SEARCH.API_SEARCH_PROJECTS_URL}?${params.toString()}`)
}

const searchTasks = (
  query: string,
  filters?: SearchFilters
): Promise<ApiResponse<TaskSearchResult[]>> => {
  const params = new URLSearchParams({ q: query })
  if (filters?.limit) params.append('limit', filters.limit.toString())
  if (filters?.page) params.append('page', filters.page.toString())

  return http.get(`${URL_SEARCH.API_SEARCH_TASKS_URL}?${params.toString()}`)
}

const searchUsers = (
  query: string,
  filters?: SearchFilters
): Promise<ApiResponse<UserSearchResult[]>> => {
  const params = new URLSearchParams({ q: query })
  if (filters?.limit) params.append('limit', filters.limit.toString())
  if (filters?.page) params.append('page', filters.page.toString())

  return http.get(`${URL_SEARCH.API_SEARCH_USERS_URL}?${params.toString()}`)
}

const searchBoard = (
  projectId: string,
  query: string,
  filters?: BoardSearchFiltersRequest
): Promise<ApiResponse<BoardSearchResponse>> => {
  const params = new URLSearchParams({ q: query })

  if (filters?.priority && filters.priority.length > 0) {
    filters.priority.forEach((priority) => params.append('priority', priority))
  }

  if (filters?.dueEnd) {
    params.append('dueEnd', filters.dueEnd)
  }

  const url = URL_SEARCH.API_SEARCH_BOARD_URL.replace(':projectId', projectId)
  return http.get(`${url}?${params.toString()}`)
}

export const SearchService = {
  globalSearch,
  searchProjects,
  searchTasks,
  searchUsers,
  searchBoard,
}
