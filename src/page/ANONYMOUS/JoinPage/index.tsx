import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Spin, Result, Button } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import ROUTER from '~/routers'
import styles from './style.module.scss'
import STORAGE, { getStorage } from '~/libs/storage'

const AcceptInvite: React.FC = () => {
  const { inviteId } = useParams<{ inviteId: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const handleAcceptInvite = async () => {
      try {
        const apiUrl = window.env?.API_URL || import.meta.env.VITE_API_URL
        const token = getStorage(STORAGE.TOKEN)

        console.log('🔍 AcceptInvite - inviteId:', inviteId)
        console.log('🔍 AcceptInvite - token:', token ? 'exists' : 'null')
        console.log('🔍 AcceptInvite - apiUrl:', apiUrl)

        // Kiểm tra nếu chưa đăng nhập
        if (!token) {
          console.log('❌ No token, redirecting to login')
          // Lưu inviteId vào localStorage để xử lý sau khi đăng nhập
          localStorage.setItem('pendingInviteId', inviteId!)
          // Chuyển hướng đến trang đăng nhập
          navigate(ROUTER.DANG_NHAP)
          return
        }

        console.log('🚀 Calling API PATCH:', `${apiUrl}/home/invites/${inviteId}/accept`)
        const response = await fetch(`${apiUrl}/home/invites/${inviteId}/accept`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        console.log('📡 Response status:', response.status)

        // Nếu token hết hạn hoặc không hợp lệ (401 Unauthorized)
        if (response.status === 401) {
          console.log('❌ Token expired (401), redirecting to login')
          // Xóa token cũ
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          // Lưu inviteId để xử lý sau khi đăng nhập
          localStorage.setItem('pendingInviteId', inviteId!)
          // Chuyển hướng đến trang đăng nhập
          navigate(ROUTER.DANG_NHAP)
          return
        }

        if (!response.ok) {
          const errorData = await response.json()
          console.log('❌ API Error:', errorData)
          throw new Error(errorData.message || 'Link mời không hợp lệ hoặc đã hết hạn')
        }

        const data = await response.json()
        console.log('✅ Accept invite success:', data)
        console.log('📂 Project ID:', data.project?._id)
        setSuccess(true)

        // Xóa pendingInviteId sau khi join thành công
        localStorage.removeItem('pendingInviteId')

        // Redirect đến trang dự án sau 2 seconds
        setTimeout(() => {
          if (data.project && data.project._id) {
            console.log('🚀 Navigating to project:', `/du-an/${data.project._id}`)
            navigate(`/du-an/${data.project._id}`)
          } else {
            console.log('⚠️ No project ID, navigating to dashboard')
            navigate(ROUTER.BANG_DIEU_KHIEN)
          }
        }, 2000)
      } catch (err: any) {
        console.error('❌ Error in handleAcceptInvite:', err)
        setError(err.message || 'Có lỗi xảy ra khi chấp nhận lời mời')
      } finally {
        setLoading(false)
      }
    }

    if (inviteId) {
      handleAcceptInvite()
    } else {
      setError('Link mời không hợp lệ')
      setLoading(false)
    }
  }, [inviteId, navigate])

  if (loading) {
    return (
      <div className={styles.container}>
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
          tip="Đang xử lý lời mời..."
          size="large"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Result
          status="error"
          title="Không thể chấp nhận lời mời"
          subTitle={error}
          extra={[
            <Button type="primary" key="home" onClick={() => navigate(ROUTER.BANG_DIEU_KHIEN)}>
              Về trang chủ
            </Button>,
          ]}
        />
      </div>
    )
  }

  if (success) {
    return (
      <div className={styles.container}>
        <Result
          status="success"
          title="Chấp nhận lời mời thành công!"
          subTitle="Bạn đã được thêm vào dự án. Đang chuyển hướng đến dự án..."
        />
      </div>
    )
  }

  return null
}

export default AcceptInvite
