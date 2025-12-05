import React, { useState } from 'react'
import {
  Box,
  IconButton,
  Popover,
  Typography,
  Divider,
  Checkbox,
  Chip,
  Button,
  Stack,
  TextField
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import FilterListOffIcon from '@mui/icons-material/FilterListOff'
import { useSearch } from '~/contexts/SearchContext'
import { alpha } from '@mui/material/styles'

const statusOptions = [
  { value: 'todo', label: 'Cần làm', color: '#64748b' },
  { value: 'in_progress', label: 'Đang làm', color: '#f59e0b' },
  { value: 'testing', label: 'Đang test', color: '#8b5cf6' },
  { value: 'completed', label: 'Hoàn thành', color: '#10b981' }
]

const priorityOptions = [
  { value: 'low', label: 'Thấp', color: '#10b981' },
  { value: 'medium', label: 'Trung bình', color: '#f59e0b' },
  { value: 'high', label: 'Cao', color: '#ef4444' }
]

function FilterBar() {
  const {
    filterOptions,
    setFilterOptions,
    resetFilters
  } = useSearch()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  const handleToggleStatus = (status: string) => {
    const currentStatuses = filterOptions.statusFilter
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter((s) => s !== status)
      : [...currentStatuses, status]

    setFilterOptions({
      ...filterOptions,
      statusFilter: newStatuses
    })
  }

  const handleReset = () => {
    resetFilters()
  }

  const dueDateActive = Boolean(filterOptions.dueDateBefore)

  const activeFilterCount =
    (filterOptions.hideEmptyColumns ? 1 : 0) +
    filterOptions.statusFilter.length +
    filterOptions.priorityFilter.length +
    (dueDateActive ? 1 : 0)

  const hasActiveFilters = activeFilterCount > 0

  const handleTogglePriority = (priority: string) => {
    const currentPriorities = filterOptions.priorityFilter
    const newPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter((p) => p !== priority)
      : [...currentPriorities, priority]

    setFilterOptions({
      ...filterOptions,
      priorityFilter: newPriorities
    })
  }

  const handleDueDateChange = (value: string) => {
    setFilterOptions({
      ...filterOptions,
      dueDateBefore: value || null
    })
  }

  const handleClearDates = () => {
    setFilterOptions({
      ...filterOptions,
      dueDateBefore: null
    })
  }

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        sx={{
          color: hasActiveFilters ? '#667eea' : 'white',
          bgcolor: hasActiveFilters ? alpha('#667eea', 0.2) : 'transparent',
          '&:hover': {
            bgcolor: hasActiveFilters ? alpha('#667eea', 0.3) : alpha('#fff', 0.1)
          },
          position: 'relative'
        }}
      >
        {hasActiveFilters ? <FilterListIcon /> : <FilterListOffIcon />}
        {activeFilterCount > 0 && (
          <Chip
            label={activeFilterCount}
            size="small"
            sx={{
              position: 'absolute',
              top: 2,
              right: 2,
              height: 16,
              minWidth: 16,
              fontSize: '0.65rem',
              bgcolor: '#ef4444',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        )}
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        PaperProps={{
          sx: {
            width: 320,
            p: 2,
            mt: 1,
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Bộ lọc
          </Typography>
          {hasActiveFilters && (
            <Button size="small" onClick={handleReset} color="error">
              Đặt lại
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5 }}>
          Lọc theo trạng thái
        </Typography>

        <Stack spacing={1}>
          {statusOptions.map((status) => {
            const isChecked = filterOptions.statusFilter.includes(status.value)
            return (
              <Box
                key={status.value}
                onClick={() => handleToggleStatus(status.value)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1,
                  borderRadius: 1,
                  cursor: 'pointer',
                  bgcolor: isChecked ? alpha(status.color, 0.1) : 'transparent',
                  border: isChecked ? `2px solid ${status.color}` : '1px solid transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: alpha(status.color, 0.15),
                    border: `1px solid ${alpha(status.color, 0.5)}`
                  }
                }}
              >
                <Checkbox
                  checked={isChecked}
                  sx={{
                    color: status.color,
                    '&.Mui-checked': {
                      color: status.color
                    }
                  }}
                />
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: status.color,
                    mr: 1
                  }}
                />
                <Typography variant="body2" fontWeight={isChecked ? 600 : 400}>
                  {status.label}
                </Typography>
              </Box>
            )
          })}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5 }}>
          Lọc theo mức độ ưu tiên
        </Typography>

        <Stack spacing={1} sx={{ mb: 1 }}>
          {priorityOptions.map((priority) => {
            const isChecked = filterOptions.priorityFilter.includes(priority.value)
            return (
              <Box
                key={priority.value}
                onClick={() => handleTogglePriority(priority.value)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1,
                  borderRadius: 1,
                  cursor: 'pointer',
                  bgcolor: isChecked ? alpha(priority.color, 0.1) : 'transparent',
                  border: isChecked ? `2px solid ${priority.color}` : '1px solid transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: alpha(priority.color, 0.15),
                    border: `1px solid ${alpha(priority.color, 0.5)}`
                  }
                }}
              >
                <Checkbox
                  checked={isChecked}
                  sx={{
                    color: priority.color,
                    '&.Mui-checked': {
                      color: priority.color
                    }
                  }}
                />
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: priority.color,
                    mr: 1
                  }}
                />
                <Typography variant="body2" fontWeight={isChecked ? 600 : 400}>
                  {priority.label}
                </Typography>
              </Box>
            )
          })}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            Lọc theo hạn chót
          </Typography>
          {dueDateActive && (
            <Button size="small" color="inherit" onClick={handleClearDates}>
              Xóa
            </Button>
          )}
        </Box>

        <TextField
          label="Trước ngày"
          type="date"
          size="small"
          value={filterOptions.dueDateBefore || ''}
          onChange={(event) => handleDueDateChange(event.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      </Popover>
    </Box>
  )
}

export default FilterBar
