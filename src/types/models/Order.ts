import type { OrderItem } from '../api/order'
import { OrderStatus } from '../enums/Status'
import type { UserModel } from './User'

export interface OrderModel {
  id: string
  userId: string
  user?: UserModel // Optional: populated
  items: OrderItem[]
  totalPrice: number
  status: OrderStatus
  createdAt: string // ISO date string
  updatedAt: string
}
