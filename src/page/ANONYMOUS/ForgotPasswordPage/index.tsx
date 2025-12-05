import { Button, Col, Form, Input, Row, Typography, message } from 'antd'
import { Mail } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthService from '~/services/AuthService'
import ROUTER from '~/routers'
import { StyleLoginPage } from '../LoginPage/styled'

const ForgotPasswordPage = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async ({ email }: { email: string }) => {
    try {
      setLoading(true)
      await AuthService.requestPasswordReset({ email })
      message.success('Đã gửi liên kết đặt lại mật khẩu. Vui lòng kiểm tra email của bạn!')
      setEmailSent(true)
    } catch (error) {
      const errorMessage =
        (error as any)?.response?.data?.message || 'Không thể gửi yêu cầu, vui lòng thử lại.'
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
                Đừng lo! Nhập email tài khoản và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu cho bạn.
              </p>
            </div>
          </Col>

          <Col xs={24} md={12} lg={10} className="right-side">
            <div className="form-wrapper">
              <Typography.Title level={2} className="form-title">
                Lấy lại mật khẩu
              </Typography.Title>

              {emailSent ? (
                <div className="signup-section" style={{ textAlign: 'left' }}>
                  <Typography.Paragraph>
                    Liên kết đặt lại đã được gửi tới địa chỉ email của bạn. Kiểm tra hộp thư hoặc mục
                    spam và làm theo hướng dẫn.
                  </Typography.Paragraph>
                  <Button type="primary" block onClick={() => navigate(ROUTER.DANG_NHAP)}>
                    Quay lại đăng nhập
                  </Button>
                </div>
              ) : (
                <Form layout="vertical" form={form} onFinish={handleSubmit} className="login-form">
                  <Form.Item
                    label="Email đăng ký"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập email đã đăng ký.'
                      },
                      {
                        type: 'email',
                        message: 'Email không hợp lệ.'
                      }
                    ]}
                  >
                    <Input prefix={<Mail />} placeholder="name@company.com" size="large" />
                  </Form.Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    size="large"
                    className="login-button"
                  >
                    Gửi liên kết đặt lại
                  </Button>

                  <Button type="link" block onClick={() => navigate(ROUTER.DANG_NHAP)}>
                    Quay lại đăng nhập
                  </Button>
                </Form>
              )}
            </div>
          </Col>
        </Row>
      </StyleLoginPage>
    </div>
  )
}

export default ForgotPasswordPage
