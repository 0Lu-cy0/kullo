export interface Login {
  email: string
  password: string
}

export interface Register {
  full_name: string
  email: string
  password: string
}

export interface ChangePassword {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ResetPasswordRequest {
  email: string
}

export interface ResetPasswordConfirm {
  resetToken: string
  newPassword: string
  confirmPassword: string
}
