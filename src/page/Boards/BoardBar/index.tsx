import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { Tabs } from 'antd'
import DashboardIcon from '@mui/icons-material/Dashboard'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import FilterListIcon from '@mui/icons-material/FilterList'
import PublicIcon from '@mui/icons-material/Public'
import { trello } from '~/theme'
import React, { useState } from 'react'
import type { BoardData } from '../_id'
import { ListIcon, User2Icon } from 'lucide-react'
import Summary from '../BoardContent/Summary'
import LayoutCommon from '~/components/Layouts/LayoutAdmin/LayoutCommon'
import MemberPage from '~/page/ADMIN/Menber'
import InviteMemberModal from '~/components/InviteMemberModal'

function BoardBar({
  board,
  boardContent
}: {
  board: BoardData | null
  boardContent: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const hanldOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const tabItems = [
    {
      key: '1',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
          <PublicIcon fontSize="small" />
          Tổng quan
        </span>
      ),
      children: <Summary />
    },
    {
      key: '2',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
          <DashboardIcon fontSize="small" />
          {board?.name}
        </span>
      ),
      children: boardContent
    },
    {
      key: '3',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
          <ListIcon />
          Danh sách
        </span>
      ),
      children: 'Nội dung thẻ số 3'
    },
    {
      key: '4',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
          <CalendarMonthIcon fontSize="small" />
          Lịch
        </span>
      ),
      children: 'Nội dung thẻ số 4'
    },
    {
      key: '5',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
          <User2Icon fontSize="small" />
          Thành viên
        </span>
      ),
      children: <MemberPage />
    }
  ]

  return (
    <LayoutCommon>
      <Box
        px={2}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          overflowX: 'auto',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#2980b9')
        }}
      >
        <Tabs
          items={tabItems}
          style={{
            color: 'white',
            width: '100%'
          }}
          tabBarStyle={{
            marginBottom: 0,
            borderBottom: 'none'
          }}
          tabBarExtraContent={
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<PersonAddIcon />}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'transparent'
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'white'
                  }
                }}
                onClick={hanldOpen}
              >
                Mời
              </Button>

              {/* <AvatarGroup
                total={20}
                sx={{
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    fontSize: 14,
                    border: 'none',
                    color: 'white',
                  },
                }}
              >
                <Tooltip title="vantoan">
                  <Avatar alt="Remy Sharp" src="" />
                </Tooltip>
                <Tooltip title="vantoan">
                  <Avatar alt="Remy Sharp" src="" />
                </Tooltip>
                <Tooltip title="vantoan">
                  <Avatar alt="Remy Sharp" src="" />
                </Tooltip>
                <Tooltip title="vantoan">
                  <Avatar alt="Remy Sharp" src="" />
                </Tooltip>
              </AvatarGroup> */}
            </Box>
          }
        />

        <InviteMemberModal open={isOpen} onCancel={handleClose} projectId={board?._id} />
      </Box>
    </LayoutCommon>
  )
}

export default BoardBar
