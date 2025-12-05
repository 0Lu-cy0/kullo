import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Check from '@mui/icons-material/Check'

function Template() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <Box>
      <Button
        id="basic-button-template"
        aria-controls={open ? 'basic-menu-template' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
        sx={{ color: 'white' }}
      >
        MẪU
      </Button>
      <Menu
        id="basic-menu-template"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-template',
        }}
      >
        <MenuItem>
          <ListItemText inset>Giãn dòng đơn</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText inset>Giãn dòng 1.15</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText inset>Giãn dòng đôi</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Check />
          </ListItemIcon>
          Tùy chỉnh: 1.2
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemText>Thêm khoảng cách trước đoạn</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText>Thêm khoảng cách sau đoạn</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemText>Thiết lập khoảng cách tùy chỉnh...</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Template
