import URL_BOARD from './urls'
import type { ApiResponse } from '~/types/utils'
import http from '../index'

const getAll = (title: string): Promise<ApiResponse<any>> => {
  return http.get(URL_BOARD.API_GET_LIST_BOARDS.replace(':id', title))
}

interface MoveCardPayload {
  cardId: string
  sourceColumnId: string
  destinationColumnId: string
  newIndex?: number
}

const moveCard = (body: MoveCardPayload): Promise<ApiResponse<any>> => {
  return http.post(URL_BOARD.API_MOVE_BOARD, body)
}

const createColumn = (boardId: string, body: { title: string }): Promise<ApiResponse<any>> => {
  return http.post(URL_BOARD.API_CREATE_BOARD.replace(':id', boardId), body)
}

const updateBoard = (
  boardId: string,
  body: Partial<{ title: string; cardOrderIds: string[] }>
): Promise<ApiResponse> => {
  return http.put(URL_BOARD.API_UPDATE_BOARD.replace(':id', boardId), body)
}

const deletedBoard = (boardId: string): Promise<ApiResponse> => {
  return http.delete(URL_BOARD.API_UPDATE_BOARD.replace(':id', boardId))
}

export const BoardService = {
  getAll,
  moveCard,
  updateBoard,
  createColumn,
  deletedBoard,
}
