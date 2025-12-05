export interface Notification {
  _id: string
  user_id: string
  type: 'invite' | 'mention' | 'task_assigned' | 'project_update' | 'access_request'
  title: string
  message: string
  data?: Record<string, any>
  is_read: boolean
  project_id?: string
  task_id?: string
  createdAt: string
  updatedAt: string
}

export interface NotificationDetail extends Notification {
  related_project?: {
    _id: string
    name: string
  }
  related_task?: {
    _id: string
    name: string
  }
}
