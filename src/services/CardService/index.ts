import type { CardCreatePayload } from '~/types/api/card'
import http from '../index'
import type { ApiResponse } from '~/types/utils'
import URL_CARD from './urls'

const cardCreate = (columnId: string, body: CardCreatePayload): Promise<ApiResponse> =>
  http.post(URL_CARD.apiCreateCard.replace(':id', columnId), body)

const cardUpdate = (
  projectId: string,
  taskId: string,
  body: Partial<CardCreatePayload>
): Promise<ApiResponse> =>
  http.put(URL_CARD.apiUpdateCard.replace(':projectId', projectId).replace(':taskId', taskId), body)

export const CardService = {
  cardCreate,
  cardUpdate,
}
