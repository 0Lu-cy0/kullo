import React, { useState } from 'react'
import { Form, Input, message, Modal } from 'antd'
import { ProjectService } from '~/services/ProjectService'
import STORAGE, { getStorage } from '~/libs/storage'
import { useNavigate } from 'react-router-dom'
import ROUTER from '~/routers'

interface CreateProjectModalProps {
  open: boolean
  onCancel: () => void
  onSubmit: (values: any) => void
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ open, onCancel, onSubmit }) => {
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const userInfo = getStorage(STORAGE.USER_INFO)
  const navigate = useNavigate()

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setConfirmLoading(true)

      const payload = {
        created_by: userInfo,
        status: 'planning',
        priority: 'low',
        ...values,
      }

      // Call onSubmit callback
      const res = await ProjectService.projectCreate(payload)

      if (res?.isOk) {
        message.success('Tạo bảng thành công')
        navigate('/du-an/' + (res?.data?._id || ''))
      } else {
        message.error(res?.message || 'Tạo bảng thất bại')
      }
      // Reset form and close modal
      form.resetFields()
      setConfirmLoading(false)
      onCancel()
    } catch {
      setConfirmLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Modal
      title="Tạo bảng mới"
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      okText="Tạo"
      cancelText="Hủy"
    >
      <Form
        form={form}
        layout="vertical"
        name="createProject"
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <Form.Item
          label="Tên bảng"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên bảng!' },
            { min: 5, message: 'Tên bảng phải có ít nhất 5 ký tự!' },
          ]}
        >
          <Input placeholder="Nhập tên bảng..." />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateProjectModal
