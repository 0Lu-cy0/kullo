import React, { useState, useEffect, useRef } from 'react'
import TextField from '@mui/material/TextField'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import FolderIcon from '@mui/icons-material/Folder'
import TaskIcon from '@mui/icons-material/Task'
import PersonIcon from '@mui/icons-material/Person'
import { useSearch } from '~/contexts/SearchContext'
import { useNavigate, useMatch } from 'react-router-dom'
import { debounce } from 'lodash'

function SearchBar() {
  const {
    isSearching,
    searchResults,
    performSearch,
    clearSearch,
    boardSearchQuery,
    setBoardSearchQuery,
    clearBoardSearch
  } = useSearch()
  const [inputValue, setInputValue] = useState('')
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const boardMatch = useMatch('/du-an/:id')
  const activeBoardId = boardMatch?.params?.id || ''
  const isBoardPage = Boolean(activeBoardId)

  const debouncedSearch = useRef(
    debounce((query: string) => {
      performSearch(query)
    }, 500)
  ).current

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    if (isBoardPage) {
      setShowResults(false)
      setBoardSearchQuery(value)
      if (!value.trim()) {
        clearBoardSearch()
      }
      return
    }
    setShowResults(true)
    debouncedSearch(value)
  }

  const handleClearSearch = () => {
    setInputValue('')
    if (isBoardPage) {
      clearBoardSearch()
    } else {
      clearSearch()
      setShowResults(false)
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      setShowResults(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const hasResults =
    searchResults &&
    ((searchResults.projects?.length || 0) > 0 ||
      (searchResults.tasks?.length || 0) > 0 ||
      (searchResults.users?.length || 0) > 0)

  useEffect(() => {
    if (isBoardPage) {
      setInputValue(boardSearchQuery)
    }
  }, [boardSearchQuery, isBoardPage])

  useEffect(() => {
    if (!isBoardPage) {
      clearBoardSearch()
      setInputValue('')
    } else {
      setShowResults(false)
    }
  }, [isBoardPage, clearBoardSearch])

  return (
    <Box sx={{ position: 'relative', minWidth: '300px' }} ref={searchRef}>
      <TextField
        id="outlined-search"
        label="Tìm kiếm"
        type="search"
        size="small"
        variant="outlined"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => {
          if (!isBoardPage) setShowResults(true)
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {isSearching ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : (
                <SearchIcon sx={{ color: 'white' }} />
              )}
            </InputAdornment>
          ),
          endAdornment: inputValue && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClearSearch} sx={{ color: 'white' }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          )
        }}
        sx={{
          minWidth: '300px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white'
            },
            '&:hover fieldset': {
              borderColor: 'white'
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white'
            }
          },
          '& .MuiInputLabel-root': {
            color: 'white'
          },
          '& label.Mui-focused': {
            color: 'white'
          },
          input: {
            color: 'white'
          }
        }}
      />

      {showResults && inputValue && !isBoardPage && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            maxHeight: '500px',
            overflow: 'auto',
            zIndex: 1300,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }}
        >
          {isSearching && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <CircularProgress size={30} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Đang tìm kiếm...
              </Typography>
            </Box>
          )}

          {!isSearching && !hasResults && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Không tìm thấy kết quả cho {inputValue}
              </Typography>
            </Box>
          )}

          {!isSearching && hasResults && (
            <>
              {searchResults.projects?.length > 0 && (
                <>
                  <Box sx={{ px: 2, py: 1, bgcolor: 'grey.100' }}>
                    <Typography variant="caption" fontWeight="bold" color="text.secondary">
                      DỰ ÁN ({searchResults.projects?.length})
                    </Typography>
                  </Box>
                  <List dense>
                    {searchResults?.projects?.map((project) => (
                      <ListItem key={project._id} disablePadding>
                        <ListItemButton
                          onClick={() => {
                            navigate(`/du-an/${project._id}`)
                            setShowResults(false)
                          }}
                        >
                          <FolderIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: 20 }} />
                          <ListItemText
                            primary={project.name}
                            secondary={project.description}
                            secondaryTypographyProps={{ noWrap: true }}
                          />
                          <Chip label={project.status} size="small" sx={{ ml: 1 }} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                  <Divider />
                </>
              )}

              {(searchResults.tasks?.length || 0) > 0 && (
                <>
                  <Box sx={{ px: 2, py: 1, bgcolor: 'grey.100' }}>
                    <Typography variant="caption" fontWeight="bold" color="text.secondary">
                      CÔNG VIỆC ({searchResults.tasks?.length || 0})
                    </Typography>
                  </Box>
                  <List dense>
                    {searchResults.tasks?.slice(0, 10).map((task) => (
                      <ListItem key={task._id} disablePadding>
                        <ListItemButton>
                          <TaskIcon sx={{ mr: 1.5, color: 'success.main', fontSize: 20 }} />
                          <ListItemText
                            primary={task.name}
                            secondary={task.project_name || task.description}
                            secondaryTypographyProps={{ noWrap: true }}
                          />
                          <Chip label={task.status} size="small" sx={{ ml: 1 }} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                  <Divider />
                </>
              )}

              {(searchResults.users?.length || 0) > 0 && (
                <>
                  <Box sx={{ px: 2, py: 1, bgcolor: 'grey.100' }}>
                    <Typography variant="caption" fontWeight="bold" color="text.secondary">
                      NGƯỜI DÙNG ({searchResults.users?.length || 0})
                    </Typography>
                  </Box>
                  <List dense>
                    {searchResults.users?.map((user) => (
                      <ListItem key={user._id} disablePadding>
                        <ListItemButton>
                          <PersonIcon sx={{ mr: 1.5, color: 'info.main', fontSize: 20 }} />
                          <ListItemText primary={user.name} secondary={user.email} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </>
          )}
        </Paper>
      )}
    </Box>
  )
}

export default SearchBar
