import { Button, Dropdown, Space } from 'antd'
import { SearchOutlined, UserOutlined, GlobalOutlined, DownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import './Header.scss'
import ROUTER from '~/routers'

const Header = () => {
  const navigate = useNavigate()
  const productItems: MenuProps['items'] = [
    { key: '1', label: <Link to="/crm">CRM</Link> },
    { key: '2', label: <Link to="/tasks">Quản lý công việc</Link> },
    { key: '3', label: <Link to="/drive">Lưu trữ đám mây</Link> },
  ]

  const resourceItems: MenuProps['items'] = [
    { key: '1', label: <Link to="/docs">Tài liệu</Link> },
    { key: '2', label: <Link to="/support">Hỗ trợ</Link> },
    { key: '3', label: <Link to="/blog">Blog</Link> },
  ]

  const solutionItems: MenuProps['items'] = [
    { key: '1', label: <Link to="/enterprise">Doanh nghiệp</Link> },
    { key: '2', label: <Link to="/small-business">Doanh nghiệp nhỏ</Link> },
  ]

  const integrationItems: MenuProps['items'] = [
    { key: '1', label: <Link to="/integrations">Tích hợp</Link> },
  ]

  const partnerItems: MenuProps['items'] = [
    { key: '1', label: <Link to="/partners">Đối tác</Link> },
  ]

  const whyChooseItems: MenuProps['items'] = [
    { key: '1', label: <Link to="/why-choose">Tại sao chọn chúng tôi</Link> },
  ]

  return (
    <header className="bitrix-header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <span className="logo-bitrix">Bitrix</span>
          <span className="logo-24">24</span>
          <span className="logo-registered">®</span>
        </Link>

        {/* Navigation Menu */}
        <nav className="header-nav">
          <Dropdown menu={{ items: productItems }} placement="bottomLeft">
            <a onClick={(e) => e.preventDefault()} className="nav-link">
              <Space>
                SẢN PHẨM
                <DownOutlined style={{ fontSize: '10px' }} />
              </Space>
            </a>
          </Dropdown>

          <Link to="/pricing" className="nav-link">
            GIÁ
          </Link>

          <Dropdown menu={{ items: resourceItems }} placement="bottomLeft">
            <a onClick={(e) => e.preventDefault()} className="nav-link">
              <Space>
                TÀI NGUYÊN
                <DownOutlined style={{ fontSize: '10px' }} />
              </Space>
            </a>
          </Dropdown>

          <Dropdown menu={{ items: solutionItems }} placement="bottomLeft">
            <a onClick={(e) => e.preventDefault()} className="nav-link">
              <Space>
                GIẢI PHÁP
                <DownOutlined style={{ fontSize: '10px' }} />
              </Space>
            </a>
          </Dropdown>

          <Dropdown menu={{ items: integrationItems }} placement="bottomLeft">
            <a onClick={(e) => e.preventDefault()} className="nav-link">
              <Space>
                TÍCH HỢP
                <DownOutlined style={{ fontSize: '10px' }} />
              </Space>
            </a>
          </Dropdown>

          <Dropdown menu={{ items: partnerItems }} placement="bottomLeft">
            <a onClick={(e) => e.preventDefault()} className="nav-link">
              <Space>
                ĐỐI TÁC
                <DownOutlined style={{ fontSize: '10px' }} />
              </Space>
            </a>
          </Dropdown>

          <Dropdown menu={{ items: whyChooseItems }} placement="bottomLeft">
            <a onClick={(e) => e.preventDefault()} className="nav-link">
              <Space>
                VÌ SAO CHỌN BITRIX24
                <DownOutlined style={{ fontSize: '10px' }} />
              </Space>
            </a>
          </Dropdown>
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
          <Button type="text" icon={<SearchOutlined />} className="search-btn" />

          <Button type="primary" size="large" className="start-btn">
            BẮT ĐẦU NGAY
          </Button>

          <Button
            icon={<UserOutlined />}
            className="login-btn"
            onClick={() => navigate(ROUTER.DANG_NHAP)}
          >
            ĐĂNG NHẬP
          </Button>

          <Dropdown
            menu={{
              items: [
                { key: 'vi', label: 'Tiếng Việt' },
                { key: 'en', label: 'English' },
              ],
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
