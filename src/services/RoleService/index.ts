import http from '../index'
import type { ApiResponse } from '~/types/utils'
import URL_ROLE_SERVICE from './urls'

const getRolesByProjectId = (projectId: string): Promise<ApiResponse<any>> => {
  return http.get(URL_ROLE_SERVICE.ROLE_SERVICE_URL.replace(':id', projectId))
}

const getRolePermissions = (projectId: string, roleId: string): Promise<ApiResponse<any>> =>
  http.get(
    URL_ROLE_SERVICE.ROLE_PERMISSIONS_URL.replace(':projectId', projectId).replace(
      ':roleId',
      roleId
    )
  )

const addPermissionToRole = (
  projectId: string,
  roleId: string,
  permissionId: string
): Promise<ApiResponse<any>> =>
  http.post(
    URL_ROLE_SERVICE.ROLE_PERMISSIONS_URL.replace(':projectId', projectId).replace(
      ':roleId',
      roleId
    ),
    { permissionId }
  )

const removePermissionFromRole = (
  projectId: string,
  roleId: string,
  permissionId: string
): Promise<ApiResponse<any>> =>
  http.delete(
    URL_ROLE_SERVICE.ROLE_PERMISSION_DETAIL_URL.replace(':projectId', projectId)
      .replace(':roleId', roleId)
      .replace(':permissionId', permissionId)
  )

export const RoleService = {
  getRolesByProjectId,
  getRolePermissions,
  addPermissionToRole,
  removePermissionFromRole,
}
