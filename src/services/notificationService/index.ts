import http from '../index'
import type { ApiResponse } from '~/types/utils'
import URL_NOTIFICATIONS from './urls'
import type { Notification, NotificationDetail } from '~/types/api/notification'

const getAll = (): Promise<ApiResponse<Notification[]>> =>
  http.get(URL_NOTIFICATIONS.API_NOTIFICATIONS_URL)

const getDetail = (notificationId: string): Promise<ApiResponse<NotificationDetail>> =>
  http.get(URL_NOTIFICATIONS.API_NOTIFICATION_BY_ID_URL.replace(':id', notificationId))

const markAsRead = (notificationId: string): Promise<ApiResponse> =>
  http.patch(URL_NOTIFICATIONS.API_NOTIFICATION_BY_ID_URL.replace(':id', notificationId))

const deleteOne = (notificationId: string): Promise<ApiResponse> =>
  http.delete(URL_NOTIFICATIONS.API_NOTIFICATION_BY_ID_URL.replace(':id', notificationId))

const deleteAllRead = (): Promise<ApiResponse> =>
  http.delete(URL_NOTIFICATIONS.API_NOTIFICATIONS_URL)

export const NotificationService = {
  getAll,
  getDetail,
  markAsRead,
  deleteOne,
  deleteAllRead,
}
