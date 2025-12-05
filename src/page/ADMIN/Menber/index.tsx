import React, { useCallback, useEffect, useState } from 'react'
import { Table, Button, Space, Tag, Tabs, message, Popconfirm, Modal, Select, Spin } from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
  FileTextOutlined,
  PlusOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { MemberService } from '~/services/MenberService'
import type { Member } from '~/services/MenberService/type'
import { ProjectService } from '~/services/ProjectService'
import { AccessRequestService } from '~/services/AccessRequestService'
import type { AccessRequestDetail } from '~/types/api/accessRequest'
import { RoleService } from '~/services/RoleService'
import styles from './style.module.scss'

interface MemberData {
  key: string
  id: string
  fullName: string
  email: string
  role: string
  roleId: string
  joinedAt: string
}

interface JoinRequestData {
  key: string
  id: string
  fullName: string
  email: string
  requestDate: string
  message?: string
  status: 'pending' | 'approved' | 'rejected'
}

interface PermissionData {
  _id: string
  name: string
  description?: string
  category?: string
}

type RolePermissionsMap = Record<string, PermissionData[]>

const MemberPage: React.FC = () => {
  const [members, setMembers] = useState<MemberData[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string>()
  const [joinRequests, setJoinRequests] = useState<JoinRequestData[]>([])
  const [loadingRequests, setLoadingRequests] = useState(false)
  const [memberActionId, setMemberActionId] = useState<string | null>(null)
  const [requestActionId, setRequestActionId] = useState<string | null>(null)
  const [rolePermissions, setRolePermissions] = useState<RolePermissionsMap>({})
  const [rolePermissionsLoading, setRolePermissionsLoading] = useState(false)
  const [availablePermissions, setAvailablePermissions] = useState<PermissionData[]>([])
  const [permissionModalInfo, setPermissionModalInfo] = useState<{
    roleId: string
    roleName: string
  } | null>(null)
  const [newPermissionId, setNewPermissionId] = useState('')
  const [permissionSubmitting, setPermissionSubmitting] = useState(false)

  const fetchProjects = useCallback(async () => {
    try {
      const res = await ProjectService.projectGetAll()
      const projectList = Array.isArray(res?.data) ? res.data : []
      if (projectList.length > 0) {
        const firstProjectId = projectList[0]?._id
        if (firstProjectId) {
          setSelectedProjectId((prev) => prev ?? firstProjectId)
        }
      }
    } catch {
      message.error('Không thể tải danh sách dự án')
    }
  }, [])

  const loadRolePermissions = useCallback(
    async (projectId: string, roleIds: string[], options: { reset?: boolean } = {}) => {
      const uniqueRoleIds = Array.from(new Set(roleIds.filter(Boolean)))
      if (options.reset) {
        setRolePermissions({})
        setAvailablePermissions([])
      }
      if (!uniqueRoleIds.length) {
        return
      }
      setRolePermissionsLoading(true)
      try {
        const results = await Promise.all(
          uniqueRoleIds.map(async (roleId) => {
            try {
              const res = await RoleService.getRolePermissions(projectId, roleId)
              const permissions = Array.isArray(res?.data) ? res.data : []
              return { roleId, permissions }
            } catch {
              return { roleId, permissions: [] }
            }
          })
        )
        const rolePermissionMap: RolePermissionsMap = {}
        const aggregatedPermissionMap: Record<string, PermissionData> = {}
        results.forEach(({ roleId, permissions }) => {
          rolePermissionMap[roleId] = permissions
          permissions.forEach((permission) => {
            if (permission?._id) {
              aggregatedPermissionMap[permission._id] = permission
            }
          })
        })
        setRolePermissions((prev) => {
          const base = options.reset ? {} : { ...prev }
          Object.entries(rolePermissionMap).forEach(([roleId, permissions]) => {
            base[roleId] = permissions
          })
          return base
        })
        setAvailablePermissions((prev) => {
          const base = options.reset
            ? {}
            : prev.reduce<Record<string, PermissionData>>((acc, permission) => {
              if (permission?._id) {
                acc[permission._id] = permission
              }
              return acc
            }, {})
          Object.values(aggregatedPermissionMap).forEach((permission) => {
            if (permission?._id) {
              base[permission._id] = permission
            }
          })
          return Object.values(base)
        })
      } finally {
        setRolePermissionsLoading(false)
      }
    },
    []
  )

  const fetchMembers = useCallback(async (projectId: string) => {
    setLoadingMembers(true)
    try {
      const res = await MemberService.getProjectMembers(projectId)

      if (res?.data) {
        const transformedMembers: MemberData[] = res.data.map((member: Member) => ({
          key: member.user_id,
          id: member.user_id,
          fullName: member.name,
          email: member.email,
          role: member.role,
          roleId: member.role_id,
          joinedAt: member.joined_at
        }))
        setMembers(transformedMembers)
        const roleIds = transformedMembers.map((member) => member.roleId).filter(Boolean)
        await loadRolePermissions(projectId, roleIds, { reset: true })
      } else {
        setMembers([])
        setRolePermissions({})
      }
    } catch {
      message.error('Không thể tải danh sách thành viên')
    } finally {
      setLoadingMembers(false)
    }
  }, [loadRolePermissions])

  const fetchJoinRequests = useCallback(async (projectId: string) => {
    setLoadingRequests(true)
    try {
      const res = await AccessRequestService.getProjectRequests(projectId)
      const payload = (res as { requests?: AccessRequestDetail[] })?.requests || res?.data || []
      const requests: AccessRequestDetail[] = payload as AccessRequestDetail[]

      const transformedRequests: JoinRequestData[] = requests.map((request) => ({
        key: request._id,
        id: request._id,
        fullName: request.user?.name || request.user?.email || 'Người dùng',
        email: request.user?.email || '—',
        requestDate: request.createdAt,
        message: request.message,
        status: request.status
      }))

      setJoinRequests(transformedRequests)
    } catch {
      message.error('Không thể tải danh sách yêu cầu truy cập')
    } finally {
      setLoadingRequests(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  useEffect(() => {
    if (!selectedProjectId) return
    fetchMembers(selectedProjectId)
    fetchJoinRequests(selectedProjectId)
  }, [selectedProjectId, fetchMembers, fetchJoinRequests])

  const handleRemoveMember = async (record: MemberData) => {
    if (!selectedProjectId) return
    setMemberActionId(record.id)
    try {
      const res = await ProjectService.removeMember(selectedProjectId, record.id)
      message.success(res?.message || 'Đã xóa thành viên khỏi dự án')
      fetchMembers(selectedProjectId)
    } catch {
      message.error('Không thể xóa thành viên')
    } finally {
      setMemberActionId(null)
    }
  }

  const handleApproveRequest = async (record: JoinRequestData) => {
    if (!selectedProjectId) return
    setRequestActionId(record.id)
    try {
      const res = await AccessRequestService.approveRequest(record.id)
      message.success(res?.message || 'Đã chấp nhận yêu cầu truy cập')
      await Promise.all([fetchJoinRequests(selectedProjectId), fetchMembers(selectedProjectId)])
    } catch {
      message.error('Không thể chấp nhận yêu cầu')
    } finally {
      setRequestActionId(null)
    }
  }

  const handleRejectRequest = async (record: JoinRequestData) => {
    if (!selectedProjectId) return
    setRequestActionId(record.id)
    try {
      const res = await AccessRequestService.rejectRequest(record.id)
      message.success(res?.message || 'Đã từ chối yêu cầu truy cập')
      fetchJoinRequests(selectedProjectId)
    } catch {
      message.error('Không thể từ chối yêu cầu')
    } finally {
      setRequestActionId(null)
    }
  }

  const getSelectablePermissions = (roleId?: string) => {
    if (!roleId) return availablePermissions
    const assignedIds = new Set((rolePermissions[roleId] || []).map((permission) => permission._id))
    return availablePermissions.filter((permission) => !assignedIds.has(permission._id))
  }

  const formatPermissionLabel = (permission: PermissionData) => {
    const categorySuffix = permission.category ? ` (${permission.category})` : ''
    const descriptionSuffix = permission.description ? ` — ${permission.description}` : ''
    return `${permission.name}${categorySuffix}${descriptionSuffix}`
  }

  const closePermissionModal = () => {
    setPermissionModalInfo(null)
    setNewPermissionId('')
  }

  const openPermissionModal = (roleId: string, roleName: string) => {
    setPermissionModalInfo({ roleId, roleName })
    setNewPermissionId('')
  }

  const handleAddPermission = async () => {
    if (!permissionModalInfo || !selectedProjectId) return
    if (!newPermissionId.trim()) {
      message.warning('Vui lòng chọn permission')
      return
    }
    setPermissionSubmitting(true)
    try {
      await RoleService.addPermissionToRole(
        selectedProjectId,
        permissionModalInfo.roleId,
        newPermissionId.trim()
      )
      message.success('Đã thêm permission vào vai trò')
      await loadRolePermissions(selectedProjectId, [permissionModalInfo.roleId])
      closePermissionModal()
    } catch {
      message.error('Không thể thêm permission vào vai trò')
    } finally {
      setPermissionSubmitting(false)
    }
  }

  const handleRemovePermission = async (roleId: string, permissionId: string) => {
    if (!selectedProjectId) return
    try {
      await RoleService.removePermissionFromRole(selectedProjectId, roleId, permissionId)
      message.success('Đã xóa permission khỏi vai trò')
      await loadRolePermissions(selectedProjectId, [roleId])
    } catch {
      message.error('Không thể xóa permission khỏi vai trò')
    }
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
      case 'owner':
        return 'red'
      case 'member':
        return 'blue'
      case 'lead':
        return 'purple'
      case 'viewer':
        return 'green'
      default:
        return 'default'
    }
  }

  const columns: ColumnsType<MemberData> = [
    {
      title: 'Họ Tên',
      dataIndex: 'fullName',
      key: 'fullName',
      className: styles.columnFullName
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      className: styles.columnEmail
    },
    {
      title: 'Quyền',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={getRoleColor(role)} className={styles.roleTag}>
          {role}
        </Tag>
      )
    },
    {
      title: 'Permissions',
      dataIndex: 'roleId',
      key: 'permissions',
      className: styles.columnPermissions,
      render: (_: string, record) => {
        const permissions = rolePermissions[record.roleId] || []
        const isLoading = rolePermissionsLoading && !rolePermissions[record.roleId]
        return (
          <div className={styles.permissionCell}>
            {isLoading ? (
              <Spin size="small" />
            ) : permissions.length ? (
              <Space size={[4, 4]} wrap className={styles.permissionTags}>
                {permissions.map((permission) => (
                  <Tag
                    key={`${record.roleId}-${permission._id}`}
                    color="geekblue"
                    closable
                    onClose={(event) => {
                      event.preventDefault()
                      handleRemovePermission(record.roleId, permission._id)
                    }}
                    className={styles.permissionTag}
                  >
                    {permission.name}
                  </Tag>
                ))}
              </Space>
            ) : (
              <Tag className={styles.emptyPermissionTag}>Chưa có quyền</Tag>
            )}
            <Button
              type="dashed"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => openPermissionModal(record.roleId, record.role)}
              className={styles.btnAddPermission}
            >
              Thêm
            </Button>
          </div>
        )
      }
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      render: (joinedAt: string) =>
        joinedAt ? new Date(joinedAt).toLocaleDateString('vi-VN') : '—'
    },
    {
      title: 'Tác Vụ',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Popconfirm
            title="Xác nhận xóa thành viên?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleRemoveMember(record)}
          >
            <Button
              danger
              icon={<CloseOutlined />}
              loading={memberActionId === record.id}
              className={styles.btnReject}
              size="small"
            >
              Xóa khỏi dự án
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const joinRequestColumns: ColumnsType<JoinRequestData> = [
    {
      title: 'Họ Tên',
      dataIndex: 'fullName',
      key: 'fullName',
      className: styles.columnFullName
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      className: styles.columnEmail
    },
    {
      title: 'Ngày Yêu Cầu',
      dataIndex: 'requestDate',
      key: 'requestDate',
      render: (requestDate: string) =>
        requestDate ? new Date(requestDate).toLocaleString('vi-VN') : '—'
    },
    {
      title: 'Lời Nhắn',
      dataIndex: 'message',
      key: 'message',
      render: (message: string) => message || '—'
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: JoinRequestData['status']) => {
        const statusMap = {
          pending: { color: 'orange', text: 'Chờ duyệt' },
          approved: { color: 'green', text: 'Đã chấp nhận' },
          rejected: { color: 'red', text: 'Đã từ chối' }
        }
        const config = statusMap[status]
        return <Tag color={config.color}>{config.text}</Tag>
      }
    },
    {
      title: 'Tác Vụ',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleApproveRequest(record)}
            loading={requestActionId === record.id}
            className={styles.btnApprove}
            size="small"
          >
            Chấp nhận
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => handleRejectRequest(record)}
            loading={requestActionId === record.id}
            className={styles.btnReject}
            size="small"
          >
            Từ chối
          </Button>
        </Space>
      )
    }
  ]

  const tabItems = [
    {
      key: 'members',
      label: (
        <span>
          <UserOutlined />
          Thành Viên ({members.length})
        </span>
      ),
      children: (
        <Table
          columns={columns}
          dataSource={members}
          loading={loadingMembers}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng số ${total} thành viên`
          }}
          className={styles.memberTable}
        />
      )
    },
    {
      key: 'requests',
      label: (
        <span>
          <FileTextOutlined />
          Yêu Cầu Tham Gia ({joinRequests.length})
        </span>
      ),
      children: (
        <Table
          columns={joinRequestColumns}
          dataSource={joinRequests}
          loading={loadingRequests}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng số ${total} yêu cầu`
          }}
          className={styles.memberTable}
        />
      )
    }
  ]

  const permissionSelectOptions = (
    permissionModalInfo ? getSelectablePermissions(permissionModalInfo.roleId) : availablePermissions
  )
    .filter((permission) => Boolean(permission?._id))
    .map((permission) => ({
      value: permission._id,
      label: formatPermissionLabel(permission)
    }))

  return (
    <div className={styles.memberContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Quản Lý Thành Viên</h1>
      </div>
      <Tabs items={tabItems} defaultActiveKey="members" className={styles.tabs} />
      <Modal
        title={`Thêm permission cho vai trò ${permissionModalInfo?.roleName || ''}`}
        open={Boolean(permissionModalInfo)}
        onCancel={closePermissionModal}
        onOk={handleAddPermission}
        confirmLoading={permissionSubmitting}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Select
          className={styles.permissionSelect}
          showSearch
          placeholder="Chọn permission theo tên"
          options={permissionSelectOptions}
          optionFilterProp="label"
          value={newPermissionId || undefined}
          onChange={(value: string) => setNewPermissionId(value)}
          notFoundContent={
            rolePermissionsLoading ? <Spin size="small" /> : 'Không còn permission khả dụng'
          }
        />
        <p className={styles.permissionHelper}>
          Chọn theo tên/miêu tả hoặc tìm kiếm để lọc nhanh các permission có trong dự án.
        </p>
      </Modal>
    </div>
  )
}

export default MemberPage
