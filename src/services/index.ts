import axios from 'axios'
import { notification } from 'antd'
import STORAGE, { deleteStorage, getStorage } from '~/libs/storage'
import ROUTER from '~/routers'
import { getMsgClient } from '~/libs/stringsUtils'
import { trimData } from '~/libs/utils'

/**
 *
 * parse error response
 */
function parseError(messages: string[] | string | undefined): Promise<never> {
  // error
  if (messages) {
    if (messages instanceof Array) {
      return Promise.reject({ messages })
    }
    return Promise.reject({ messages: [messages] })
  }
  return Promise.reject({ messages: ['Server quá tải'] })
}

/**
 * parse response
 */

interface ApiResponseData {
  statusCode?: number
  status?: number
  object?: string
  messages?: string[] | string
  [key: string]: any
}

interface AxiosResponse {
  data: ApiResponseData
  status: number
  [key: string]: any
}

export function parseBody(
  response: AxiosResponse
): ApiResponseData | void | Promise<never> | { [key: string]: any } {
  const resData = response.data
  if (+response?.status >= 500) {
    return notification.warning({
      message: 'Lỗi',
      description: resData?.message || 'Hệ thống có lỗi vui lòng thử lại sau',
      placement: 'topRight',
      duration: 3,
    })
  }
  if (+response?.status < 500 && +response?.status !== 200 && +response?.status !== 201) {
    return notification.warning({
      message: 'Lỗi',
      description: resData?.message || 'Hệ thống có lỗi vui lòng thử lại sau',
      placement: 'topRight',
      duration: 3,
    })
  }

  if (response?.status === 200 || response?.status === 201) {
    if (resData.statusCode === 401) {
      deleteStorage(STORAGE.TOKEN)
      return window.location.replace(ROUTER.HOME)
    }
    if (resData.status === -2) return resData // ma sp, ten sp ton tai
    if (resData.status === 0) return resData // API tra ve success

    if (resData.status !== -1 && resData.status !== 69 && resData.object) {
      notification.warning({
        message: getMsgClient(resData.object?.replace('[MessageForUser]', '')),
      })
    }
    if (resData.status !== 1 && resData.object) {
      return {
        ...resData,
        object: getMsgClient(resData.object),
      }
    }
    return resData
  }
  return parseError(resData?.messages)
}

/**
 * axios instance
 */
// const baseURL = ''
const instance = axios.create({
  // baseURL: '',
  timeout: 60000,
})

// request header
instance.interceptors.request.use(
  async (config) => {
    // Do something before request is sent
    if (config.data) {
      config.data = config.data instanceof FormData ? config.data : trimData(config.data)
    }
    config.headers = {
      authorization: `Bearer ${getStorage(STORAGE.TOKEN) || '5W+3CaFlo0GnUltbhGtcgA=='}`,
      // Authorization: getStorage(STORAGE.TOKEN) || '1tjyE+/5HUqKlhwI1IwXwg==',
    } as any
    config.baseURL = window.env?.API_URL || import.meta.env.VITE_API_URL
    config.onUploadProgress = (progressEvent) => {
      // let percentCompleted = Math.floor(
      //   (progressEvent.loaded * 100) / progressEvent.total,
      // )
      // do whatever you like with the percentage complete
      // maybe dispatch an action that will update a progress bar or something
    }
    return config
  },
  (error) => Promise.reject(error)
)

// response parse
instance.interceptors.response.use(
  (response) => parseBody(response) as any,
  (error) => {
    const errorMessage = error?.response?.data?.message

    // can not connect API
    if (
      error.code === 'ECONNABORTED' ||
      +error?.response?.status >= 500 ||
      (+error?.response?.status < 500 && +error?.response?.status !== 200)
    ) {
      notification.warning({
        message: 'Lỗi',
        description:
          errorMessage ||
          'Hệ thống đang tạm thời gián đoạn. Xin vui lòng trở lại sau hoặc thông báo với ban quản trị để được hỗ trợ',
      })
    } else if (error.code === 'ERR_NETWORK') {
      notification.warning({
        message: 'Lỗi mạng',
        description: 'Hệ thống đang bị gián đoạn, vui lòng kiểm tra lại đường truyền!',
      })
    } else if (typeof error.response === 'undefined') {
      notification.warning({
        message: 'Lỗi',
        description: error.response || 'Có lỗi xảy ra',
      })
    } else if (error.response) {
      notification.warning({
        message: 'Lỗi',
        description:
          errorMessage ||
          'Hệ thống đang tạm thời gián đoạn. Xin vui lòng trở lại sau hoặc thông báo với ban quản trị để được hỗ trợ',
      })
      return parseError(error.response.data)
    } else {
      notification.warning({
        message: 'Lỗi',
        description:
          errorMessage ||
          'Hệ thống đang tạm thời gián đoạn. Xin vui lòng trở lại sau hoặc thông báo với ban quản trị để được hỗ trợ',
      })
    }
    return Promise.reject(error)
  }
)

export default instance

export const httpGetFile = (path = '', optionalHeader = {}) =>
  instance({
    method: 'GET',
    url: path,
    headers: { ...optionalHeader },
  })
