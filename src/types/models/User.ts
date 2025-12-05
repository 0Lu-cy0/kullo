// src/types/models/User.ts
export interface UserModel {
  _id: string
  username: string
  email: string
  full_name: string
  avatar?: string
  avatar_url?: string
  cccd_number?: string
  birth_date?: string
  gender?: 'Nam' | 'Nữ' | 'Khác'
  nationality?: string
  expiry_date?: string
  hometown?: string
  residence_address?: string
  phone?: string
  department?: string
  language?: 'vi' | 'en' | 'jp' | 'fr'
  role?: string
  is_verified?: boolean
  created_at?: string
  updated_at?: string
}

export interface UpdateProfileRequest {
  full_name?: string
  cccd_number?: string
  birth_date?: string
  gender?: 'Nam' | 'Nữ' | 'Khác'
  nationality?: string
  expiry_date?: string
  hometown?: string
  residence_address?: string
  avatar_url?: string
}
