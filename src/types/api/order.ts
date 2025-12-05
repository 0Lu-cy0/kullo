// src/types/models/Order.ts

import type { OrderStatus } from '../enums/OrderStatus'
import type { Status } from '../enums/Status'
import type { ProductModel } from '../models/Product'

// src/types/api/order.ts
export interface OrderDto {
  id: string
  userId: string
  items: Array<{ productId: string; quantity: number }>
  status: Status // import từ enums/Status
}

export interface OrderItem {
  productId: string
  quantity: number
  product?: ProductModel // Optional: populated khi cần hiển thị
}

export interface CreateOrderRequest {
  userId: string
  items: OrderItem[]
}

export interface OrderResponse {
  id: string
  userId: string
  items: OrderItem[]
  totalPrice: number
  status: OrderStatus
  createdAt: string
}
