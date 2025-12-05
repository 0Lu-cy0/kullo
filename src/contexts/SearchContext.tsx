import React, { createContext, useContext, useState, useCallback } from 'react'
import dayjs from 'dayjs'
import { message } from 'antd'
import { SearchService } from '~/services/SearchService'
import type {
  SearchResult,
  TaskSearchResult,
  BoardSearchResponse,
  ProjectSearchResult,
  ProjectSearchFiltersRequest,
} from '~/types/api/search'
import type { Columndata } from '~/types/api/column'
import type { Task } from '~/types/api/task'

interface FilterOptions {
  hideEmptyColumns: boolean
  statusFilter: string[]
  priorityFilter: string[]
  dueDateBefore: string | null
}

type BoardSearchFilterInput = Pick<FilterOptions, 'priorityFilter' | 'dueDateBefore'>

type ProjectSearchFilterInput = ProjectSearchFiltersRequest & {
  dueBefore?: string | null
}

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResults: SearchResult | null
  taskResults: TaskSearchResult[]
  boardResults: BoardSearchResponse | null
  boardSearchQuery: string
  setBoardSearchQuery: (query: string) => void
  projectSearchQuery: string
  setProjectSearchQuery: (query: string) => void
  isSearching: boolean
  performSearch: (query: string) => Promise<void>
  performBoardSearch: (projectId: string, query: string, filters?: BoardSearchFilterInput) => Promise<void>
  performProjectSearch: (query: string, filters?: ProjectSearchFilterInput) => Promise<void>
  clearBoardSearch: () => void
  clearProjectSearch: () => void
  clearSearch: () => void
  filterOptions: FilterOptions
  setFilterOptions: (options: FilterOptions) => void
  resetFilters: () => void
  projectSearchResults: ProjectSearchResult[]
  isProjectSearching: boolean
}

const createDefaultFilters = (): FilterOptions => ({
  hideEmptyColumns: false,
  statusFilter: [],
  priorityFilter: [],
  dueDateBefore: null,
})

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const [taskResults, setTaskResults] = useState<TaskSearchResult[]>([])
  const [boardResults, setBoardResults] = useState<BoardSearchResponse | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(() => createDefaultFilters())
  const [boardSearchQuery, setBoardSearchQuery] = useState('')
  const [projectSearchQuery, setProjectSearchQuery] = useState('')
  const [projectSearchResults, setProjectSearchResults] = useState<ProjectSearchResult[]>([])
  const [isProjectSearching, setIsProjectSearching] = useState(false)

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null)
      setTaskResults([])
      setSearchQuery('')
      return
    }

    setIsSearching(true)
    setSearchQuery(query)

    try {
      const [globalRes, tasksRes] = await Promise.all([
        SearchService.globalSearch(query),
        SearchService.searchTasks(query),
      ])

      if (globalRes.isOk && globalRes.data) {
        setSearchResults(globalRes.data)
      }

      if (tasksRes.isOk && tasksRes.data) {
        setTaskResults(tasksRes.data)
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults(null)
      setTaskResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  const performProjectSearch = useCallback(
    async (query: string, filters?: ProjectSearchFilterInput) => {
      const normalized = query.trim()
      if (!normalized) {
        setProjectSearchResults([])
        setIsProjectSearching(false)
        return
      }

      setIsProjectSearching(true)
      setProjectSearchResults([])

      try {
        const response = await SearchService.searchProjects(normalized, {
          status: filters?.status,
          priority: filters?.priority,
        })

        const projectPayload: any = response?.data ?? null
        let items: ProjectSearchResult[] = []

        const extractProjects = (source: any): ProjectSearchResult[] => {
          if (!source) return []
          if (Array.isArray(source)) return source
          if (Array.isArray(source?.data)) return source.data
          if (Array.isArray(source?.items)) return source.items
          if (Array.isArray(source?.data?.data)) return source.data.data
          return []
        }

        items = extractProjects(projectPayload)
        if (!items.length) {
          items = extractProjects(response)
        }

        if (filters?.dueBefore) {
          const cutoff = dayjs(filters.dueBefore).endOf('day')
          items = items.filter((project) => {
            if (!project.end_date) return false
            const projectDue = dayjs(project.end_date)
            if (!projectDue.isValid()) return false
            return !projectDue.isAfter(cutoff)
          })
        }

        setProjectSearchResults(items)
      } catch (error) {
        console.error('Project search error:', error)
        message.error('Không thể tìm kiếm dự án, vui lòng thử lại.')
        setProjectSearchResults([])
      } finally {
        setIsProjectSearching(false)
      }
    },
    []
  )
  const performBoardSearch = useCallback(
    async (projectId: string, query: string, filters?: BoardSearchFilterInput) => {
      if (!projectId) return
      const normalized = query.trim()
      if (!normalized) {
        setBoardResults(null)
        return
      }

      try {
        const response = await SearchService.searchBoard(projectId, normalized, {
          priority: filters?.priorityFilter || [],
          dueEnd: filters?.dueDateBefore || null,
        })

        const unwrapPayload = (source: any): BoardSearchResponse | null => {
          if (!source) return null
          if (Array.isArray(source?.columns) || source?.meta) return source
          if (source?.data) return unwrapPayload(source.data)
          if (source?.result) return unwrapPayload(source.result)
          return null
        }

        const payload = unwrapPayload(response) || unwrapPayload(response?.data)

        if (payload) {
          const rawColumns = Array.isArray(payload.columns)
            ? payload.columns
            : Array.isArray((payload as any)?.data)
              ? (payload as any).data
              : []

          const normalizeCards = (cards: any[]): Task[] =>
            (Array.isArray(cards) ? cards : []).map((card) => {
              const normalizedTitle = card?.tittle_card ?? card?.title ?? card?.name ?? ''
              return {
                ...card,
                tittle_card: normalizedTitle,
                title: normalizedTitle,
                name: normalizedTitle || card?.name,
              }
            })

          const columns: Columndata[] = (rawColumns as any[]).map((column) => {
            const normalizedTitle = column?.tittle_column ?? column?.title ?? ''
            const normalizedCards = normalizeCards(column?.cards)
            return {
              ...column,
              tittle_column: normalizedTitle,
              title: normalizedTitle,
              cards: normalizedCards,
            }
          })

          const cardsCount = columns.reduce(
            (sum: number, column) => sum + (Array.isArray(column?.cards) ? column.cards.length : 0),
            0
          )

          const meta = payload.meta || {
            query: normalized,
            totalColumns: columns.length,
            matchedColumns: columns.length,
            totalCards: cardsCount,
            matchedCards: cardsCount,
          }

          setBoardResults({ columns, meta })
        } else {
          setBoardResults(null)
        }
      } catch (error) {
        console.error('Board search error:', error)
        setBoardResults(null)
      }
    },
    []
  )

  const clearBoardSearch = useCallback(() => {
    setBoardSearchQuery('')
    setBoardResults(null)
  }, [])

  const clearProjectSearch = useCallback(() => {
    setProjectSearchQuery('')
    setProjectSearchResults([])
    setIsProjectSearching(false)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setSearchResults(null)
    setTaskResults([])
    setIsSearching(false)
    clearBoardSearch()
    clearProjectSearch()
  }, [clearBoardSearch, clearProjectSearch])

  const resetFilters = useCallback(() => {
    setFilterOptions(createDefaultFilters())
  }, [])

  const value = {
    searchQuery,
    setSearchQuery,
    searchResults,
    taskResults,
    boardResults,
    boardSearchQuery,
    setBoardSearchQuery,
    projectSearchQuery,
    setProjectSearchQuery,
    isSearching,
    performSearch,
    performBoardSearch,
    performProjectSearch,
    clearBoardSearch,
    clearProjectSearch,
    clearSearch,
    filterOptions,
    setFilterOptions,
    resetFilters,
    projectSearchResults,
    isProjectSearching,
  }

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
