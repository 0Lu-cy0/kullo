import {
  Button,
  CardActions,
  CardContent,
  CardMedia,
  Card as CardMui,
  Typography,
  Chip,
  Box,
} from '@mui/material'
import { MessageSquareText, Paperclip, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import dayjs from 'dayjs'
import { Dropdown, Menu, message, Modal, Select, DatePicker, Input, Form } from 'antd'
import { TaskService } from '~/services/TaskService'
import { MemberService } from '~/services/MenberService'
import { useState, useEffect } from 'react'
import { useSearch } from '~/contexts/SearchContext'
import { alpha } from '@mui/material/styles'

interface CardProps {
  card: any
  projectId?: string
  onUpdate?: () => void
}

const Card = ({ card, projectId, onUpdate }: CardProps) => {
  const { searchQuery, taskResults } = useSearch()
  const [members, setMembers] = useState<any[]>([])
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [editedName, setEditedName] = useState(card?.title || card?.name || '')
  const [editedPriority, setEditedPriority] = useState(card?.priority || 'medium')
  const [editedStatus, setEditedStatus] = useState(card?.status || 'todo')
  const [editedDueDate, setEditedDueDate] = useState(card?.due_date ? dayjs(card.due_date) : null)
  useEffect(() => {
    setEditedName(card?.title || card?.name || '')
    setEditedPriority(card?.priority || 'medium')
    setEditedStatus(card?.status || 'todo')
    setEditedDueDate(card?.due_date ? dayjs(card.due_date) : null)
  }, [card?._id, card?.title, card?.name, card?.priority, card?.status, card?.due_date])


  // Fetch members when assign modal opens
  useEffect(() => {
    if (isAssignModalVisible && projectId) {
      fetchMembers()
    }
  }, [isAssignModalVisible, projectId])

  const fetchMembers = async () => {
    try {
      const response = await MemberService.getProjectMembers(projectId!)
      if (response.isOk) {
        setMembers(response.data || [])
      }
    } catch (error) {
      message.error('Không thể tải danh sách thành viên')
    }
  }

  const handleUpdateCardInfo = async () => {
    if (!projectId) {
      message.error('Không tìm thấy project ID')
      return
    }

    const payload: Record<string, unknown> = {}
    const trimmedName = editedName.trim()
    if (trimmedName && trimmedName !== (card?.title || card?.name || '')) {
      payload.name = trimmedName
      payload.title = trimmedName
    }
    if (editedPriority && editedPriority !== card?.priority) {
      payload.priority = editedPriority
    }
    if (editedStatus && editedStatus !== card?.status) {
      payload.status = editedStatus
    }
    const dueDateValue = editedDueDate ? editedDueDate.toISOString() : null
    const originalDueDate = card?.due_date ? dayjs(card.due_date).toISOString() : null
    if (dueDateValue !== originalDueDate) {
      payload.due_date = dueDateValue
    }

    if (Object.keys(payload).length === 0) {
      message.info('Không có thay đổi để cập nhật')
      return
    }

    try {
      const response = await TaskService.updateTask(projectId, card._id, payload)
      if (response.isOk) {
        message.success('Cập nhật thẻ thành công!')
        setIsEditModalVisible(false)
        onUpdate?.()
      } else {
        message.error('Cập nhật thẻ thất bại!')
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật thẻ!')
    }
  }

  // Assign task to member
  const handleAssignTask = async (userId: string) => {
    if (!projectId) {
      message.error('Không tìm thấy project ID')
      return
    }

    try {
      const response = await TaskService.assignTask(projectId, card._id, { user_id: userId })
      if (response.isOk) {
        message.success('Phân công task thành công!')
        setIsAssignModalVisible(false)
        onUpdate?.()
      } else {
        message.error('Phân công task thất bại!')
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi phân công task!')
    }
  }

  // Update task status
  const handleUpdateStatus = async () => {
    if (!projectId) {
      message.error('Không tìm thấy project ID')
      return
    }

    try {
      const response = await TaskService.updateTaskStatus(projectId, card._id, selectedStatus)
      if (response.isOk) {
        message.success('Cập nhật trạng thái thành công!')
        setIsStatusModalVisible(false)
        onUpdate?.()
      } else {
        message.error('Cập nhật trạng thái thất bại!')
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật trạng thái!')
    }
  }

  // Update due date
  const handleUpdateDueDate = async () => {
    if (!projectId) {
      message.error('Không tìm thấy project ID')
      return
    }

    try {
      const response = await TaskService.updateTask(projectId, card._id, {
        due_date: selectedDueDate?.toISOString(),
      })
      if (response.isOk) {
        message.success('Cập nhật ngày hết hạn thành công!')
        setIsDueDateModalVisible(false)
        onUpdate?.()
      } else {
        message.error('Cập nhật ngày hết hạn thất bại!')
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật ngày hết hạn!')
    }
  }

  // Delete task
  const handleDeleteTask = async () => {
    if (!projectId) {
      message.error('Không tìm thấy project ID')
      return
    }

    Modal.confirm({
      title: 'Xác nhận xóa task',
      content: 'Bạn có chắc chắn muốn xóa task này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const response = await TaskService.deleteTask(projectId, card._id)
          if (response.isOk) {
            message.success('Xóa task thành công!')
            onUpdate?.()
          } else {
            message.error('Xóa task thất bại!')
          }
        } catch (error) {
          message.error('Có lỗi xảy ra khi xóa task!')
        }
      },
    })
  }
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card },
  })

  const dntKitCardStyle = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  }

  const shouldShowCartItem = () => {
    return !!card?.memberIds?.length || !!card?.memberIds?.length || !!card?.memberIds?.length
  }

  // Get status config
  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
      todo: {
        label: 'Cần làm',
        color: '#64748b',
        bgColor: '#f1f5f9',
        icon: <AlertCircle size={14} />,
      },
      in_progress: {
        label: 'Đang làm',
        color: '#f59e0b',
        bgColor: '#fef3c7',
        icon: <Clock size={14} />,
      },
      testing: {
        label: 'Đang test',
        color: '#8b5cf6',
        bgColor: '#ede9fe',
        icon: <CheckCircle size={14} />,
      },
      completed: {
        label: 'Hoàn thành',
        color: '#10b981',
        bgColor: '#d1fae5',
        icon: <CheckCircle size={14} />,
      },
    }
    return configs[status] || configs.todo
  }

  // Get priority config
  const getPriorityConfig = (priority: string) => {
    const configs: Record<string, { label: string; color: string }> = {
      low: { label: 'Thấp', color: '#10b981' },
      medium: { label: 'Trung bình', color: '#f59e0b' },
      high: { label: 'Cao', color: '#ef4444' },
    }
    return configs[priority] || configs.low
  }

  // Format due date
  const formatDueDate = (dateString: string) => {
    if (!dateString) return null
    const date = dayjs(dateString)
    const now = dayjs()
    const diffDays = date.diff(now, 'day')

    let color = '#64748b'
    if (diffDays < 0) {
      color = '#ef4444' // Quá hạn - đỏ
    } else if (diffDays <= 1) {
      color = '#f59e0b' // Sắp đến hạn - vàng
    }

    return {
      text: date.format('DD/MM/YYYY'),
      color,
      isOverdue: diffDays < 0,
    }
  }

  const statusConfig = getStatusConfig(card?.status)
  const priorityConfig = getPriorityConfig(card?.priority)
  const dueDate = card?.due_date ? formatDueDate(card.due_date) : null

  // Check if card matches search
  const isSearchMatch =
    searchQuery &&
    taskResults &&
    Array.isArray(taskResults) &&
    taskResults.some((task) => task._id === card._id)

  const menu = (
    <Menu
      onClick={({ key }) => {
        if (key === 'assign') setIsAssignModalVisible(true)
        if (key === 'edit') setIsEditModalVisible(true)
        if (key === 'delete') handleDeleteTask()
      }}
    >
      <Menu.Item key="edit">Chỉnh sửa thông tin</Menu.Item>
      <Menu.Item key="assign">Phân công thành viên</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete" danger>
        Xóa task
      </Menu.Item>
    </Menu>
  )
  return (
    <>
      <CardMui
        ref={setNodeRef}
        style={dntKitCardStyle}
        {...attributes}
        {...listeners}
        sx={{
          cursor: 'pointer',
          boxShadow: isSearchMatch
            ? '0 0 0 3px rgba(102, 126, 234, 0.4), 0 4px 12px rgba(102, 126, 234, 0.3)'
            : '0 1px 1px rgba(0, 0, 0, 0.2)',
          opacity: card.FE_PlaceholderCard ? 0 : 1,
          minHeight: card.FE_PlaceholderCard ? '60px' : 'auto',
          pointerEvents: card.FE_PlaceholderCard ? 'none' : 'auto',
          visibility: card.FE_PlaceholderCard ? 'hidden' : 'visible',
          border: isSearchMatch ? '2px solid #667eea' : 'none',
          bgcolor: isSearchMatch ? alpha('#667eea', 0.05) : 'background.paper',
          transition: 'all 0.3s ease',
          transform: isSearchMatch ? 'scale(1.02)' : 'scale(1)',
          '&:hover': {
            boxShadow: isSearchMatch
              ? '0 0 0 3px rgba(102, 126, 234, 0.5), 0 6px 16px rgba(102, 126, 234, 0.4)'
              : '0 2px 4px rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} title={card?.title} />}
        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
          <Box display="flex" justifyContent="space-between" alignItems="start" width="100%">
            <Typography>{card?.title}</Typography>
            <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
              <Button
                size="small"
                sx={{ minWidth: '24px', padding: '2px 8px' }}
                onClick={(e) => e.stopPropagation()}
              >
                ...
              </Button>
            </Dropdown>
          </Box>
          {/* Status, Priority, Due Date */}
          <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Status Badge */}
            {card?.status && (
              <Chip
                icon={statusConfig?.icon}
                label={statusConfig?.label}
                size="small"
                sx={{
                  height: '22px',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: statusConfig?.color,
                  bgcolor: statusConfig?.bgColor,
                  '& .MuiChip-icon': {
                    color: statusConfig?.color,
                    marginLeft: '6px',
                  },
                }}
              />
            )}

            {/* Priority Badge */}
            {card?.priority && (
              <Chip
                label={priorityConfig?.label}
                size="small"
                sx={{
                  height: '22px',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'white',
                  bgcolor: priorityConfig?.color,
                }}
              />
            )}

            {/* Due Date */}
            {dueDate && (
              <Chip
                icon={<Clock size={14} />}
                label={dueDate.text}
                size="small"
                sx={{
                  height: '22px',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: dueDate.color,
                  bgcolor: dueDate.isOverdue ? '#fee2e2' : '#f1f5f9',
                  '& .MuiChip-icon': {
                    color: dueDate.color,
                    marginLeft: '6px',
                  },
                }}
              />
            )}
          </Box>
        </CardContent>

        {shouldShowCartItem() && (
          <CardActions sx={{ p: '0 4px 0px 0px' }}>
            {!!card?.memberIds?.length && (
              <Button startIcon={<Users />} size="small">
                {card?.memberIds?.length}
              </Button>
            )}
            {!!card?.comments?.length && (
              <Button startIcon={<MessageSquareText />} size="small">
                {card?.comments?.length}
              </Button>
            )}
            {!!card?.attachments?.length && (
              <Button startIcon={<Paperclip />} size="small">
                {card?.attachments?.length}
              </Button>
            )}
          </CardActions>
        )}
      </CardMui>

      {/* Modal phân công thành viên */}
      <Modal
        title="Phân công thành viên"
        open={isAssignModalVisible}
        onCancel={() => setIsAssignModalVisible(false)}
        footer={null}
      >
        <Select
          style={{ width: '100%' }}
          placeholder="Chọn thành viên"
          onChange={handleAssignTask}
          options={members.map((member) => ({
            label: `${member.name} (${member.email})`,
            value: member.user_id,
          }))}
        />
      </Modal>

      <Modal
        title="Chỉnh sửa thẻ"
        open={isEditModalVisible}
        onOk={handleUpdateCardInfo}
        onCancel={() => setIsEditModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form layout="vertical">
          <Form.Item label="Tên thẻ">
            <Input
              value={editedName}
              onChange={(event) => setEditedName(event.target.value)}
              placeholder="Nhập tên thẻ"
            />
          </Form.Item>
          <Form.Item label="Độ ưu tiên">
            <Select value={editedPriority} onChange={(value) => setEditedPriority(value)}>
              <Select.Option value="low">Thấp</Select.Option>
              <Select.Option value="medium">Trung bình</Select.Option>
              <Select.Option value="high">Cao</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Trạng thái">
            <Select value={editedStatus} onChange={(value) => setEditedStatus(value)}>
              <Select.Option value="todo">Cần làm</Select.Option>
              <Select.Option value="in_progress">Đang làm</Select.Option>
              <Select.Option value="testing">Đang test</Select.Option>
              <Select.Option value="completed">Hoàn thành</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Ngày đến hạn">
            <DatePicker
              style={{ width: '100%' }}
              value={editedDueDate}
              onChange={(value) => setEditedDueDate(value)}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Card
