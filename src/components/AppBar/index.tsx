import Box from '@mui/material/Box'
import AppsIcon from '@mui/icons-material/Apps'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { Tooltip } from '@mui/material'
import Profile from './Menus/profile'
import Notifications from './Menus/Notifications'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import ModeSelect from '../ModeSelect'
import SearchBar from './SearchBar'
import FilterBar from './FilterBar'
import { trello } from '~/theme'
import { useNavigate } from 'react-router-dom'
import ROUTER from '~/routers'

function AppBar() {
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        height: (theme) => trello.AppBarHeight,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowY: 'visible',
        overflowX: 'visible',
        paddingX: 2,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#0984e3'),
        position: 'relative',
        zIndex: 10000,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AppsIcon sx={{ color: 'white' }} />
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
          onClick={() => navigate(ROUTER.BANG_DIEU_KHIEN)}
        >
          <SvgIcon inheritViewBox sx={{ color: 'white' }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
            KULLO
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}></Box>
          <Button
            sx={{
              color: 'white',
              border: 'none',
              '&:hover': { border: 'none' },
            }}
            variant="outlined"
            endIcon={<AddToPhotosIcon />}
          >
            TẠO MỚI
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <SearchBar />
        <FilterBar />
        <ModeSelect />

        <Notifications />

        <Tooltip title="Trợ giúp">
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white' }} />
        </Tooltip>

        <Profile />
      </Box>
    </Box>
  )
}

export default AppBar
