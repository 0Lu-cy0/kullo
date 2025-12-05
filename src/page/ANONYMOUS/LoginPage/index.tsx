import { Button, Checkbox, Col, Form, Input, message, Row } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import STORAGE, { getStorage, setStorage } from '~/libs/storage'

// import { ACCOUNT_TYPE_ADMIN, ACCOUNT_TYPE_DAI_DIEN, ACCOUNT_TYPE_KH } from 'src/constants/constants'
// import roleService from 'src/services/RoleService'

import { StyleLoginPage } from './styled'
import { setUserInfo } from '~/redux/slices/appGlobal.slide'
import AuthService from '~/services/AuthService'
import { StoreContext } from '~/libs/store'
import { Lock, User, User2 } from 'lucide-react'
import ROUTER from '~/routers'

const LoginPage = ({ isRegister }: { isRegister: boolean }) => {
  const isLogin = getStorage(STORAGE.TOKEN)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const userInfo = getStorage(STORAGE.USER_INFO)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const store: any = useContext(StoreContext)
  const [routerBeforeLogin, setRouterBeforeLogin] = store?.routerStore || [undefined, () => { }]

  // useEffect(() => {
  //   if (isLogin) {
  //     loginSuccsess(userInfo)
  //   }
  // }, [])

  const onLogin = async () => {
    try {
      setLoading(true)
      const res = await AuthService.login({ ...form.getFieldsValue() })
      console.log('✅ Login response Status:', res?.Status)

      if (res?.Status === 200) {
        console.log('💾 Saving token and user info...')
        setStorage(STORAGE.TOKEN, res?.data?.accessToken)
        setStorage(STORAGE.USER_INFO, res?.data?._id)
        dispatch(setUserInfo(res?.data?._id))
        setRouterBeforeLogin(undefined)

        // Kiểm tra nếu có pendingInviteId thì chuyển đến trang accept invite
        const pendingInviteId = localStorage.getItem('pendingInviteId')
        console.log('🔍 pendingInviteId:', pendingInviteId)

        if (pendingInviteId) {
          console.log('🚀 Navigating to invite page:', `/invites/${pendingInviteId}/accept`)
          navigate(`/invites/${pendingInviteId}/accept`, { replace: true })
        } else if (routerBeforeLogin) {
          console.log('🚀 Navigating to routerBeforeLogin:', routerBeforeLogin)
          navigate(routerBeforeLogin, { replace: true })
        } else {
          console.log('🚀 Navigating to dashboard:', ROUTER.BANG_DIEU_KHIEN)
          navigate(ROUTER.BANG_DIEU_KHIEN, { replace: true })
        }
      } else if (res?.Status === 422) {
        message.error(res?.message)
      }
    } catch (error) {
      console.error('❌ Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  const onRegister = async () => {
    try {
      setLoading(true)
      const res = await AuthService.register({ ...form.getFieldsValue() })
      if (res?.Status === 201) {
        message.success('Đăng ký thành công')
        navigate(ROUTER.DANG_NHAP)
      } else {
        message.error(res?.message)
      }
    } catch (error) {
      console.error('Register error:', error)
      message.error('Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <StyleLoginPage>
        <Row className="login-row">
          {/* Left Side - Logo & Description */}
          <Col xs={0} md={12} lg={14} className="left-side">
            <div className="curved-edge"></div>
            <div className="left-content">
              <h1 className="logo-text">KULLO</h1>
              <p className="description-text">Ứng dụng quản lý dự án chuyên nghiệp.</p>
              <div className="social-icons">
                <div className="social-icon">f</div>
                <div className="social-icon">t</div>
                <div className="social-icon">in</div>
                <div className="social-icon">in</div>
              </div>
            </div>
          </Col>

          {/* Right Side - Login Form */}
          <Col xs={24} md={12} lg={10} className="right-side">
            <div className="form-wrapper">
              <h2 className="form-title"> {isRegister ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP'}</h2>
              <Form
                form={form}
                layout="vertical"
                className="login-form"
                onFinish={isRegister ? onRegister : onLogin}
              >
                {isRegister && (
                  <Form.Item
                    name="full_name"
                    rules={[
                      {
                        required: true,
                        message: 'Thông tin không được để trống!',
                      },
                    ]}
                  >
                    <Input prefix={<User2 />} placeholder="Tên người dùng" size="large" />
                  </Form.Item>
                )}
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Thông tin không được để trống!',
                    },
                  ]}
                >
                  <Input prefix={<User2 />} placeholder="nhap-email@domain.com" size="large" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Bạn chưa nhập mật khẩu!',
                    },
                    {
                      min: 8,
                      message: 'Mật khẩu phải có ít nhất 8 ký tự',
                    },
                    {
                      pattern: /^(?=.*[A-Za-z])(?=.*\d)/,
                      message: 'Mật khẩu phải chứa ít nhất một chữ cái và một số',
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<Lock />}
                    placeholder="Mật khẩu"
                    size="large"
                    className=""
                  />
                </Form.Item>
                <Form.Item>
                  <div className="form-options">
                    <Checkbox
                      onChange={(val) =>
                        localStorage.setItem(
                          STORAGE.REMEMBER_LOGIN,
                          JSON.stringify(val.target.checked)
                        )
                      }
                    >
                      Ghi nhớ đăng nhập?
                    </Checkbox>
                    <a href="#" className="forgot-link">
                      Quên mật khẩu?
                    </a>
                  </div>
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  block
                  className="login-button"
                >
                  {isRegister ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP'}
                </Button>
                <div className="signup-section">
                  <p> {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}</p>
                  <div className="signup-buttons">
                    <Button
                      className="signup-btn individual"
                      onClick={
                        isRegister
                          ? () => navigate(ROUTER.DANG_NHAP)
                          : () => navigate(ROUTER.DANG_KY)
                      }
                    >
                      {isRegister ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ'}
                    </Button>
                    <Button className="signup-btn corporate">TÀI KHOẢN DOANH NGHIỆP</Button>
                  </div>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </StyleLoginPage>
    </div>
  )
}

export default LoginPage
