const API_POST_LOGIN_URL = '/auth/login'
const API_POST_REGISTER_URL = '/auth/register'
const API_PUT_CHANGE_PASSWORD_URL = '/auth/me/password'
const API_PUT_RESET_PASSWORD_URL = '/auth/reset-password/request?Authorization=Bearer'
const API_POST_REFRESH_TOKEN_URL = '/auth/reset-password/confirm?Authorization=Bearer'
const API_POST_LOGOUT_URL = '/auth/logout'
const API_PUT_UPDATE_PROFILE_URL = '/auth/me'
const API_GET_USER_INFO_URL = '/auth/me'
const API_REQUIES_CHANGE_PASSWORD_URL = '/auth/reset-password/request'

const URL_AUTH = {
  API_POST_LOGIN_URL,
  API_POST_REGISTER_URL,
  API_PUT_CHANGE_PASSWORD_URL,
  API_PUT_RESET_PASSWORD_URL,
  API_POST_REFRESH_TOKEN_URL,
  API_POST_LOGOUT_URL,
  API_PUT_UPDATE_PROFILE_URL,
  API_GET_USER_INFO_URL,
  API_REQUIES_CHANGE_PASSWORD_URL,
}

export default URL_AUTH
