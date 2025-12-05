import { App as AntdApp } from 'antd'
import { BrowserRouter } from 'react-router'
import ErrorBoundary from 'antd/es/alert/ErrorBoundary'
import AppRouter from './routers/AppRouter'
import GlobalThemeConfig from '../theme/GlobalThemeConfig'
import Providers from './components/Providers'

function App() {
  return (
    <Providers>
      <GlobalThemeConfig>
        <AntdApp>
          <BrowserRouter>
            <ErrorBoundary>
              <AppRouter />
            </ErrorBoundary>
          </BrowserRouter>
        </AntdApp>
      </GlobalThemeConfig>
    </Providers>
  )
}

export default App
