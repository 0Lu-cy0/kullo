import { Button, Layout, Menu, Typography } from 'antd'
import {
  AppstoreOutlined,
  LayoutOutlined,
  StarOutlined,
  SettingOutlined,
  UserAddOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import styles from './styles.module.scss'
import CreateProjectModal from './CreatModal'
import ROUTER from '~/routers'
import ProjectSearch from './ProjectSearch'

const { Sider, Content, Header } = Layout
const { Text } = Typography

type LayoutStyles = typeof styles

const LayoutAdmin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()
  const workspaceMenuItems = [
    {
      key: 'workspace-boards',
      icon: <AppstoreOutlined />,
      label: 'Bảng',
      router: ROUTER.BANG_DIEU_KHIEN
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ',
      router: ROUTER.PROFILE + '/view'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
      router: ROUTER.SETTINGS
    }
  ]

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleSubmit = async (values: any) => {
    // TODO: Call API to create project with values
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const handleMenuClick = (e: any) => {
    const menuItem = workspaceMenuItems.find((item) => item.key === e.key)
    if (menuItem && menuItem.router) {
      navigate(menuItem.router)
    }
  }

  return (
    <Layout className={styles.adminLayout}>
      {/* Header */}
      <Header className={styles.adminHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>K</div>
              <Text className={styles.logoText}>Kullo</Text>
            </div>
          </div>
          <div className={styles.headerCenter}>
            <ProjectSearch />
            <Button type="primary" className={styles.createBtn} onClick={showModal}>
              Tạo mới
            </Button>
          </div>
          <div></div>
        </div>
      </Header>

      <Layout>
        {/* Sidebar */}
        <Sider width={250} className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <div className={styles.workspaceSection}>
              <Text className={styles.sectionTitle}>Các Không gian làm việc</Text>
              <div className={styles.workspaceItem}>
                <div className={styles.workspaceHeader}>
                  <div className={styles.workspaceIcon}>K</div>
                  <Text className={styles.workspaceName}>Kullo Không gian làm việc</Text>
                </div>
                <Menu
                  mode="inline"
                  items={workspaceMenuItems}
                  className={styles.workspaceMenu}
                  onClick={handleMenuClick}
                />
              </div>
            </div>
          </div>
        </Sider>

        {/* Main Content */}
        <Content className={styles.mainContent}>
          <Outlet />
        </Content>
      </Layout>

      {/* Create Project Modal */}
      <CreateProjectModal open={isModalOpen} onCancel={handleCancel} onSubmit={handleSubmit} />
    </Layout>
  )
}

export default LayoutAdmin
