import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import ContentCut from '@mui/icons-material/ContentCut'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import AddCardIcon from '@mui/icons-material/AddCard'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import ListCards from './ListCards/ListCards'
import CreateCardModal from '~/components/CardModal/CreateCardModal'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { mapOrder } from '~/contants/sort'
import { trello } from '~/theme'
import type { Columndata } from '~/types/api/column'
import { BoardService } from '~/services/BoardService'
import { message } from 'antd'

function Column({
  column,
  projectId,
  onCardCreated,
  onDeleteColumn,
  onUpdateColumn,
}: {
  column: Columndata
  projectId: string
  onCardCreated?: () => void
  onDeleteColumn?: (columnId: string) => void
  onUpdateColumn?: (columnId: string, updatedColumn: Partial<Columndata>) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column?._id,
    data: { ...column },
  })

  const [openCreateCardModal, setOpenCreateCardModal] = useState(false)
  const [deleting, setDeleting] = useState(false) // Thêm state để track đang xóa
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(column?.title || '')
  const [updating, setUpdating] = useState(false)

  const handleOpenCreateCardModal = () => {
    setOpenCreateCardModal(true)
  }

  const handleCloseCreateCardModal = () => {
    setOpenCreateCardModal(false)
  }

  const handleCardCreatedSuccess = () => {
    onCardCreated?.()
  }

  const dntKitColumnStyle = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined,
  }

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const orderCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')

  // Filter out placeholder cards
  const validCards = orderCards?.filter((card) => !card.FE_Placeholder) || []

  const handleDeleteColumn = async () => {
    if (deleting) return

    try {
      setDeleting(true)

      // Optimistic update - xóa khỏi UI trước
      onDeleteColumn?.(column._id)
      handleClose()
      message.success('Xóa cột thành công')

      // Gọi API
      const res = await BoardService.deletedBoard(column._id)

      if (!res.isOk) {
        // Nếu API thất bại, rollback bằng cách refresh
        message.error('Lỗi khi xóa cột, đang khôi phục...')
        onCardCreated?.() // Refresh để rollback
      }
    } catch (error) {
      console.log(error)
      message.error('Có lỗi xảy ra khi xóa cột, đang khôi phục...')
      onCardCreated?.() // Refresh để rollback
    } finally {
      setDeleting(false)
    }
  }

  const handleStartEditTitle = () => {
    setEditedTitle(column?.title || '')
    setIsEditingTitle(true)
    handleClose()
  }

  const handleCancelEditTitle = () => {
    setEditedTitle(column?.title || '')
    setIsEditingTitle(false)
  }

  const handleSaveTitle = async () => {
    if (!editedTitle.trim() || editedTitle === column?.title) {
      handleCancelEditTitle()
      return
    }

    if (updating) return

    try {
      setUpdating(true)
      const res = await BoardService.updateBoard(column._id, { title: editedTitle.trim() })

      if (res.isOk) {
        onUpdateColumn?.(column._id, { title: editedTitle.trim() })
        message.success('Đổi tên cột thành công')
        setIsEditingTitle(false)
      } else {
        message.error('Lỗi khi đổi tên cột')
        setEditedTitle(column?.title || '')
      }
    } catch (error) {
      console.log(error)
      message.error('Có lỗi xảy ra khi đổi tên cột')
      setEditedTitle(column?.title || '')
    } finally {
      setUpdating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle()
    } else if (e.key === 'Escape') {
      handleCancelEditTitle()
    }
  }

  return (
    <div ref={setNodeRef} style={dntKitColumnStyle} {...attributes}>
      <Box
        sx={{
          minWidth: '310px',
          maxWidth: '310px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${trello.boardContentHeight} - ${theme.spacing(5)})`,
        }}
      >
        {/* Box column header */}
        <Box
          sx={{
            height: () => trello.ColumnHeaderHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {isEditingTitle ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
              <TextField
                autoFocus
                fullWidth
                size="small"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={updating}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '1rem',
                  },
                }}
              />
              <IconButton
                size="small"
                onClick={handleSaveTitle}
                disabled={updating}
                sx={{ color: 'success.main' }}
              >
                <CheckIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleCancelEditTitle}
                disabled={updating}
                sx={{ color: 'error.main' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Box
              {...listeners}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flex: 1,
                cursor: 'grab',
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>{column?.title}</Typography>
            </Box>
          )}
          <Box>
            <Tooltip title="Tùy chọn khác">
              <ExpandMoreIcon
                sx={{ color: 'text.primary', cursor: 'pointer' }}
                id="basic-button-column"
                aria-controls={open ? 'basic-menu-column' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu id="basic-menu-column" anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={handleStartEditTitle}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Đổi tên cột</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleDeleteColumn} disabled={deleting}>
                <ListItemIcon>
                  <DeleteForeverIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{deleting ? 'Đang xóa...' : 'Xóa cột này'}</ListItemText>
              </MenuItem>
              {/* <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Lưu trữ cột này</ListItemText>
              </MenuItem> */}
            </Menu>
          </Box>
        </Box>
        {/* Box list card */}
        {/* List Cards */}
        <ListCards
          cards={validCards}
          columnId={column?._id}
          projectId={projectId}
          onUpdate={onCardCreated}
        />
        {/* Box column footer */}
        <Box
          sx={{
            height: () => trello.ColumnFooterHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button startIcon={<AddCardIcon />} onClick={handleOpenCreateCardModal}>
            Thêm thẻ mới
          </Button>
          <Tooltip title="Di chuyển thẻ">
            <DragHandleIcon sx={{ cursor: 'pointer' }} />
          </Tooltip>
        </Box>
      </Box>

      <CreateCardModal
        open={openCreateCardModal}
        onClose={handleCloseCreateCardModal}
        columnId={column._id}
        projectId={projectId}
        onSuccess={handleCardCreatedSuccess}
      />
    </div>
  )
}

export default Column
