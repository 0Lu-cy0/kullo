import { Spin } from 'antd'
import styles from './index.module.scss'
import type { ReactNode } from 'react'

interface LoadingLayoutProps {
  loading: boolean
  children: ReactNode
  tip?: string
}

const LoadingLayout = ({ loading, children, tip = '' }: LoadingLayoutProps) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Spin spinning={loading} tip={tip} size="large" wrapperClassName={styles.spinWrapper}>
        {children}
      </Spin>
    </div>
  )
}

export default LoadingLayout
