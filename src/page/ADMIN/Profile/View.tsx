import { useState, useEffect } from 'react'
import { Card, Descriptions, Avatar, Button, Spin, message, Row, Col } from 'antd'
import { UserOutlined, EditOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import AuthService from '~/services/AuthService'
import type { UserModel } from '~/types/models/User'
import dayjs from 'dayjs'
import styles from './view.module.scss'

const ProfileView = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<UserModel | null>(null)

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      setLoading(true)
      const response = await AuthService.getUserInfo()
      if (response.data) {
        setUserInfo(response.data)
      }
    } catch (error: any) {
      message.error(error?.message || 'Không thể tải thông tin người dùng')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    navigate('/profile')
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className={styles.profileViewContainer}>
      <Row gutter={24}>
        <Col xs={24} lg={8}>
          <Card className={styles.avatarCard}>
            <div className={styles.avatarSection}>
              <Avatar
                size={150}
                icon={<UserOutlined />}
                src={userInfo?.avatar_url || userInfo?.avatar}
                className={styles.avatar}
              />
              <h2 className={styles.userName}>{userInfo?.full_name || 'Chưa cập nhật'}</h2>
              <p className={styles.userRole}>
                {userInfo?.role || userInfo?.department || 'Nhân viên'}
              </p>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEdit}
                size="large"
                block
                className={styles.editBtn}
              >
                Chỉnh sửa hồ sơ
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card title="Thông Tin Cá Nhân" className={styles.infoCard}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Email">
                {userInfo?.email || 'Chưa cập nhật'}
              </Descriptions.Item>

              <Descriptions.Item label="Họ và tên">
                {userInfo?.full_name || 'Chưa cập nhật'}
              </Descriptions.Item>

              <Descriptions.Item label="Số CCCD">
                {userInfo?.cccd_number || 'Chưa cập nhật'}
              </Descriptions.Item>

              <Descriptions.Item label="Ngày sinh">
                {userInfo?.birth_date
                  ? dayjs(userInfo.birth_date).format('DD/MM/YYYY')
                  : 'Chưa cập nhật'}
              </Descriptions.Item>

              <Descriptions.Item label="Giới tính">
                {userInfo?.gender || 'Chưa cập nhật'}
              </Descriptions.Item>

              <Descriptions.Item label="Quốc tịch">
                {userInfo?.nationality || 'Chưa cập nhật'}
              </Descriptions.Item>

              <Descriptions.Item label="Ngày hết hạn CCCD">
                {userInfo?.expiry_date
                  ? dayjs(userInfo.expiry_date).format('DD/MM/YYYY')
                  : 'Chưa cập nhật'}
              </Descriptions.Item>

              <Descriptions.Item label="Số điện thoại">
                {userInfo?.phone || 'Chưa cập nhật'}
              </Descriptions.Item>

              <Descriptions.Item label="Quê quán">
                {userInfo?.hometown || 'Chưa cập nhật'}
              </Descriptions.Item>

              <Descriptions.Item label="Nơi thường trú">
                {userInfo?.residence_address || 'Chưa cập nhật'}
              </Descriptions.Item>

              <Descriptions.Item label="Phòng ban">
                {userInfo?.department || 'Chưa cập nhật'}
              </Descriptions.Item>

              <Descriptions.Item label="Ngôn ngữ">
                {userInfo?.language === 'vi'
                  ? 'Tiếng Việt'
                  : userInfo?.language === 'en'
                    ? 'English'
                    : userInfo?.language === 'jp'
                      ? '日本語'
                      : userInfo?.language === 'fr'
                        ? 'Français'
                        : 'Chưa cập nhật'}
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái xác thực">
                {userInfo?.is_verified ? (
                  <span style={{ color: '#52c41a' }}>✓ Đã xác thực</span>
                ) : (
                  <span style={{ color: '#faad14' }}>Chưa xác thực</span>
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Ngày tạo tài khoản">
                {userInfo?.created_at
                  ? dayjs(userInfo.created_at).format('DD/MM/YYYY HH:mm')
                  : 'Chưa cập nhật'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ProfileView
