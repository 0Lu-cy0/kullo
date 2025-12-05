import type React from 'react'

const LayoutCommon = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-[calc(100vh-58px)] max-h-[calc(100vh-58px)] pb-4">{children}</div>
}

export default LayoutCommon
