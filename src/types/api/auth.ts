import { Role } from '../enums/Role'
import type { UserModel } from '../models/User'

export interface LoginRequest {
  username: string
  password: string
}
// src/types/auth.ts

/** Payload của JWT sau khi decode */
export interface JwtPayload {
  sub: string // user id
  email: string
  roles: Role[] // import từ enums/Role
  iat: number
  exp: number
}

/** Kết quả API trả về khi login/register */
export interface AuthResponse {
  _id: string
  email: string
  accessToken: string
  refreshToken: string
}
