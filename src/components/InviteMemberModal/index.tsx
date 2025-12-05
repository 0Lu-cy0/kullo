import React, { useEffect, useState } from 'react'
import { Modal, Input, Button, message, Select } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { InviteService } from '~/services/InviteService'
import { RoleService } from '~/services/RoleService'
import styles from './styles.module.scss'

const { TextArea } = Input

interface InviteMemberModalProps {
  open: boolean
  onCancel: () => void
  projectId?: string
}

interface RoleOption {
  _id: string
  name: string
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ open, onCancel, projectId }) => {
  const [email, setEmail] = useState('')
  const [inviteMessage, setInviteMessage] = useState('')
  const [roles, setRoles] = useState<RoleOption[]>([])
  const [selectedRoleId, setSelectedRoleId] = useState<string>()
  const [loadingRoles, setLoadingRoles] = useState(false)
  const [sending, setSending] = useState(false)
  const [inviteLink, setInviteLink] = useState('')

  useEffect(() => {
    if (!open) return
    if (!projectId) return
    fetchRoles(projectId)
    fetchPermanentLink(projectId)
  }, [open, projectId])

  useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open])

  const resetForm = () => {
    setEmail('')
    setInviteMessage('')
    setInviteLink('')
    setSelectedRoleId(undefined)
  }

  const fetchRoles = async (pid: string) => {
    setLoadingRoles(true)
    try {
      const res = await RoleService.getRolesByProjectId(pid)
      if (res?.isOk) {
        const roleList = Array.isArray(res.data) ? res.data : []
        setRoles(roleList)
        setSelectedRoleId(roleList[0]?._id)
      } else {
        message.error(res?.message || 'Không thể tải danh sách vai trò')
        setRoles([])
      }
    } catch (error) {
      message.error('Không thể tải danh sách vai trò')
      setRoles([])
    } finally {
      setLoadingRoles(false)
    }
  }

  const fetchPermanentLink = async (pid: string) => {
    try {
      const res = await InviteService.getPermanentLink(pid)
      const link =
        res?.invite?.invite_link ||
        res?.data?.invite_link ||
        res?.data?.invite?.invite_link ||
        (res as any)?.invite_link
      setInviteLink(link || '')
    } catch (error) {
      setInviteLink('')
      message.error('Không thể lấy liên kết mời')
    }
  }

  const handleCopyLink = () => {
    if (!inviteLink) return
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(inviteLink)
        .then(() => message.success('Đã sao chép liên kết'))
        .catch(() => fallbackCopy(inviteLink))
    } else {
      fallbackCopy(inviteLink)
    }
  }

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    try {
      document.execCommand('copy')
      message.success('Đã sao chép liên kết')
    } catch (error) {
      message.error('Không thể sao chép liên kết')
    } finally {
      document.body.removeChild(textarea)
    }
  }

  const handleSendInvite = async () => {
    if (!projectId) {
      message.warning('Vui lòng chọn dự án trước khi mời thành viên')
      return
    }
    if (!email.trim()) {
      message.warning('Vui lòng nhập email hoặc tên người dùng')
      return
    }
    if (!selectedRoleId) {
      message.warning('Vui lòng chọn vai trò')
      return
    }

    setSending(true)
    try {
      const res = await InviteService.sendInvite({
        project_id: projectId,
        invite_email: email.trim(),
        role: selectedRoleId,
        message: inviteMessage.trim() || undefined,
      })
      message.success(res?.message || 'Đã gửi lời mời thành công')
      setEmail('')
      setInviteMessage('')
    } catch (error) {
      message.error('Không thể gửi lời mời')
    } finally {
      setSending(false)
    }
  }

  const handleClose = () => {
    resetForm()
    onCancel()
  }

  const hasProject = Boolean(projectId)
  const sendDisabled = !hasProject || !email.trim() || !selectedRoleId || sending

  return (
    <Modal
      title="Mời vào Không gian làm việc"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={600}
      className={styles.inviteModal}
    >
      <div className={styles.modalContent}>
        {!hasProject && (
          <div className={styles.notice}>Vui lòng chọn một dự án để gửi lời mời.</div>
        )}

        <div className={styles.inputSection}>
          <div className={styles.emailInput}>
            <Input
              placeholder="Nhập email hoặc tên"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bordered={false}
              className={styles.input}
              disabled={!hasProject}
            />
          </div>

          <Select
            placeholder="Chọn vai trò"
            value={selectedRoleId}
            onChange={(value) => setSelectedRoleId(value)}
            options={roles.map((role) => ({ label: role.name, value: role._id }))}
            className={styles.roleSelect}
            loading={loadingRoles}
            disabled={!hasProject || !roles.length}
          />

          <Button
            type="primary"
            onClick={handleSendInvite}
            loading={sending}
            disabled={sendDisabled}
            className={styles.sendBtn}
          >
            Gửi lời mời
          </Button>
        </div>

        <div className={styles.messageSection}>
          <TextArea
            placeholder="Tham gia Không gian làm việc Trello này để bắt đầu cộng tác với tôi!"
            value={inviteMessage}
            onChange={(e) => setInviteMessage(e.target.value)}
            rows={4}
            maxLength={500}
            showCount
            className={styles.messageArea}
          />
        </div>

        <div className={styles.linkSection}>
          <div className={styles.linkHeader}>
            <span>Mời ai đó vào Không gian làm việc này bằng liên kết:</span>
          </div>

          {inviteLink && (
            <div className={styles.linkDisplay}>
              <Input
                value={inviteLink}
                readOnly
                className={styles.linkInput}
                suffix={
                  <Button
                    type="text"
                    icon={<CopyOutlined />}
                    onClick={handleCopyLink}
                    className={styles.copyBtn}
                  >
                    Sao chép liên kết
                  </Button>
                }
              />
            </div>
          )}

          {!inviteLink && (
            <div className={styles.linkNotice}>Chưa có liên kết mời khả dụng cho dự án này.</div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default InviteMemberModal
