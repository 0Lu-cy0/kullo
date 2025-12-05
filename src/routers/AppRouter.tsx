import React from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import ROUTER from '.'
import HomePage from '../page/ANONYMOUS/HomePage'
import MainLayout from '../components/Layouts/MainLayout'
import NoHeaderLayout from '../components/Layouts/NoHeaderLayout'
import LayoutAdmin from '../components/Layouts/LayoutAdmin'
import LoginPage from '~/page/ANONYMOUS/LoginPage'
import ProtectedRoute from '~/components/Layouts/ProtectRouter'
import Board from '~/page/Boards/_id'
import Dashboard from '~/page/ADMIN/Dashboad'
import MemberPage from '~/page/ADMIN/Menber'
import AcceptInvite from '~/page/ANONYMOUS/JoinPage'
import ProfilePage from '~/page/ADMIN/Profile'
import ProfileView from '~/page/ADMIN/Profile/View'
import ProfileDetails from '~/page/ADMIN/Profile/_id'
import SettingsPage from '~/page/ADMIN/Settings'

const PublicRouters = React.lazy(() => import('../page/publicRouter'))
const NotFound = React.lazy(() => import('../page/NotFound/index'))

function LazyLoadingComponent({ children }: { children?: React.ReactNode }) {
  return (
    <React.Suspense
      fallback={
        <div className="loading-center" style={{ height: '100vh' }}>
          {/* <SpinCustom fullscreen /> */}
        </div>
      }
    >
      {children}
    </React.Suspense>
  )
}

const routes = [
  // ✅ Routes CÓ Header (dùng MainLayout với showHeader=true)
  {
    element: <MainLayout {...({ showHeader: true } as any)} />,
    children: [
      {
        path: '/',
        element: (
          <LazyLoadingComponent>
            <HomePage />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.TONG_QUAN,
        element: (
          <LazyLoadingComponent>
            <PublicRouters />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.THONG_TIN_TAI_KHOAN,
        element: (
          <LazyLoadingComponent>
            <PublicRouters />
          </LazyLoadingComponent>
        ),
      },
    ],
  },

  // ✅ Routes BẢO MẬT (cần đăng nhập) - Wrap với ProtectedRoute

  {
    element: (
      <ProtectedRoute>
        <MainLayout showHeader={false} />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTER.DU_AN,
        element: (
          <LazyLoadingComponent>
            <Board />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.THONG_TIN_TAI_KHOAN,
        element: (
          <LazyLoadingComponent>
            <PublicRouters />
          </LazyLoadingComponent>
        ),
      },
      {
        path: '/invites/:inviteId/accept',
        element: <AcceptInvite />,
      },
    ],
  },

  // ✅ Routes KHÔNG Header (dùng NoHeaderLayout)
  {
    element: <NoHeaderLayout />,
    children: [
      {
        path: ROUTER.DANG_NHAP,
        element: (
          <LazyLoadingComponent>
            <LoginPage isRegister={false} />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.DANG_KY,
        element: (
          <LazyLoadingComponent>
            <LoginPage isRegister={true} />
          </LazyLoadingComponent>
        ),
      },
    ],
  },

  // ✅ Routes ADMIN (dùng LayoutAdmin với Header và Sidebar)
  {
    element: (
      <ProtectedRoute>
        <LayoutAdmin />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTER.BANG_DIEU_KHIEN,
        element: (
          <LazyLoadingComponent>
            <Dashboard />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.THANH_VIEN,
        element: (
          <LazyLoadingComponent>
            <MemberPage />
          </LazyLoadingComponent>
        ),
      },
      {
        path: '/profile',
        element: (
          <LazyLoadingComponent>
            <ProfilePage />
          </LazyLoadingComponent>
        ),
      },
      {
        path: '/profile/view',
        element: (
          <LazyLoadingComponent>
            <ProfileView />
          </LazyLoadingComponent>
        ),
      },
      {
        path: '/profile/details',
        element: (
          <LazyLoadingComponent>
            <ProfileDetails />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.SETTINGS,
        element: (
          <LazyLoadingComponent>
            <SettingsPage />
          </LazyLoadingComponent>
        ),
      },
    ],
  },

  // ✅ NotFound — phải ở cuối cùng
  {
    path: '*',
    element: (
      <LazyLoadingComponent>
        <NotFound />
      </LazyLoadingComponent>
    ),
  },
]

const AppRouter = () => {
  const renderRouter = useRoutes(routes)
  return renderRouter
}

export default AppRouter
