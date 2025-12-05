import { Outlet } from 'react-router-dom'
import MainLayout from '~/components/Layouts/MainLayout'

function PublicRoutes() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}
export default PublicRoutes
