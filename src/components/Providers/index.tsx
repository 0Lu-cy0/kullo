import { Provider } from 'react-redux'

import { store } from '../../redux/store'
import { ThemeProvider } from 'styled-components'
import StoreProvider from '~/libs/store'
import { ThemeStyledComponent } from '../../../theme/ThemeStyledComponent'
import { SearchProvider } from '~/contexts/SearchContext'

const Providers = (props: any) => {
  return (
    <ThemeProvider theme={ThemeStyledComponent}>
      <Provider store={store}>
        <StoreProvider>
          <SearchProvider>{props.children}</SearchProvider>
        </StoreProvider>
      </Provider>
    </ThemeProvider>
  )
}
export default Providers
