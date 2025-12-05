import React from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'

function Profile() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <Box>
      <Tooltip title="Cài đặt tài khoản">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{ width: 30, height: 30 }}
            alt="Nguyen Van Toan"
            src="https://scontent.fhan3-1.fna.fbcdn.net/v/t39.30808-6/508336249_4238153703084604_8544564191113776976_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=111&ccb=1-7&_nc_sid=aa7b47&_nc_eui2=AeFsTRDwyNWGBWB9hE5Dgj8WDPqlwudj7KMM-qXC52Pso8V9U2wNa2qrqyowABOuuJ4Hl7QJeTLZqjK1hOB9L65A&_nc_ohc=A3Ch5llTaAUQ7kNvwFEYj0O&_nc_oc=Adk034hwzpybwwv2C2AMakCAic6GSrvH5KBkKL9E-SS0LdDqYCKmRqFnGZoQu7JdOZ7INhbSPUdfn1W-VThOO0Ra&_nc_zt=23&_nc_ht=scontent.fhan3-1.fna&_nc_gid=drtGJIRwQxCgOCoi9PnHdg&oh=00_AfNTpFAjGZdkUouNV4TBqE_Ng_vdH_QK05Zpt5Xmp9JB3A&oe=6855B7E1"
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profile"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profile',
        }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar sx={{ width: '28px', height: '28px', mr: 2 }} /> Hồ sơ
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar sx={{ width: '28px', height: '28px', mr: 2 }} /> Tài khoản của tôi
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Thêm tài khoản khác
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Cài đặt
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Profile
