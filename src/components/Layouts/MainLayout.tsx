import { Layout } from 'antd'
import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from '../Header'
import STORAGE, { getStorage, setStorage } from '~/libs/storage'

const { Content } = Layout

const layoutStyle = {
  minHeight: '100vh',
  overflow: 'hidden',
  display: 'block',
}

interface MainLayoutProps {
  showHeader?: boolean
  type?: string
  children?: React.ReactNode
}

const MainLayout = ({ showHeader = true, type, children }: MainLayoutProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [selectedKey, setSelectedKey] = useState(getStorage(STORAGE.KEY_MENU_ACTIVE) || ['/'])
  const isLogin = getStorage(STORAGE.TOKEN)

  const onClickMenu = (menu: any) => {
    setStorage(STORAGE.KEY_MENU_ACTIVE, menu.keyPath)
    setSelectedKey(menu.key.keyPath)
    if (!menu.key.includes('subkey')) navigate(menu.key)
  }

  const getLayout = () => {
    switch (type) {
      case 'isAdmin':
        return <div>admin</div>
      case 'isUser':
        return <div>user</div>
      default:
        // ✅ Render Outlet để hiển thị children routes
        return (
          <div className="w-100 body-cl">
            <Outlet />
            {children}
          </div>
        )
    }
  }

  useEffect(() => {
    const key = location?.pathname
    setSelectedKey([key])
  }, [location])

  return (
    <Layout style={layoutStyle}>
      {/* ✅ Hiển thị Header nếu showHeader = true */}
      {showHeader && <Header />}

      <Layout style={{ minWidth: '100vw' }}>
        <Content className="site-layout-background">{getLayout()}</Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
