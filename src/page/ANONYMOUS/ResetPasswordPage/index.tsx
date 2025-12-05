import { Button, Col, Form, Input, Row, Typography, message } from 'antd'
import { Lock } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AuthService from '~/services/AuthService'
import ROUTER from '~/routers'
import { StyleLoginPage } from '../LoginPage/styled'

interface ResetPasswordForm {
  newPassword: string
  confirmPassword: string
}

const ResetPasswordPage = () => {
  const [form] = Form.useForm<ResetPasswordForm>()
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const resetToken = useMemo(() => searchParams.get('token') || '', [searchParams])

  useEffect(() => {
    if (!resetToken) {
      message.warning('Thiếu token đặt lại mật khẩu. Vui lòng yêu cầu lại liên kết mới.')
    }
  }, [resetToken])

  const handleSubmit = async (values: ResetPasswordForm) => {
    if (!resetToken) {
      message.error('Token không hợp lệ. Vui lòng thử lại.')
      return
    }

    try {
      setLoading(true)
      await AuthService.confirmPasswordReset({
        resetToken,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      })
      message.success('Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới.')
      navigate(ROUTER.DANG_NHAP)
    } catch (error) {
      const errorMessage =
        (error as any)?.response?.data?.message || 'Không thể đặt lại mật khẩu, vui lòng thử lại.'
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100vw', minHeight: '100vh', overflow: 'hidden' }}>
      <StyleLoginPage>
        <Row className="login-row">
          <Col xs={0} md={12} lg={14} className="left-side">
            <div className="curved-edge"></div>
            <div className="left-content">
              <h1 className="logo-text">KULLO</h1>
              <p className="description-text">
                Nhập mật khẩu mới cho tài khoản của bạn. Hãy đảm bảo mật khẩu đủ mạnh và không chia sẻ
                với người khác.
              </p>
            </div>
          </Col>

          <Col xs={24} md={12} lg={10} className="right-side">
            <div className="form-wrapper">
              <Typography.Title level={2} className="form-title">
                Tạo mật khẩu mới
              </Typography.Title>

              <Form layout="vertical" form={form} onFinish={handleSubmit} className="login-form">
                <Form.Item
                  label="Mật khẩu mới"
                  name="newPassword"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu mới.' },
                    { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự.' },
                    {
                      pattern: /^(?=.*[A-Za-z])(?=.*\d)/,
                      message: 'Mật khẩu phải chứa ít nhất một chữ cái và một số.'
                    }
                  ]}
                >
                  <Input.Password prefix={<Lock />} placeholder="********" size="large" />
                </Form.Item>

                <Form.Item
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  dependencies={['newPassword']}
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu.' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp.'))
                      }
                    })
                  ]}
                >
                  <Input.Password prefix={<Lock />} placeholder="********" size="large" />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  className="login-button"
                  disabled={!resetToken}
                >
                  Cập nhật mật khẩu
                </Button>

                <Button type="link" block onClick={() => navigate(ROUTER.QUEN_MAT_KHAU)}>
                  Gửi lại yêu cầu đặt lại mật khẩu
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </StyleLoginPage>
    </div>
  )
}

export default ResetPasswordPage
