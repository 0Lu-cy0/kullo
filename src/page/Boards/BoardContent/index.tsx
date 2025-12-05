import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision,
} from '@dnd-kit/core'
import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { mapOrder } from '~/contants/sort'
import { generatePlaceholderCard } from '~/utils/formatters'
import { trello } from '~/theme'
import { cloneDeep, isEmpty, debounce } from 'lodash'
import dayjs from 'dayjs'
import type { BoardData } from '../_id'
import type { Columndata } from '~/types/api/column'
import type { Task } from '~/types/api/task'
import { ProjectService } from '~/services/ProjectService'
import { BoardService } from '~/services/BoardService'
import { ServerLogService } from '~/services/ServerLogService'
import { message } from 'antd'
import { useSearch } from '~/contexts/SearchContext'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD',
}

function BoardContent({
  board,
  onRefresh,
  onAddColumn,
  onDeleteColumn,
  onUpdateColumn,
}: {
  board: BoardData | null
  onRefresh?: () => void
  onAddColumn?: (column: Columndata) => void
  onDeleteColumn?: (columnId: string) => void
  onUpdateColumn?: (columnId: string, updatedColumn: Partial<Columndata>) => void
}) {
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  const sensors = useSensors(mouseSensor, touchSensor)

  const {
    boardResults,
    boardSearchQuery,
    performBoardSearch,
    clearBoardSearch,
    filterOptions
  } = useSearch()

  const [orderedColumnsState, setOrderedColumnsState] = useState<Columndata[]>([])

  const [activeDraggedItem, setactiveDraggedItem] = useState<string | null>(null)
  const [activeDraggedType, setactiveDraggedType] = useState<string | null>(null)
  const [activeDraggedData, setactiveDraggedData] = useState<any>(null)
  const [oldColumnData, setOldColumnData] = useState<Columndata | null>(null)
  const lastOverId = useRef<string | number | null>(null)

  // Helper function để tạo log
  const createLog = async (content: string, logHistory?: string) => {
    if (!board?._id) return

    try {
      await ServerLogService.createLog({
        content,
        projectId: board._id,
        logHistory,
      })
    } catch (error) {
      console.error('Failed to create log:', error)
    }
  }

  useEffect(() => {
    if (board?.columnsData) {
      if (board.columnOrderIds && board.columnOrderIds.length > 0) {
        const orderedColumns = mapOrder(board.columnsData, board.columnOrderIds, '_id')
        setOrderedColumnsState(orderedColumns)
      } else if (board.columns && board.columns.length > 0) {
        const orderedColumns = mapOrder(board.columnsData, board.columns, '_id')
        setOrderedColumnsState(orderedColumns)
      } else {
        setOrderedColumnsState(board.columnsData)
      }
    }
  }, [board])

  useEffect(() => {
    clearBoardSearch()
  }, [board?._id, clearBoardSearch])

  useEffect(() => {
    if (!board?._id) return
    const normalized = boardSearchQuery.trim()
    if (!normalized) {
      clearBoardSearch()
      return
    }
    performBoardSearch(board._id, normalized, {
      priorityFilter: filterOptions.priorityFilter,
      dueDateBefore: filterOptions.dueDateBefore,
    })
  }, [
    board?._id,
    boardSearchQuery,
    performBoardSearch,
    clearBoardSearch,
    filterOptions.priorityFilter,
    filterOptions.dueDateBefore,
  ])

  // Filter columns and cards based on search results and filters
  const filteredColumns = useMemo(() => {
    let columns = orderedColumnsState

    const normalizedQuery = boardSearchQuery.trim()
    const statusSet = new Set(filterOptions.statusFilter)
    const prioritySet = new Set(filterOptions.priorityFilter)
    const hasStatusFilter = statusSet.size > 0
    const hasPriorityFilter = prioritySet.size > 0
    const hasDateFilter = Boolean(filterOptions.dueDateBefore)
    const endDate = filterOptions.dueDateBefore ? dayjs(filterOptions.dueDateBefore).endOf('day') : null

    // 1. Filter by search query
    if (normalizedQuery) {
      if (boardResults?.columns && boardResults.columns.length > 0) {
        columns = boardResults.columns.map((column) => ({
          ...column,
          cards: column.cards || [],
          cardOrderIds: column.cardOrderIds?.length
            ? column.cardOrderIds
            : (column.cards || []).map((card) => card._id),
        }))
      } else {
        columns = []
      }
    }

    const shouldFilterCards = hasStatusFilter || hasPriorityFilter || hasDateFilter || filterOptions.hideEmptyColumns
    const shouldHideEmptyColumns = filterOptions.hideEmptyColumns || hasStatusFilter || hasPriorityFilter || hasDateFilter

    if (shouldFilterCards) {
      columns = columns
        .map((column) => {
          let filteredCards: Task[] = column.cards || []

          if (hasStatusFilter) {
            filteredCards = filteredCards.filter((card) => statusSet.has(card.status))
          }

          if (hasPriorityFilter) {
            filteredCards = filteredCards.filter((card) => prioritySet.has(card.priority))
          }

          if (hasDateFilter) {
            filteredCards = filteredCards.filter((card) => {
              if (!card.due_date) return false
              const dueDate = dayjs(card.due_date)
              if (!dueDate.isValid()) return false
              if (endDate && dueDate.isAfter(endDate, 'day')) return false
              return true
            })
          }

          if (shouldHideEmptyColumns && filteredCards.length === 0) {
            return null
          }

          return {
            ...column,
            cards: filteredCards,
            cardOrderIds: filteredCards.map((card) => card._id),
          }
        })
        .filter((column): column is Columndata => column !== null)
    }

    return columns
  }, [orderedColumnsState, boardResults, boardSearchQuery, filterOptions])

  const moveCardBetweenColumnsAPI = async (
    cardId: string,
    fromColumnId: string,
    toColumnId: string,
    position: number
  ) => {
    try {
      const response = await ProjectService.projectMoveCard({
        cardId,
        fromColumnId,
        toColumnId,
        position,
      })

      if (response.isOk) {
        const fromColumn = orderedColumnsState.find((col) => col._id === fromColumnId)
        const toColumn = orderedColumnsState.find((col) => col._id === toColumnId)
        const card = fromColumn?.cards?.find((c) => c._id === cardId)
        await createLog(
          `Đã di chuyển thẻ "${card?.title || 'Unknown'}" từ cột "${fromColumn?.title || 'Unknown'}" sang cột "${toColumn?.title || 'Unknown'}"`,
          cardId
        )
      } else {
        message.error('Di chuyển card thất bại!')
        onRefresh?.()
      }
    } catch {
      message.error('Có lỗi xảy ra khi di chuyển card!')
      onRefresh?.()
    }
  }

  const debouncedMoveCard = useCallback(
    debounce((cardId: string, fromColumnId: string, toColumnId: string, position: number) => {
      moveCardBetweenColumnsAPI(cardId, fromColumnId, toColumnId, position)
    }, 500),
    [onRefresh, orderedColumnsState]
  )

  const updateCardOrderInColumn = async (columnId: string, cardOrderIds: string[]) => {
    try {
      const response = await BoardService.updateBoard(columnId, {
        cardOrderIds,
      })

      if (response.isOk) {
        const column = orderedColumnsState.find((col) => col._id === columnId)
        await createLog(
          `Đã sắp xếp lại các thẻ trong cột "${column?.title || 'Unknown'}"`,
          columnId
        )
      } else {
        message.error('Cập nhật vị trí card thất bại!')
        onRefresh?.()
      }
    } catch {
      message.error('Có lỗi xảy ra khi cập nhật vị trí card!')
      onRefresh?.()
    }
  }

  const debouncedUpdateCardOrder = useCallback(
    debounce((columnId: string, cardOrderIds: string[]) => {
      updateCardOrderInColumn(columnId, cardOrderIds)
    }, 500),
    [onRefresh, orderedColumnsState]
  )

  const updateColumnOrder = async (columnOrderIds: string[]) => {
    if (!board?._id) return

    try {
      const response = await ProjectService.reorderColumns(board._id, columnOrderIds)

      if (response.isOk) {
        await createLog('Đã sắp xếp lại các cột trong dự án')
      } else {
        message.error('Cập nhật vị trí cột thất bại!')
        onRefresh?.()
      }
    } catch {
      message.error('Có lỗi xảy ra khi cập nhật vị trí cột!')
      onRefresh?.()
    }
  }

  const debouncedUpdateColumnOrder = useCallback(
    debounce((columnOrderIds: string[]) => {
      updateColumnOrder(columnOrderIds)
    }, 500),
    [board?._id, onRefresh]
  )

  const handleCardCreated = () => {
    onRefresh?.()
  }

  const findColumCardId = (cardId: string): Columndata | undefined => {
    return orderedColumnsState.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId)
    )
  }

  const moveCardBetweenColumns = (
    overColumn: Columndata,
    overCardId: string,
    active: any,
    over: any,
    activeColumn: Columndata,
    activeDraggingCardId: string,
    activeDraggingCardData: any
  ) => {
    setOrderedColumnsState((prevColumns) => {
      const overCardIndex = overColumn?.cards?.findIndex((card) => card._id === overCardId)

      let newCardIndex

      if (overCardIndex < 0) {
        const realCards = overColumn?.cards?.filter((card) => !card.FE_Placeholder) || []
        newCardIndex = realCards.length
      } else {
        const isBelowOVerItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOVerItem ? 1 : 0
        newCardIndex = overCardIndex + modifier
      }

      const nextColums = cloneDeep(prevColumns)
      const nextActiveColumn = nextColums?.find((c) => c._id === activeColumn._id)
      const nextOverColumn = nextColums?.find((c) => c._id === overColumn._id)

      if (nextActiveColumn) {
        nextActiveColumn.cards = nextActiveColumn.cards?.filter(
          (card) => card._id !== activeDraggingCardId
        )

        nextActiveColumn.cardOrderIds = nextActiveColumn?.cards?.map((card) => card._id)

        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn._id)]
        }
      }

      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn?.cards?.filter(
          (card) => card._id !== activeDraggingCardId && !card.FE_Placeholder
        )

        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id,
        }
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        )
        nextOverColumn.cardOrderIds = nextOverColumn?.cards?.map((card) => card._id)
      }

      return nextColums
    })
  }

  const handleDragStart = (event: any) => {
    setactiveDraggedItem(event?.active?.id)
    setactiveDraggedType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setactiveDraggedData(event?.active?.data?.current)

    if (event?.active?.data?.current?.columnId) {
      const column = findColumCardId(event?.active?.id)
      setOldColumnData(column || null)
    }
  }

  const handleDragOver = (event: any) => {
    if (activeDraggedType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    const { active, over } = event

    if (!active || !over) return

    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active
    const { id: overCardId } = over

    const activeColumn = findColumCardId(activeDraggingCardId)

    let overColumn = findColumCardId(overCardId)

    if (!overColumn) {
      overColumn = orderedColumnsState?.find((col) => col._id === overCardId)
    }

    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (!active || !over) return

    if (activeDraggedType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const oldIndex = orderedColumnsState.findIndex((c) => c._id === active.id)
        const newIndex = orderedColumnsState.findIndex((c) => c._id === over.id)
        const dndOrderedColumns = arrayMove(orderedColumnsState, oldIndex, newIndex)
        setOrderedColumnsState(dndOrderedColumns)

        const newColumnOrderIds = dndOrderedColumns.map((col) => col._id)
        debouncedUpdateColumnOrder(newColumnOrderIds)
      }
    } else if (activeDraggedType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData },
      } = active
      const { id: overCardId } = over

      const activeColumn = findColumCardId(activeDraggingCardId)
      let overColumn = findColumCardId(overCardId)

      if (!overColumn) {
        overColumn = orderedColumnsState.find((col) => col._id === overCardId)
      }

      if (!activeColumn || !overColumn) return
      if (oldColumnData?._id !== overColumn._id) {
        moveCardBetweenColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )

        const newPosition = overColumn.cards.findIndex((card) => card._id === overCardId)

        debouncedMoveCard(
          activeDraggingCardId,
          activeColumn._id,
          overColumn._id,
          newPosition >= 0 ? newPosition : 0
        )
      } else {
        const oldCardIndex = oldColumnData?.cards.findIndex((c) => c._id === activeDraggedItem)
        const newCardIndex = overColumn?.cards.findIndex((c) => c._id === overCardId)
        const dndOrderedCards = arrayMove(oldColumnData?.cards, oldCardIndex, newCardIndex)

        const newCardOrderIds = dndOrderedCards.map((card) => card._id)

        setOrderedColumnsState((prevColumns) => {
          const nextColums = cloneDeep(prevColumns)
          const targetColumn = nextColums.find((c) => c._id === oldColumnData?._id)
          if (targetColumn) {
            targetColumn.cards = dndOrderedCards
            targetColumn.cardOrderIds = newCardOrderIds
          }

          return nextColums
        })

        if (oldColumnData?._id) {
          debouncedUpdateCardOrder(oldColumnData._id, newCardOrderIds)
        }
      }
      setactiveDraggedItem(null)
      setactiveDraggedType(null)
      setactiveDraggedData(null)
      setOldColumnData(null)
    }
  }

  const collisionDetectionStrategy = useCallback(
    (args: any) => {
      if (activeDraggedType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }

      const poiterIntersection = pointerWithin(args)

      if (!poiterIntersection?.length) {
        return lastOverId.current ? [{ id: lastOverId.current }] : []
      }

      let overId = getFirstCollision(poiterIntersection, 'id')

      if (overId) {
        const checkColumn = orderedColumnsState.find((c) => c._id === overId)

        if (checkColumn) {
          const realCards = checkColumn.cards?.filter((card) => !card.FE_Placeholder) || []

          if (realCards.length > 0) {
            const realCardIds = realCards.map((card) => card._id)
            const closestCard = closestCorners({
              ...args,
              droppableContainers: args.droppableContainers.filter((c: any) => {
                return c.id !== overId && realCardIds.includes(c.id)
              }),
            })[0]

            if (closestCard) {
              overId = closestCard.id
            }
          }
        }

        lastOverId.current = overId
        return [{ id: overId }]
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDraggedType, orderedColumnsState]
  )

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5' } },
    }),
  }

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <DndContext
        onDragEnd={handleDragEnd}
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        collisionDetection={collisionDetectionStrategy}
      >
        <Box
          sx={{
            height: (theme) => trello.boardContentHeight,
            width: '100%',
            display: 'flex',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
            p: '10px 0',
          }}
        >
          <ListColumns
            columns={filteredColumns}
            projectId={board?._id || ''}
            onCardCreated={handleCardCreated}
            onAddColumn={onAddColumn}
            onDeleteColumn={onDeleteColumn}
            onUpdateColumn={onUpdateColumn}
          />
          <DragOverlay dropAnimation={dropAnimation}>
            {activeDraggedType && null}
            {activeDraggedType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
              <Column column={activeDraggedData} projectId={board?._id || ''} />
            )}
            {activeDraggedType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDraggedData} />}
          </DragOverlay>
        </Box>
      </DndContext>
    </Box>
  )
}

export default BoardContent
