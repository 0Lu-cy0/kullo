import { Button, Row, Col, Card } from 'antd'
import {
  RocketOutlined,
  TeamOutlined,
  ProjectOutlined,
  MessageOutlined,
  CalendarOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import './HomePage.scss'

const HomePage = () => {
  console.log('HomePage rendering')
  const features = [
    {
      icon: <TeamOutlined />,
      title: 'Quản lý nhóm',
      description: 'Tổ chức và quản lý nhóm làm việc hiệu quả',
    },
    {
      icon: <ProjectOutlined />,
      title: 'Quản lý dự án',
      description: 'Theo dõi tiến độ dự án một cách trực quan',
    },
    {
      icon: <MessageOutlined />,
      title: 'Giao tiếp nội bộ',
      description: 'Chat và trao đổi công việc ngay trên nền tảng',
    },
    {
      icon: <CalendarOutlined />,
      title: 'Lịch làm việc',
      description: 'Lên lịch và quản lý thời gian làm việc',
    },
    {
      icon: <FileTextOutlined />,
      title: 'Quản lý tài liệu',
      description: 'Lưu trữ và chia sẻ tài liệu dễ dàng',
    },
    {
      icon: <RocketOutlined />,
      title: 'Tự động hóa',
      description: 'Tự động hóa quy trình làm việc',
    },
  ]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <Row align="middle" gutter={[48, 48]}>
            <Col xs={24} lg={12}>
              <h1 className="hero-title">Nền tảng quản lý công việc và cộng tác nhóm</h1>
              <p className="hero-description">
                Trello24 giúp bạn tổ chức công việc, quản lý dự án và cộng tác với đội nhóm hiệu quả
                hơn. Tất cả trong một nền tảng duy nhất.
              </p>
              <div className="hero-actions">
                <Button
                  type="primary"
                  size="large"
                  icon={<RocketOutlined />}
                  style={{
                    backgroundColor: '#c3ff00',
                    color: '#000',
                    fontWeight: 'bold',
                    height: '50px',
                    padding: '0 40px',
                    fontSize: '16px',
                  }}
                >
                  BẮT ĐẦU MIỄN PHÍ
                </Button>
                <Button
                  size="large"
                  style={{
                    height: '50px',
                    padding: '0 40px',
                    fontSize: '16px',
                  }}
                >
                  XEM DEMO
                </Button>
              </div>
              <p className="hero-note">
                ✓ Miễn phí 30 ngày • Không cần thẻ tín dụng • Hủy bất cứ lúc nào
              </p>
            </Col>
            <Col xs={24} lg={12}>
              <div className="hero-image">
                <img
                  src="https://via.placeholder.com/600x400/0052cc/ffffff?text=Trello24+Dashboard"
                  alt="Trello24 Dashboard"
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  }}
                />
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Tính năng nổi bật</h2>
            <p>Mọi công cụ bạn cần để quản lý công việc hiệu quả</p>
          </div>

          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card className="feature-card" hoverable>
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <Row gutter={[48, 48]} justify="center">
            <Col xs={12} md={6}>
              <div className="stat-item">
                <h3>2M+</h3>
                <p>Người dùng</p>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="stat-item">
                <h3>50K+</h3>
                <p>Công ty</p>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="stat-item">
                <h3>150+</h3>
                <p>Quốc gia</p>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="stat-item">
                <h3>99.9%</h3>
                <p>Uptime</p>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Sẵn sàng bắt đầu?</h2>
            <p>Tham gia cùng hàng triệu người dùng đang sử dụng Trello24 mỗi ngày</p>
            <Button
              type="primary"
              size="large"
              style={{
                backgroundColor: '#c3ff00',
                color: '#000',
                fontWeight: 'bold',
                height: '50px',
                padding: '0 60px',
                fontSize: '16px',
                marginTop: '20px',
              }}
            >
              BẮT ĐẦU NGAY
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
