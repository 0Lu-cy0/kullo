import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
import ROUTER from '~/routers'

const NotFoundPage = () => {
  const navigate = useNavigate()
  return (
    <Result
      status="403"
      title="403"
      subTitle="Rất tiếc, bạn không có quyền truy cập trang này."
      extra={
        <Button type="primary" onClick={() => navigate(ROUTER.BANG_DIEU_KHIEN)}>
          Về trang chủ
        </Button>
      }
    />
  )
}

export default NotFoundPage
