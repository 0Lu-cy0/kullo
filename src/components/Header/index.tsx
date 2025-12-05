import { Button, Dropdown, Space } from 'antd'
import { SearchOutlined, UserOutlined, GlobalOutlined, DownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import './Header.scss'
import ROUTER from '~/routers'

const Header = () => {
  const navigate = useNavigate()
  const navSections: Array<{ label: string; items: MenuProps['items'] }> = [
    {
      label: 'SẢN PHẨM',
      items: [
        { key: 'product-board', label: <Link to="/platform/boards">Bảng Kanban Kullo</Link> },
        { key: 'product-sprint', label: <Link to="/platform/sprint">Sprint & Agile</Link> },
        { key: 'product-sync', label: <Link to="/platform/calendar">Lịch & Automation</Link> }
      ]
    },
    {
      label: 'GIẢI PHÁP',
      items: [
        { key: 'solution-engineering', label: <Link to="/solutions/engineering">Đội kỹ thuật</Link> },
        { key: 'solution-marketing', label: <Link to="/solutions/marketing">Marketing đa kênh</Link> },
        { key: 'solution-pmo', label: <Link to="/solutions/pmo">PMO & vận hành</Link> }
      ]
    },
    {
      label: 'TÀI NGUYÊN',
      items: [
        { key: 'resource-library', label: <Link to="/resources/library">Thư viện hướng dẫn</Link> },
        { key: 'resource-webinar', label: <Link to="/resources/webinar">Webinar & workshop</Link> },
        { key: 'resource-blog', label: <Link to="/blog">Blog Kullo</Link> }
      ]
    },
    {
      label: 'TÍCH HỢP',
      items: [
        { key: 'integration-finance', label: <Link to="/integrations/finance">Ngân hàng & cổng thanh toán</Link> },
        { key: 'integration-devtools', label: <Link to="/integrations/devtools">DevOps & chat</Link> }
      ]
    },
    {
      label: 'ĐỐI TÁC',
      items: [
        { key: 'partner-network', label: <Link to="/partners">Mạng lưới triển khai</Link> },
        { key: 'partner-program', label: <Link to="/partners/program">Trở thành đối tác</Link> }
      ]
    }
  ]

  const quickLinks = [
    { key: 'pricing', label: 'BẢNG GIÁ', to: '/pricing' },
    { key: 'case', label: 'KHÁCH HÀNG', to: '/case-studies' }
  ]

  return (
    <header className="kullo-header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <span className="logo-mark">K</span>
          <div className="logo-text">
            <span className="logo-title">Kullo</span>
            <span className="logo-tagline">Workspace OS</span>
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav className="header-nav">
          {navSections.map((section) => (
            <Dropdown key={section.label} menu={{ items: section.items }} placement="bottomLeft">
              <button type="button" className="nav-link" onClick={(e) => e.preventDefault()}>
                <Space size={6}>
                  {section.label}
                  <DownOutlined style={{ fontSize: '10px' }} />
                </Space>
              </button>
            </Dropdown>
          ))}

          {quickLinks.map((link) => (
            <Link key={link.key} to={link.to} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
          <Button type="text" icon={<SearchOutlined />} className="search-btn" />

          <Button
            icon={<UserOutlined />}
            className="login-btn"
            onClick={() => navigate(ROUTER.DANG_NHAP)}
          >
            ĐĂNG NHẬP
          </Button>

          <Button size="large" className="demo-btn" onClick={() => navigate('/book-demo')}>
            ĐẶT LỊCH DEMO
          </Button>

          <Button type="primary" size="large" className="start-btn">
            DÙNG THỬ MIỄN PHÍ
          </Button>

          <Dropdown
            menu={{
              items: [
                { key: 'vi', label: 'Tiếng Việt' },
                { key: 'en', label: 'English' }
              ]
            }}
          >
            <Button icon={<GlobalOutlined />} className="lang-btn">
              VN
            </Button>
          </Dropdown>
        </div>
      </div>
    </header>
  )
}

export default Header
