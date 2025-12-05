import { get } from 'lodash'
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import STORAGE, { getStorage } from '~/libs/storage'
import ROUTER from '~/routers'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const isLogin = getStorage(STORAGE.TOKEN)
  if (!isLogin) {
    return <Navigate to={ROUTER.DANG_NHAP} state={{ from: location }} replace />
  }
  return <div>{children}</div>
}
export default ProtectedRoute
