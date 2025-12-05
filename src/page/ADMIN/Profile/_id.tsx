import { Avatar, Typography, Button, Space, Divider, Tag, Row, Col, Tooltip, message } from 'antd'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  LinkedinOutlined,
  GithubOutlined,
  FacebookOutlined,
  DownloadOutlined,
  CopyOutlined,
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography

// Dữ liệu mẫu cho profile (Bạn có thể thay đổi ở đây)
const userData = {
  fullName: 'Nguyễn Văn A',
  position: 'Senior Frontend Developer',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', // Ảnh đại diện mẫu
  coverImage:
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  email: 'nguyenvana@email.com',
  phone: '0912 345 678',
  address: 'Số 10, Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
  website: 'www.nguyenvana.dev',
  skills: ['ReactJS', 'Ant Design', 'SCSS', 'TypeScript', 'NodeJS'],
  bio: 'Lập trình viên đam mê công nghệ với 5 năm kinh nghiệm xây dựng các ứng dụng web hiệu suất cao. Luôn tìm tòi học hỏi các công nghệ mới và tối ưu trải nghiệm người dùng.',
}

export default function ProfileDetails() {
  const [messageApi, contextHolder] = message.useMessage()

  const handleCopy = (text: any, type: string) => {
    navigator.clipboard.writeText(text)
    messageApi.success(`Đã sao chép ${type} vào bộ nhớ tạm!`)
  }

  return (
    <div className="profile-container">
      {contextHolder}

      {/* CSS Styles - Mô phỏng cấu trúc SCSS */}
      <style>{`
        .profile-container {
          min-height: 100vh;
          background-color: #f0f2f5;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .profile-card {
          width: 100%;
          max-width: 800px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          background: white;
        }

        /* Header Area */
        .profile-header {
          position: relative;
          margin-bottom: 60px;
        }

        .cover-image {
          height: 200px;
          width: 100%;
          object-fit: cover;
        }

        .avatar-container {
          position: absolute;
          bottom: -50px;
          left: 50%;
          transform: translateX(-50%);
          padding: 4px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        /* Content Area */
        .profile-content {
          padding: 0 40px 40px 40px;
          text-align: center;
        }

        .user-name {
          margin-bottom: 0 !important;
          color: #1f1f1f;
        }

        .user-position {
          color: #1890ff;
          font-weight: 500;
          font-size: 16px;
          margin-top: 4px;
          display: block;
        }

        .action-buttons {
          margin: 24px 0;
        }

        /* Info Section */
        .info-section {
          background-color: #fafafa;
          border-radius: 12px;
          padding: 24px;
          margin-top: 24px;
          text-align: left;
        }

        .info-item {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          font-size: 15px;
        }
        
        .info-item:last-child {
          margin-bottom: 0;
        }

        .info-icon {
          color: #1890ff;
          font-size: 18px;
          margin-right: 12px;
          width: 24px;
          text-align: center;
        }

        .info-label {
          color: #8c8c8c;
          width: 80px;
          display: inline-block;
        }

        .info-value {
          color: #262626;
          font-weight: 500;
          flex: 1;
          word-break: break-word;
        }

        .skills-container {
          margin-top: 24px;
        }

        /* Responsive */
        @media (max-width: 576px) {
          .profile-content {
            padding: 0 20px 30px 20px;
          }
          
          .info-label {
            display: none; /* Ẩn nhãn trên mobile để tiết kiệm chỗ */
          }
        }
      `}</style>

      <div className="profile-card">
        {/* Phần Ảnh Bìa & Avatar */}
        <div className="profile-header">
          <img src={userData.coverImage} alt="Cover" className="cover-image" />
          <div className="avatar-container">
            <Avatar size={120} src={userData.avatar} icon={<UserOutlined />} />
          </div>
        </div>

        {/* Phần Nội Dung Chính */}
        <div className="profile-content">
          <Title level={2} className="user-name">
            {userData.fullName}
          </Title>
          <Text className="user-position">{userData.position}</Text>

          <Paragraph
            type="secondary"
            style={{ marginTop: 16, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}
          >
            {userData.bio}
          </Paragraph>

          <Space className="action-buttons" size="middle">
            <Button type="primary" shape="round" icon={<MailOutlined />} size="large">
              Liên hệ ngay
            </Button>
            <Button shape="round" icon={<DownloadOutlined />} size="large">
              Tải CV
            </Button>
          </Space>

          <Row gutter={[32, 32]}>
            {/* Cột Trái: Thông tin liên hệ */}
            <Col xs={24} md={12}>
              <div className="info-section">
                <Title level={5} style={{ marginBottom: 20 }}>
                  Thông tin liên hệ
                </Title>

                <div className="info-item">
                  <span className="info-icon">
                    <MailOutlined />
                  </span>
                  <span className="info-label">Email:</span>
                  <span className="info-value">
                    {userData.email}
                    <Tooltip title="Sao chép email">
                      <Button
                        type="text"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() => handleCopy(userData.email, 'Email')}
                      />
                    </Tooltip>
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-icon">
                    <PhoneOutlined />
                  </span>
                  <span className="info-label">Điện thoại:</span>
                  <span className="info-value">
                    {userData.phone}
                    <Tooltip title="Sao chép SĐT">
                      <Button
                        type="text"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() => handleCopy(userData.phone, 'SĐT')}
                      />
                    </Tooltip>
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-icon">
                    <EnvironmentOutlined />
                  </span>
                  <span className="info-label">Địa chỉ:</span>
                  <span className="info-value">{userData.address}</span>
                </div>

                <div className="info-item">
                  <span className="info-icon">
                    <GlobalOutlined />
                  </span>
                  <span className="info-label">Website:</span>
                  <span className="info-value">
                    <a href={`https://${userData.website}`} target="_blank" rel="noreferrer">
                      {userData.website}
                    </a>
                  </span>
                </div>
              </div>
            </Col>

            {/* Cột Phải: Kỹ năng & Mạng xã hội */}
            <Col xs={24} md={12}>
              <div
                className="info-section"
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Title level={5}>Kỹ năng chuyên môn</Title>
                <div className="skills-container">
                  {userData.skills.map((skill, index) => (
                    <Tag
                      color="blue"
                      key={index}
                      style={{ marginBottom: 8, padding: '4px 10px', fontSize: '14px' }}
                    >
                      {skill}
                    </Tag>
                  ))}
                </div>

                <Divider />

                <Title level={5}>Mạng xã hội</Title>
                <Space size="large" style={{ marginTop: 10 }}>
                  <Tooltip title="LinkedIn">
                    <Button shape="circle" icon={<LinkedinOutlined />} size="large" href="#" />
                  </Tooltip>
                  <Tooltip title="GitHub">
                    <Button shape="circle" icon={<GithubOutlined />} size="large" href="#" />
                  </Tooltip>
                  <Tooltip title="Facebook">
                    <Button shape="circle" icon={<FacebookOutlined />} size="large" href="#" />
                  </Tooltip>
                </Space>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}
