import { Outlet } from 'react-router-dom'

const NoHeaderLayout = () => {
  return (
    <main>
      <Outlet />
    </main>
  )
}

export default NoHeaderLayout
