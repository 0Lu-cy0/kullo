const ROLE_SERVICE_URL = '/home/project-roles/projects/:id/roles'
const ROLE_PERMISSIONS_URL = '/home/project-roles/projects/:projectId/roles/:roleId/permissions'
const ROLE_PERMISSION_DETAIL_URL =
  '/home/project-roles/projects/:projectId/roles/:roleId/permissions/:permissionId'

const URL_ROLE_SERVICE = {
  ROLE_SERVICE_URL,
  ROLE_PERMISSIONS_URL,
  ROLE_PERMISSION_DETAIL_URL,
}

export default URL_ROLE_SERVICE
