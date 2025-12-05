import { Button, Row, Col, Card, Typography, Tag } from 'antd'
import {
  RocketOutlined,
  TeamOutlined,
  ProjectOutlined,
  MessageOutlined,
  CalendarOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'
import './HomePage.scss'

const { Title, Paragraph, Text } = Typography

const featureList = [
  {
    icon: <TeamOutlined />,
    title: 'Không gian nhóm',
    description: 'Quản lý nhiều phòng ban với quyền truy cập linh hoạt và minh bạch.'
  },
  {
    icon: <ProjectOutlined />,
    title: 'Bảng dự án trực quan',
    description: 'Tổng quan tiến độ theo trạng thái, sprint và deadline quan trọng.'
  },
  {
    icon: <MessageOutlined />,
    title: 'Trao đổi tức thì',
    description: 'Nhắn tin, phản hồi và đề xuất ngay trong từng nhiệm vụ.'
  },
  {
    icon: <CalendarOutlined />,
    title: 'Lịch làm việc hợp nhất',
    description: 'Kéo thả lịch biểu, đồng bộ email và nhắc việc thông minh.'
  },
  {
    icon: <FileTextOutlined />,
    title: 'Kho tài liệu sống',
    description: 'Quy chuẩn tài liệu, versioning rõ ràng, đầy đủ lịch sử sửa đổi.'
  },
  {
    icon: <ThunderboltOutlined />,
    title: 'Tự động hóa quy trình',
    description: 'Trigger đa bước giúp loại bỏ thao tác lặp lại hằng ngày.'
  }
]

const workflowSteps = [
  {
    step: '01',
    title: 'Lập kế hoạch sprint',
    detail: 'Chọn template phù hợp, kéo backlog và dự trù nguồn lực theo vai trò.'
  },
  {
    step: '02',
    title: 'Triển khai & cộng tác',
    detail: 'Theo dõi tiến độ theo thời gian thực với bình luận, checklist và automation.'
  },
  {
    step: '03',
    title: 'Đo lường & tối ưu',
    detail: 'Dashboard hợp nhất giúp tìm bottleneck và cải thiện năng suất đội ngũ.'
  }
]

const stats = [
  { value: '2M+', label: 'Người dùng toàn cầu', note: 'Hơn 190 quốc gia sử dụng mỗi ngày.' },
  { value: '50K+', label: 'Doanh nghiệp', note: 'Từ start-up đến tập đoàn đa quốc gia.' },
  { value: '99.95%', label: 'Uptime hằng năm', note: 'Hạ tầng đạt chuẩn doanh nghiệp.' },
  { value: '4.9/5', label: 'Mức độ hài lòng', note: 'Theo khảo sát khách hàng 2025.' }
]

const testimonials = [
  {
    quote:
      '"Từ khi chuyển qua Kullo, đội mình giảm 35% thời gian họp cập nhật vì mọi dữ liệu đều realtime."',
    author: 'Linh Nguyễn',
    role: 'Head of Product · GHTK'
  },
  {
    quote:
      '"Automation và phân quyền rõ ràng giúp dự án chuyển giao giữa các squad diễn ra cực kỳ mượt."',
    author: 'Trung Phạm',
    role: 'Engineering Manager · Base.vn'
  }
]

type TrustBadge = {
  name: string
  initials: string
  gradient: string
  textColor: string
  tagline: string
}

const trustBadges: TrustBadge[] = [
  {
    name: 'FPT Software',
    initials: 'FPT',
    gradient: 'linear-gradient(135deg, #ff6f20, #ffb347)',
    textColor: '#fff7f0',
    tagline: 'Enterprise Tech'
  },
  {
    name: 'Viettel Solutions',
    initials: 'VT',
    gradient: 'linear-gradient(135deg, #00a859, #006d3c)',
    textColor: '#f0fff4',
    tagline: 'Telecom'
  },
  {
    name: 'MoMo',
    initials: 'Mo',
    gradient: 'linear-gradient(135deg, #d9017a, #ff4f9a)',
    textColor: '#fff0f8',
    tagline: 'E-Wallet'
  },
  {
    name: 'VNPay',
    initials: 'VP',
    gradient: 'linear-gradient(135deg, #004aad, #00a4ff)',
    textColor: '#f0f6ff',
    tagline: 'Payment'
  },
  {
    name: 'VNG',
    initials: 'VNG',
    gradient: 'linear-gradient(135deg, #ff5b2e, #ff9f45)',
    textColor: '#fff7f0',
    tagline: 'Digital Media'
  },
  {
    name: 'Be Group',
    initials: 'be',
    gradient: 'linear-gradient(135deg, #ffe600, #ffb800)',
    textColor: '#1f1400',
    tagline: 'Mobility'
  }
]

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <Row align="middle" gutter={[48, 48]} className="hero-grid">
            <Col xs={24} lg={12}>
              <Title level={1} className="hero-title">
                Nền tảng quản lý công việc dành cho đội nhóm Việt Nam
              </Title>
              <Paragraph className="hero-description">
                Tổ chức backlog, sprint, lịch biểu và trao đổi nội bộ trên một mặt phẳng duy nhất.
                Kullo được thiết kế để bám sát quy trình Agile nhưng vẫn đủ linh hoạt cho các bộ
                phận non-tech.
              </Paragraph>
              <div className="hero-actions">
                <Button type="primary" size="large" icon={<RocketOutlined />} className="btn-cta">
                  Bắt đầu miễn phí
                </Button>
                <Button size="large" icon={<PlayCircleOutlined />} className="btn-secondary">
                  Xem demo trực tiếp
                </Button>
              </div>
              <div className="hero-note">
                <CheckCircleOutlined />
                <Text strong> Dùng thử 30 ngày</Text>
                <span> • Không cần thẻ tín dụng • Hủy bất cứ lúc nào</span>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="hero-visual">
                <div className="hero-visual__glow" />
                <Card bordered={false} className="hero-visual__card">
                  <div className="hero-visual__header">
                    <Text className="hero-visual__tag">Sprint 12 · Mobile App</Text>
                    <Tag color="success">On Track</Tag>
                  </div>
                  <ul className="hero-visual__list">
                    {['Thiết kế UI booking', 'Tích hợp VNPay', 'Setup alert lỗi', 'Đào tạo QA'].map(
                      (task, index) => (
                        <li key={task}>
                          <span className="task-index">0{index + 1}</span>
                          <div>
                            <Text strong>{task}</Text>
                            <Paragraph type="secondary">Hoàn thành {70 + index * 5}%</Paragraph>
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      <section className="logo-strip">
        <div className="container">
          <Row gutter={[24, 24]} justify="center" align="middle">
            {trustBadges.map((badge) => (
              <Col key={badge.name} xs={12} sm={8} md={4} className="logo-strip__item">
                <div className="logo-chip">
                  <span
                    className="logo-chip__icon"
                    style={{ background: badge.gradient, color: badge.textColor }}
                  >
                    {badge.initials}
                  </span>
                  <div className="logo-chip__info">
                    <Text strong>{badge.name}</Text>
                    <span>{badge.tagline}</span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <Title level={2}>Bộ công cụ hợp nhất</Title>
            <Paragraph>Mọi thứ bạn cần để đưa dự án về đích đúng hẹn.</Paragraph>
          </div>
          <Row gutter={[24, 24]}>
            {featureList.map((feature) => (
              <Col xs={24} sm={12} lg={8} key={feature.title}>
                <Card className="feature-card" bordered={false} hoverable>
                  <div className="feature-icon">{feature.icon}</div>
                  <Title level={4}>{feature.title}</Title>
                  <Paragraph>{feature.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <section className="workflow-section">
        <div className="container">
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} lg={10}>
              <Title level={3}>Quy trình liền mạch từ backlog tới báo cáo</Title>
              <Paragraph>
                Kullo kết nối mọi bước của vòng đời dự án, đảm bảo thông tin không bị thất lạc
                giữa các công cụ rời rạc.
              </Paragraph>
            </Col>
            <Col xs={24} lg={14}>
              <div className="workflow-steps">
                {workflowSteps.map((step) => (
                  <div className="workflow-step" key={step.step}>
                    <div className="workflow-step__index">{step.step}</div>
                    <div>
                      <Title level={4}>{step.title}</Title>
                      <Paragraph>{step.detail}</Paragraph>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <Row gutter={[24, 24]}>
            {stats.map((stat) => (
              <Col xs={12} md={6} key={stat.label}>
                <Card bordered={false} className="stat-card">
                  <Text className="stat-value">{stat.value}</Text>
                  <Paragraph className="stat-label">{stat.label}</Paragraph>
                  <Paragraph type="secondary">{stat.note}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <section className="testimonial-section">
        <div className="container">
          <Row gutter={[24, 24]}>
            {testimonials.map((item) => (
              <Col xs={24} md={12} key={item.author}>
                <Card bordered={false} className="testimonial-card">
                  <Paragraph className="testimonial-quote">{item.quote}</Paragraph>
                  <Text strong>{item.author}</Text>
                  <Paragraph type="secondary">{item.role}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <Title level={2}>Sẵn sàng tăng tốc cùng Kullo?</Title>
            <Paragraph>
              Khởi tạo workspace miễn phí, mời đội nhóm và khám phá hơn 40+ automation dựng sẵn.
            </Paragraph>
            <div className="cta-actions">
              <Button type="primary" size="large" icon={<RocketOutlined />} className="btn-cta">
                Dùng thử miễn phí
              </Button>
              <Button size="large" className="btn-secondary">
                Nói chuyện với chuyên gia
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
