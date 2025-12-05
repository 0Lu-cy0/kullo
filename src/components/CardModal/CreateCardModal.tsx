import { Modal, Form, Input, Select, DatePicker, Tag, message } from 'antd'
import { useState } from 'react'
import { CardService } from '~/services/CardService'
import type { CardCreatePayload } from '~/types/api/card'
import moment from 'moment'

const { TextArea } = Input

interface CreateCardModalProps {
  open: boolean
  onClose: () => void
  columnId: string
  projectId: string
  onSuccess?: () => void
}

const CreateCardModal = ({
  open,
  onClose,
  columnId,
  projectId,
  onSuccess,
}: CreateCardModalProps) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [inputTag, setInputTag] = useState('')

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const payload: CardCreatePayload = {
        title: values.title,
        description: values.description || '',
        status: values.status,
        priority: values.priority,
        columnId: columnId,
        due_date: values.due_date ? moment(values.due_date).toISOString() : '',
        tags: tags,
      }

      const response = await CardService.cardCreate(projectId, payload)

      if (response.isOk) {
        message.success('Tạo card thành công!')
        form.resetFields()
        setTags([])
        onClose()
        onSuccess?.()
      } else {
        message.error('Tạo card thất bại!')
      }
    } catch (error) {
      message.error('Có lỗi xảy ra!')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setTags([])
    onClose()
  }

  const handleAddTag = () => {
    if (inputTag && !tags.includes(inputTag)) {
      setTags([...tags, inputTag])
      setInputTag('')
    }
  }

  const handleRemoveTag = (removedTag: string) => {
    setTags(tags.filter((tag) => tag !== removedTag))
  }

  return (
    <Modal
      title="Tạo Card Mới"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Tạo Card"
      cancelText="Hủy"
      width={600}
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
        >
          <Input placeholder="Nhập tiêu đề card" />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <TextArea rows={4} placeholder="Nhập mô tả chi tiết" />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          initialValue="todo"
        >
          <Select placeholder="Chọn trạng thái">
            <Select.Option value="todo">Cần làm</Select.Option>
            <Select.Option value="in_progress">Đang thực hiện</Select.Option>
            <Select.Option value="testing">Đang kiểm thử</Select.Option>
            <Select.Option value="completed">Hoàn thành</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Độ ưu tiên"
          name="priority"
          rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên!' }]}
          initialValue="medium"
        >
          <Select placeholder="Chọn độ ưu tiên">
            <Select.Option value="low">Thấp</Select.Option>
            <Select.Option value="medium">Trung bình</Select.Option>
            <Select.Option value="high">Cao</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Ngày hết hạn" name="due_date">
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            placeholder="Chọn ngày hết hạn"
          />
        </Form.Item>

        <Form.Item label="Nhãn">
          <div style={{ marginBottom: 8 }}>
            {tags.map((tag) => (
              <Tag
                key={tag}
                closable
                onClose={() => handleRemoveTag(tag)}
                style={{ marginBottom: 8 }}
              >
                {tag}
              </Tag>
            ))}
          </div>
          <Input
            placeholder="Nhập nhãn và nhấn Enter"
            value={inputTag}
            onChange={(e) => setInputTag(e.target.value)}
            onPressEnter={handleAddTag}
            onBlur={handleAddTag}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateCardModal
