// src/types/enums/Status.ts
export * from '../enums/OrderStatus'
export * from '../enums/Status'
export * from '../enums/PaymentStatus'

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}
// src/types/enums/Status.ts
export enum Status {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
