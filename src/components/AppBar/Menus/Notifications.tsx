import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Badge from '@mui/material/Badge'
import NotificationsIcon from '@mui/icons-material/Notifications'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { Tooltip, Button, Chip } from '@mui/material'
import { NotificationService } from '~/services/notificationService'
import type { Notification } from '~/types/api/notification'
import { message } from 'antd'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { alpha } from '@mui/material/styles'

function Notifications() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const open = Boolean(anchorEl)

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const response = await NotificationService.getAll()
      if (response.isOk && response.data) {
        setNotifications(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMarkAsRead = async (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    try {
      const response = await NotificationService.markAsRead(notificationId)
      if (response.isOk) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === notificationId ? { ...n, is_read: true } : n))
        )
        message.success('Đã đánh dấu là đã đọc')
      }
    } catch {
      message.error('Có lỗi xảy ra!')
    }
  }

  const handleDelete = async (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    try {
      const response = await NotificationService.deleteOne(notificationId)
      if (response.isOk) {
        setNotifications((prev) => prev.filter((n) => n._id !== notificationId))
        message.success('Đã xóa thông báo')
      }
    } catch {
      message.error('Có lỗi xảy ra!')
    }
  }

  const handleDeleteAllRead = async () => {
    try {
      const response = await NotificationService.deleteAllRead()
      if (response.isOk) {
        setNotifications((prev) => prev.filter((n) => !n.is_read))
        message.success('Đã xóa tất cả thông báo đã đọc')
      }
    } catch {
      message.error('Có lỗi xảy ra!')
    }
  }

  const getNotificationTypeConfig = (type: string) => {
    const config: Record<string, { text: string; color: string; bgColor: string }> = {
      invite: { text: 'Lời mời', color: '#1976d2', bgColor: '#e3f2fd' },
      mention: { text: 'Nhắc đến', color: '#0288d1', bgColor: '#e1f5fe' },
      task_assigned: { text: 'Phân công', color: '#388e3c', bgColor: '#e8f5e9' },
      project_update: { text: 'Cập nhật', color: '#f57c00', bgColor: '#fff3e0' },
      access_request: { text: 'Yêu cầu', color: '#d32f2f', bgColor: '#ffebee' },
    }
    return config[type] || { text: type, color: '#757575', bgColor: '#f5f5f5' }
  }

  const formatTime = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi })
    } catch {
      return ''
    }
  }

  return (
    <Box>
      <Tooltip title="Thông báo">
        <IconButton onClick={handleClick} sx={{ color: 'white' }}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        id="notifications-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 420,
            maxHeight: 600,
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsIcon sx={{ color: 'white', fontSize: 24 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
              Thông báo
            </Typography>
            {unreadCount > 0 && (
              <Chip
                label={unreadCount}
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  fontWeight: 'bold',
                  height: 22,
                }}
              />
            )}
          </Box>
          {notifications.some((n) => n.is_read) && (
            <Tooltip title="Xóa tất cả thông báo đã đọc">
              <IconButton
                size="small"
                onClick={handleDeleteAllRead}
                sx={{
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                }}
              >
                <DeleteSweepIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {loading && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Box
              sx={{
                display: 'inline-block',
                width: 40,
                height: 40,
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #667eea',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              Đang tải...
            </Typography>
          </Box>
        )}
        {!loading && notifications.length === 0 && (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <MarkEmailReadIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              Không có thông báo
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Bạn đã xem hết tất cả thông báo
            </Typography>
          </Box>
        )}
        {!loading && notifications.length > 0 && (
          <Box
            sx={{
              maxHeight: 450,
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '3px',
                '&:hover': {
                  background: '#555',
                },
              },
            }}
          >
            {notifications.map((notification, index) => {
              const typeConfig = getNotificationTypeConfig(notification.type)
              return (
                <Box key={notification._id}>
                  {index > 0 && <Divider />}
                  <MenuItem
                    sx={{
                      py: 2,
                      px: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      bgcolor: notification.is_read ? 'transparent' : alpha('#667eea', 0.05),
                      borderLeft: notification.is_read ? 'none' : '3px solid #667eea',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: alpha('#667eea', 0.08),
                        transform: 'translateX(2px)',
                      },
                    }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight={notification.is_read ? 500 : 700}
                          sx={{ flex: 1, pr: 1, fontSize: '0.95rem' }}
                        >
                          {notification.title}
                        </Typography>
                        <Chip
                          label={typeConfig.text}
                          size="small"
                          sx={{
                            height: 24,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            bgcolor: typeConfig.bgColor,
                            color: typeConfig.color,
                            border: `1px solid ${typeConfig.color}`,
                          }}
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1.5, lineHeight: 1.6 }}
                      >
                        {notification.message}
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.disabled',
                            fontStyle: 'italic',
                          }}
                        >
                          {formatTime(notification.createdAt)}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {!notification.is_read && (
                            <Tooltip title="Đánh dấu đã đọc">
                              <IconButton
                                size="small"
                                onClick={(e) => handleMarkAsRead(notification._id, e)}
                                sx={{
                                  p: 0.75,
                                  color: '#667eea',
                                  '&:hover': {
                                    bgcolor: alpha('#667eea', 0.1),
                                  },
                                }}
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Xóa thông báo">
                            <IconButton
                              size="small"
                              onClick={(e) => handleDelete(notification._id, e)}
                              sx={{
                                p: 0.75,
                                color: '#d32f2f',
                                '&:hover': {
                                  bgcolor: alpha('#d32f2f', 0.1),
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>
                  </MenuItem>
                </Box>
              )
            })}
          </Box>
        )}
      </Menu>
    </Box>
  )
}

export default Notifications
