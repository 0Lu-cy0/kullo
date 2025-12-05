import { Card, Button, Typography, message, Modal, Row, Col } from 'antd'
import {
  LogoutOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  SafetyOutlined,
  BellOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { AuthService } from '~/services/AuthService'
import STORAGE, { deleteStorage, getStorage } from '~/libs/storage'
import ROUTER from '~/routers'

const { Title, Text, Paragraph } = Typography
const { confirm } = Modal

const SettingsPage = () => {
  const navigate = useNavigate()
  const userInfo = getStorage(STORAGE.USER_INFO)

  const handleLogout = () => {
    confirm({
      title: 'Xác nhận đăng xuất',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
      okText: 'Đăng xuất',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await AuthService.logout()
          deleteStorage(STORAGE.TOKEN)
          deleteStorage(STORAGE.USER_INFO)
          message.success('Đăng xuất thành công!')
          navigate(ROUTER.DANG_NHAP)
        } catch (error) {
          deleteStorage(STORAGE.TOKEN)
          deleteStorage(STORAGE.USER_INFO)
          message.warning('Đã đăng xuất')
          navigate(ROUTER.DANG_NHAP)
        }
      },
    })
  }

  const settingsCards = [
    {
      icon: <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      title: 'Thông tin tài khoản',
      description: 'Quản lý thông tin cá nhân và tài khoản của bạn',
      action: () => navigate(ROUTER.PROFILE),
      buttonText: 'Xem chi tiết',
      disabled: false,
    },
    {
      icon: <SafetyOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      title: 'Bảo mật',
      description: 'Cài đặt mật khẩu và các tùy chọn bảo mật',
      action: null,
      buttonText: 'Cài đặt',
      disabled: true,
    },
    {
      icon: <BellOutlined style={{ fontSize: '24px', color: '#faad14' }} />,
      title: 'Thông báo',
      description: 'Quản lý cài đặt thông báo và email',
      action: null,
      buttonText: 'Cài đặt',
      disabled: true,
    },
  ]

  return (
    <div
      style={{
        padding: '32px',
        minHeight: '100vh',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <Title level={1} style={{ color: 'white', marginBottom: '8px' }}>
            <SettingOutlined /> Cài đặt
          </Title>
          <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '16px' }}>
            Quản lý tài khoản và tùy chỉnh trải nghiệm của bạn
          </Text>
        </div>

        {/* Logout Card */}
        <Card
          style={{
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '2px solid #ff4d4f',
          }}
        >
          <div style={{ padding: '8px 0' }}>
            <Row align="middle" justify="space-between">
              <Col xs={24} md={16}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <LogoutOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
                  <div>
                    <Title level={5} style={{ margin: 0, color: '#ff4d4f' }}>
                      Đăng xuất
                    </Title>
                    <Text type="secondary">Đăng xuất khỏi tài khoản của bạn trên thiết bị này</Text>
                  </div>
                </div>
              </Col>
              <Col xs={24} md={8} style={{ textAlign: 'right', marginTop: { xs: 16, md: 0 } }}>
                <Button
                  type="primary"
                  danger
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  size="large"
                  style={{ borderRadius: '8px' }}
                >
                  Đăng xuất
                </Button>
              </Col>
            </Row>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SettingsPage
