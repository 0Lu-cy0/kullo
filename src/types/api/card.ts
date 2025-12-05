c //post
export interface CardCreatePayload {
  title: string
  description: string
  status: string // ví dụ: 'todo' | 'in-progress' | 'done'
  priority: string // ví dụ: 'low' | 'medium' | 'high'
  columnId: string
  due_date: string // ISO date string
  tags: string[]
}

export interface CardMovePayload {
  cardId: string
  fromColumnId: string
  toColumnId: string
  position: number
}
