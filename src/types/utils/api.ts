// src/types/utils/api.ts

/** Cấu trúc chuẩn của phản hồi API */
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  Status: number
  isError: boolean
  isOk: boolean
  Object?: T
}

/** Cho response paginated */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
