import React, { useState, useMemo } from 'react'

export const StoreContext = React.createContext<any>(null)

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState({})
  const [spvObj, setSpvObj] = useState({})
  const [ucObj, setUcObj] = useState({})
  const [collapsed, setCollapsed] = useState(false)
  const [listTab, setListTab] = useState(null)
  const [tabSelect, setTabSelect] = useState(null)
  const [routerBeforeLogin, setRouterBeforeLogin] = useState()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoginContext, setIsLoginContext] = useState(false)

  const store = useMemo(
    () => ({
      tabStore: [tabSelect, setTabSelect],
      userStore: [user, setUser],
      spvStore: [spvObj, setSpvObj],
      ucStore: [ucObj, setUcObj],
      collapsedStore: [collapsed, setCollapsed],
      listTabStore: [listTab, setListTab],
      routerStore: [routerBeforeLogin, setRouterBeforeLogin],
      themeStore: { isDarkMode, setIsDarkMode },
      loginStore: { isLoginContext, setIsLoginContext },
    }),
    [
      tabSelect,
      user,
      spvObj,
      ucObj,
      collapsed,
      listTab,
      routerBeforeLogin,
      isDarkMode,
      isLoginContext,
    ]
  )

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}
