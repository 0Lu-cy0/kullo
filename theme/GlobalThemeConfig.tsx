// App.tsx
import { ConfigProvider, theme as antdTheme } from 'antd'
import React, { useContext } from 'react'
import { StoreContext } from '../src/libs/store'
// import ThemeConfigAntd from "./ThemeConfigAntd"

function GlobalThemeConfig({ children }: { children: React.ReactNode }) {
  const store = useContext(StoreContext)
  const themeStore = store?.themeStore || {}
  const { isDarkMode } = themeStore
  const ColorPrimary = '#fa8c16'
  const ColorDefault = '#ffffff'
  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorInfo: ColorPrimary,
          colorPrimary: ColorPrimary,
          fontSize: 16,
          fontFamily: `"Inter", Helvetica, sans-serif`,
          colorBgBase: isDarkMode ? '#252525' : ColorDefault,
          colorIcon: isDarkMode ? ColorDefault : '#000',
        },
        components: {
          Button: {
            defaultBg: ColorDefault,
            borderRadius: 4,
            borderRadiusLG: 4,
            lineWidth: 2,
            lineWidthFocus: 3,
          },
          Table: {
            headerColor: ColorDefault,
            headerBg: ColorPrimary,
            cellPaddingInline: 12,
            cellPaddingBlock: 8,
            headerBorderRadius: 4,
            borderRadius: 4,
            fontSize: 14,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export default GlobalThemeConfig
