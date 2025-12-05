import type { Login, Register } from '~/types/api/user'
import http from '../index'
import URL_AUTH from './urls'
import type { ApiResponse } from '~/types/utils'
import type { AuthResponse } from '~/types'
import type { UpdateProfileRequest, UserModel } from '~/types/models/User'

const login = (body: Login): Promise<ApiResponse<AuthResponse>> =>
  http.post(URL_AUTH.API_POST_LOGIN_URL, body)

const register = (body: Register): Promise<ApiResponse> =>
  http.post(URL_AUTH.API_POST_REGISTER_URL, body)

const logout = (): Promise<ApiResponse> => http.post(URL_AUTH.API_POST_LOGOUT_URL)

const updateProfile = (body: UpdateProfileRequest): Promise<ApiResponse<UserModel>> =>
  http.put(URL_AUTH.API_PUT_UPDATE_PROFILE_URL, body)

const ChangePassword = (body: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}): Promise<ApiResponse> => http.put(URL_AUTH.API_PUT_CHANGE_PASSWORD_URL, body)

const RequestChangePassword = (body: { email: string }): Promise<ApiResponse> =>
  http.post(URL_AUTH.API_REQUIES_CHANGE_PASSWORD_URL, body)

const getUserInfo = (): Promise<ApiResponse<UserModel>> => http.get(URL_AUTH.API_GET_USER_INFO_URL)

export const AuthService = {
  login,
  register,
  logout,
  updateProfile,
  ChangePassword,
  getUserInfo,
  RequestChangePassword,
}
export default AuthService
