import React, { useState } from 'react'
import { Form, Input, Button, Upload, Card, Row, Col, message, DatePicker, Select } from 'antd'
import { UploadOutlined, CameraOutlined, SaveOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import styles from './style.module.scss'
import AuthService from '~/services/AuthService'

interface ProfileFormData {
  idNumber: string
  fullName: string
  dateOfBirth: string
  gender: string
  nationality: string
  placeOfOrigin: string
  placeOfResidence: string
  expiryDate: string
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [cccdFileList, setCccdFileList] = useState<UploadFile[]>([])
  const [cccdPreviewUrl, setCccdPreviewUrl] = useState<string>('')

  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setCccdFileList(newFileList)
  }

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('Chỉ được upload file ảnh!')
      return false
    }

    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isLt5M) {
      message.error('Ảnh phải nhỏ hơn 5MB!')
      return false
    }

    // Preview image for OCR only
    const reader = new FileReader()
    reader.onload = (e) => {
      setCccdPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Extract info from CCCD
    handleExtractInfo(file)

    return false // Prevent auto upload
  }

  const extractWithFPTAI = async (file: File) => {
    const formData = new FormData()
    formData.append('image', file)

    // TODO: Replace with your actual FPT.AI API key
    // Get your API key from: https://fpt.ai/
    const API_KEY = import.meta.env.VITE_FPT_AI_API_KEY || 'BNjMpBvuehF7DtmBXJYB0NLYcxKRNoZM'

    const response = await fetch('https://api.fpt.ai/vision/idr/vnm', {
      method: 'POST',
      headers: {
        'api-key': API_KEY,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Lỗi khi gọi API FPT.AI')
    }

    const result = await response.json()

    // FPT.AI response structure
    const data = result.data[0]

    // Format date from DD/MM/YYYY to YYYY-MM-DD
    const formatDate = (dateStr: string) => {
      if (!dateStr) return ''
      const parts = dateStr.split('/')
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`
      }
      return dateStr
    }

    // Normalize gender: NAM -> Nam, Nữ -> Nữ
    const normalizeGender = (gender: string) => {
      if (!gender) return ''
      const upperGender = gender.toUpperCase()
      if (upperGender === 'NAM') return 'Nam'
      if (upperGender === 'Nữ' || upperGender === 'NU') return 'Nữ'
      return 'Khác'
    }

    // Capitalize first letter of each word
    const toTitleCase = (str: string) => {
      if (!str) return ''
      return str
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }

    return {
      idNumber: data.id || '',
      fullName: toTitleCase(data.name || ''),
      dateOfBirth: formatDate(data.dob || ''),
      gender: normalizeGender(data.sex || ''),
      nationality: toTitleCase(data.nationality || 'Việt Nam'),
      placeOfOrigin: toTitleCase(data.home || ''),
      placeOfResidence: toTitleCase(data.address || ''),
      expiryDate: formatDate(data.doe || ''),
    }
  }

  const handleExtractInfo = async (file: File) => {
    setExtracting(true)
    try {
      // Call FPT.AI API to extract info from CCCD image
      const extractedData = await extractWithFPTAI(file)

      // Set form values
      form.setFieldsValue({
        idNumber: extractedData.idNumber,
        fullName: extractedData.fullName,
        dateOfBirth: extractedData.dateOfBirth ? dayjs(extractedData.dateOfBirth) : null,
        gender: extractedData.gender,
        nationality: extractedData.nationality,
        placeOfOrigin: extractedData.placeOfOrigin,
        placeOfResidence: extractedData.placeOfResidence,
        expiryDate: extractedData.expiryDate ? dayjs(extractedData.expiryDate) : null,
      })

      message.success('Đã trích xuất thông tin từ CCCD thành công!')
    } catch (error: any) {
      console.error('OCR Error:', error)
      message.error(error.message || 'Không thể trích xuất thông tin từ ảnh CCCD')
    } finally {
      setExtracting(false)
    }
  }

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      const profileData = {
        full_name: values.fullName,
        cccd_number: values.idNumber,
        birth_date: values.dateOfBirth?.format('YYYY-MM-DD'),
        gender: values.gender,
        nationality: values.nationality,
        expiry_date: values.expiryDate?.format('YYYY-MM-DD'),
        hometown: values.placeOfOrigin,
        residence_address: values.placeOfResidence,
        avatar_url: values.avatarUrl || null,
      }

      const response = await AuthService.updateProfile(profileData)

      if (response.data) {
        message.success('Lưu hồ sơ thành công!')

        // Update global state if using Redux/Context
        // dispatch(setUserInfo(response.data))

        // Navigate to profile view page
        navigate('/profile/view')
      }
    } catch (error: any) {
      message.error(error?.message || 'Có lỗi xảy ra khi lưu hồ sơ')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveCccdImage = () => {
    setCccdFileList([])
    setCccdPreviewUrl('')
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.content}>
        <Row gutter={24}>
          {/* Upload CCCD Section */}
          <Col xs={24} lg={10}>
            <Card className={styles.uploadCard}>
              <h3 className={styles.cardTitle}>
                <CameraOutlined /> Ảnh Căn Cước Công Dân
              </h3>

              <div className={styles.uploadSection}>
                {cccdPreviewUrl ? (
                  <div className={styles.imagePreview}>
                    <img src={cccdPreviewUrl} alt="CCCD" className={styles.previewImg} />
                    <div className={styles.imageOverlay}>
                      <Button danger onClick={handleRemoveCccdImage} className={styles.removeBtn}>
                        Xóa ảnh
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Upload
                    listType="picture-card"
                    fileList={cccdFileList}
                    onChange={handleUploadChange}
                    beforeUpload={beforeUpload}
                    maxCount={1}
                    className={styles.uploadArea}
                  >
                    <div className={styles.uploadContent}>
                      <UploadOutlined className={styles.uploadIcon} />
                      <div className={styles.uploadText}>
                        <p>Tải lên ảnh CCCD</p>
                        <p className={styles.uploadHint}>PNG, JPG (tối đa 5MB)</p>
                      </div>
                    </div>
                  </Upload>
                )}
              </div>

              {extracting && (
                <div className={styles.extractingInfo}>
                  <div className={styles.spinner}></div>
                  <p>Đang trích xuất thông tin từ ảnh CCCD...</p>
                </div>
              )}

              <div className={styles.uploadNote}>
                <p>📌 Lưu ý:</p>
                <ul>
                  <li>Chụp rõ nét, không bị mờ hoặc lóa</li>
                  <li>Đảm bảo đầy đủ 4 góc của CCCD</li>
                  <li>Ảnh chụp thẳng, không bị nghiêng</li>
                </ul>
              </div>
            </Card>
          </Col>

          {/* Form Section */}
          <Col xs={24} lg={14}>
            <Card className={styles.formCard}>
              <h3 className={styles.cardTitle}>Thông Tin Cá Nhân</h3>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className={styles.profileForm}
              >
                <Row gutter={16}>
                  <Col xs={24}>
                    <Form.Item
                      label="URL Ảnh đại diện"
                      name="avatarUrl"
                      rules={[{ type: 'url', message: 'Vui lòng nhập URL hợp lệ' }]}
                    >
                      <Input placeholder="Nhập URL ảnh đại diện (https://...)" size="large" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Số CCCD"
                      name="idNumber"
                      rules={[
                        { required: true, message: 'Vui lòng nhập số CCCD' },
                        { pattern: /^\d{12}$/, message: 'Số CCCD phải có 12 chữ số' },
                      ]}
                    >
                      <Input placeholder="Nhập số CCCD" size="large" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Họ và tên"
                      name="fullName"
                      rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                    >
                      <Input placeholder="Nhập họ và tên" size="large" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Ngày sinh"
                      name="dateOfBirth"
                      rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                    >
                      <DatePicker
                        placeholder="Chọn ngày sinh"
                        format="DD/MM/YYYY"
                        size="large"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Giới tính"
                      name="gender"
                      rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                    >
                      <Select placeholder="Chọn giới tính" size="large">
                        <Select.Option value="Nam">Nam</Select.Option>
                        <Select.Option value="Nữ">Nữ</Select.Option>
                        <Select.Option value="Khác">Khác</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Quốc tịch"
                      name="nationality"
                      rules={[{ required: true, message: 'Vui lòng nhập quốc tịch' }]}
                    >
                      <Input placeholder="Nhập quốc tịch" size="large" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Ngày hết hạn"
                      name="expiryDate"
                      rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn' }]}
                    >
                      <DatePicker
                        placeholder="Chọn ngày hết hạn"
                        format="DD/MM/YYYY"
                        size="large"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item
                      label="Quê quán"
                      name="placeOfOrigin"
                      rules={[{ required: true, message: 'Vui lòng nhập quê quán' }]}
                    >
                      <Input placeholder="Nhập quê quán" size="large" />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item
                      label="Nơi thường trú"
                      name="placeOfResidence"
                      rules={[{ required: true, message: 'Vui lòng nhập nơi thường trú' }]}
                    >
                      <Input.TextArea placeholder="Nhập địa chỉ thường trú" rows={3} size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <div className={styles.formActions}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={loading}
                    size="large"
                    className={styles.saveBtn}
                  >
                    Lưu hồ sơ
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default ProfilePage
