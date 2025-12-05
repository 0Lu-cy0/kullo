import styled from 'styled-components'

export const StyleLoginPage = styled.div`
  min-height: 100vh;

  .login-row {
    min-height: 100vh;
    margin: 0 !important;
  }

  // Left Side - Gradient Background
  .left-side {
    background: linear-gradient(135deg, #e878b4 0%, #a47cd4 50%, #7e8ee6 100%);
    padding: 80px 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: visible;

    &::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 100%;
      height: 150%;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      transform: rotate(-15deg);
    }
  }

  .curved-edge {
    position: absolute;
    top: 0;
    right: -50px;
    width: 100px;
    height: 100%;
    background: linear-gradient(135deg, #e878b4 0%, #a47cd4 50%, #7e8ee6 100%);
    border-radius: 0 0 0 50%;
    z-index: 2;

    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: white;
      border-radius: 50% 0 0 50%;
    }
  }

  .left-content {
    position: relative;
    z-index: 1;
    color: white;
    max-width: 500px;
  }

  .logo-text {
    font-size: 72px;
    font-weight: 700;
    margin-bottom: 30px;
    color: white;
    letter-spacing: 2px;
  }

  .description-text {
    font-size: 16px;
    line-height: 1.8;
    margin-bottom: 50px;
    color: rgba(255, 255, 255, 0.95);
  }

  .social-icons {
    display: flex;
    gap: 15px;
  }

  .social-icon {
    width: 45px;
    height: 45px;
    border: 2px solid white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: white;
      color: #a47cd4;
    }
  }

  // Right Side - Form
  .right-side {
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }

  .form-wrapper {
    width: 100%;
    max-width: 450px;
  }

  .form-title {
    font-size: 28px;
    font-weight: 600;
    color: #333;
    margin-bottom: 40px;
    text-align: left;
  }

  .login-form {
    .ant-input,
    .ant-input-password {
      border-radius: 4px;
      background-color: white
      padding: 6px 15px;

      &:focus {
        border-color: #ff6b9d;
        box-shadow: 0 0 0 2px rgba(255, 107, 157, 0.1);
        background-color: white;
      }
    }

    .input-icon {
      color: #999;
      margin-right: 8px;
    }
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .ant-checkbox-wrapper {
      color: #666;
    }
  }

  .forgot-link {
    color: #666;
    text-decoration: none;

    &:hover {
      color: #ff6b9d;
    }
  }

  .login-button {
    background: linear-gradient(135deg, #ff6b9d 0%, #ff8fa3 100%);
    border: none;
    height: 50px;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 1px;
    border-radius: 4px;
    margin-bottom: 30px;

    &:hover {
      background: linear-gradient(135deg, #ff5a8c 0%, #ff7e92 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 107, 157, 0.3);
    }
  }

  .signup-section {
    text-align: center;
    margin-top: 30px;

    p {
      color: #666;
      margin-bottom: 15px;
      font-size: 14px;
    }
  }

  .signup-buttons {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
  }

  .signup-btn {
    flex: 1;
    min-width: 180px;
    height: 45px;
    font-size: 13px;
    font-weight: 600;
    border-radius: 4px;
    border: none;

    &.individual {
      background: linear-gradient(135deg, #a855f7 0%, #c084fc 100%);
      color: white;

      &:hover {
        background: linear-gradient(135deg, #9333ea 0%, #a855f7 100%);
        color: white;
      }
    }

    &.corporate {
      background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
      color: white;

      &:hover {
        background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
        color: white;
      }
    }
  }

  // Responsive
  @media (max-width: 768px) {
    .left-side {
      display: none;
      clip-path: polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%);
    }

    .right-side {
      padding: 20px;
    }

    .signup-buttons {
      flex-direction: column;

      .signup-btn {
        width: 100%;
      }
    }
  }
`
