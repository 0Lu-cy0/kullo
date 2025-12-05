import React from 'react'
import { Modal } from 'antd'

interface CustomModalProps {
  title?: string
  open: boolean
  onOk: () => void
  onCancel: () => void
  children?: React.ReactNode
}

const CustomModal: React.FC<CustomModalProps> = ({
  title = 'Hộp thoại cơ bản',
  open,
  onOk,
  onCancel,
  children,
}) => {
  return (
    <Modal title={title} open={open} onOk={onOk} onCancel={onCancel} closable>
      {children}
    </Modal>
  )
}

export default CustomModal
