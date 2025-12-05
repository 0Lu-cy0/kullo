import React from 'react'
import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import PostAddIcon from '@mui/icons-material/PostAdd'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import type { Columndata } from '~/types/api/column'
import { BoardService } from '~/services/BoardService'
import { message } from 'antd'
// removed unused Card import

function ListColumns({
  columns,
  projectId,
  onCardCreated,
  onAddColumn,
  onDeleteColumn,
  onUpdateColumn,
}: {
  columns: Columndata[]
  projectId: string
  onCardCreated?: () => void
  onAddColumn?: (column: Columndata) => void
  onDeleteColumn?: (columnId: string) => void
  onUpdateColumn?: (columnId: string, updatedColumn: Partial<Columndata>) => void
}) {
  return (
    <SortableContext
      items={columns.map((column) => column._id)}
      strategy={horizontalListSortingStrategy}
    >
      <Box
        sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': { m: 2 },
        }}
      >
        {/* Box column */}
        {columns?.map((column) => {
          return (
            <Column
              key={column._id}
              column={column}
              projectId={projectId}
              onCardCreated={onCardCreated}
              onDeleteColumn={onDeleteColumn}
              onUpdateColumn={onUpdateColumn}
            />
          )
        })}
        <Box sx={{ maxWidth: '350px', mx: 2 }}>
          <AddToColumnToggle projectId={projectId} onSuccess={onAddColumn} />
        </Box>
      </Box>
    </SortableContext>
  )
}

export default ListColumns

function AddToColumnToggle({
  projectId,
  onSuccess,
}: {
  projectId: string
  onSuccess?: (column: Columndata) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleCreateColumn = async (title: string) => {
    if (!title.trim()) {
      message.warning('Vui lòng nhập tên danh sách')
      return
    }

    try {
      setLoading(true)
      const res = await BoardService.createColumn(projectId, { title })
      if (res.isOk) {
        message.success('Tạo danh sách thành công!')
        setTitle('')
        setOpen(false)
        // Gọi callback với data column mới
        onSuccess?.(res.data)
      } else {
        message.error('Tạo danh sách thất bại')
      }
    } catch (error) {
      console.error(error)
      message.error('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      {!open ? (
        <Button
          startIcon={<PostAddIcon />}
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{ textTransform: 'none', width: '100%' }}
        >
          Add to column
        </Button>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <TextField
            placeholder="Nhập tên danh sách..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="small"
            variant="outlined"
            fullWidth
            InputProps={{ sx: { background: '#0b0c0d', color: '#fff' } }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: '#5aa1ff',
                color: '#072029',
                textTransform: 'none',
                flex: '0 0 120px',
                height: 48,
                whiteSpace: 'normal',
                lineHeight: 1.1,
                fontWeight: 600,
              }}
              onClick={() => handleCreateColumn(title)}
              disabled={loading}
            >
              {loading ? 'Đang tạo...' : 'Thêm danh sách'}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: '' }}></Box>

            <IconButton size="small" onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  )
}
