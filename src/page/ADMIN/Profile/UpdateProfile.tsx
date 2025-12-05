import { useState } from 'react'
import { Form, Input, Button, DatePicker, Select, Upload, message, Card } from 'antd'
import { UploadOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { UploadFile } from 'antd/es/upload/interface'
import AuthService from '~/services/AuthService'
import type { UpdateProfileRequest } from '~/types/models/User'
import dayjs from 'dayjs'

const { TextArea } = Input
const { Option } = Select

const UpdateProfile = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const handleUpload = (file: File) => {
    // Convert file to base64 or upload to server
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      form.setFieldValue('avatar_url', base64)
    }
    reader.readAsDataURL(file)
    return false // Prevent auto upload
  }

  const onFinish = async (values: any) => {
    try {
      setLoading(true)

      const profileData: UpdateProfileRequest = {
        full_name: values.full_name,
        cccd_number: values.cccd_number,
        birth_date: values.birth_date ? dayjs(values.birth_date).format('YYYY-MM-DD') : undefined,
        gender: values.gender,
        nationality: values.nationality,
        expiry_date: values.expiry_date
          ? dayjs(values.expiry_date).format('YYYY-MM-DD')
          : undefined,
        hometown: values.hometown,
        residence_address: values.residence_address,
        avatar_url: values.avatar_url,
      }

      const response = await AuthService.updateProfile(profileData)

      if (response.data) {
        message.success('Cập nhật hồ sơ thành công!')

        // Update global state if you're using Redux/Context
        // dispatch(setUserInfo(response.data))

        // Navigate to profile page
        navigate('/profile')
      }
    } catch (error: any) {
      message.error(error?.message || 'Cập nhật hồ sơ thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card title="Thông Tin Cá Nhân" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            gender: 'Nam',
            nationality: 'Việt Nam',
          }}
        >
          {/* Avatar Upload */}
          <Form.Item label="Ảnh đại diện" name="avatar_url">
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={handleUpload}
              onChange={({ fileList }) => setFileList(fileList)}
              maxCount={1}
            >
              {fileList.length === 0 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            label="Số CCCD"
            name="cccd_number"
            rules={[{ required: true, message: 'Vui lòng nhập số CCCD!' }]}
          >
            <Input placeholder="Nhập số CCCD" />
          </Form.Item>

          <Form.Item
            label="Họ và tên"
            name="full_name"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input placeholder="Nhập họ và tên" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            label="Ngày sinh"
            name="birth_date"
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Chọn ngày sinh"
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
          >
            <Select placeholder="Nam/Nữ">
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Quốc tịch"
            name="nationality"
            rules={[{ required: true, message: 'Vui lòng nhập quốc tịch!' }]}
          >
            <Input placeholder="Nhập quốc tịch" />
          </Form.Item>

          <Form.Item
            label="Ngày hết hạn"
            name="expiry_date"
            rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn!' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Chọn ngày hết hạn"
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            label="Quê quán"
            name="hometown"
            rules={[{ required: true, message: 'Vui lòng nhập quê quán!' }]}
          >
            <Input placeholder="Nhập quê quán" />
          </Form.Item>

          <Form.Item
            label="Nơi thường trú"
            name="residence_address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ thường trú!' }]}
          >
            <TextArea rows={3} placeholder="Nhập địa chỉ thường trú" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Lưu hồ sơ
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default UpdateProfile
