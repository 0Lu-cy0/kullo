import { Outlet } from 'react-router-dom'
import Header from '~/components/Header'

interface MainLayoutProps {
  showHeader?: boolean
}

const MainLayout = ({ showHeader = true }: MainLayoutProps) => {
  return (
    <div style={{ minHeight: '100vh', width: '100%' }}>
      {showHeader && <Header />}
      <main style={{ width: '100%' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
