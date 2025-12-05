import { Container } from '@mui/material'
import AppBar from '~/components/AppBar'
import BoardBar from './BoardBar'
import BoardContent from './BoardContent'
import { useEffect, useState } from 'react'
import { BoardService } from '~/services/BoardService'
import { useParams } from 'react-router-dom'
import type { Columndata } from '~/types/api/column'
import { message, Spin } from 'antd'
import { ProjectService } from '~/services/ProjectService'
import type { Project } from '~/types/api/project'
import LoadingLayout from '~/components/Spin'

export interface BoardData extends Project {
  columnsData: Columndata[]
  columnOrderIds?: string[]
}

function Board() {
  const { id } = useParams()
  const [board, setBoard] = useState<BoardData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  console.log('Board data:', board)
  const fetchBoard = async (showMessage = false) => {
    if (!id) return

    try {
      setLoading(true)
      const [projectRes, ColumnsRes] = await Promise.all([
        ProjectService.projectById(id as string),
        BoardService.getAll(id as string),
      ])

      const projectData = projectRes.data
      const columnsData = ColumnsRes.data.data

      const merge = {
        ...projectData,
        columnsData: columnsData,
      }

      if (projectRes.isOk && ColumnsRes.isOk) {
        setBoard(merge as any)
        // Lưu projectId vào localStorage để dùng cho các trang khác (VD: trang thành viên)
        if (id) {
          localStorage.setItem('currentProjectId', id)
        }
        if (showMessage) {
          // message.success('Tải dữ liệu board thành công')
        }
      } else {
        message.error('Lấy dữ liệu board thất bại')
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  // Thêm column vào state (optimistic update)
  const handleAddColumn = (newColumn: Columndata) => {
    if (!board) return
    setBoard({
      ...board,
      columnsData: [...board.columnsData, newColumn],
      columns: [...(board.columns || []), newColumn._id],
    })
  }

  // Xóa column khỏi state (optimistic update)
  const handleDeleteColumn = (columnId: string) => {
    if (!board) return
    setBoard({
      ...board,
      columnsData: board.columnsData?.filter((col) => col._id !== columnId),
      columns: (board.columns || [])?.filter((id) => id !== columnId),
    })
  }

  // Update column trong state
  const handleUpdateColumn = (columnId: string, updatedColumn: Partial<Columndata>) => {
    if (!board) return
    setBoard({
      ...board,
      columnsData: board.columnsData.map((col) =>
        col._id === columnId ? { ...col, ...updatedColumn } : col
      ),
    })
  }

  useEffect(() => {
    fetchBoard(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar
        board={board}
        boardContent={
          <LoadingLayout loading={loading}>
            <BoardContent
              board={board}
              onRefresh={fetchBoard}
              onAddColumn={handleAddColumn}
              onDeleteColumn={handleDeleteColumn}
              onUpdateColumn={handleUpdateColumn}
            />
          </LoadingLayout>
        }
      />
    </Container>
  )
}

export default Board
