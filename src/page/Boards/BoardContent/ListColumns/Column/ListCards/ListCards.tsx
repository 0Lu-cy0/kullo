import { Box } from '@mui/material'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import Card from './Card/Card'
import { trello } from '~/theme'

interface ListCardsProps {
  cards: any[]
  columnId: string
  projectId?: string
  onUpdate?: () => void
}

function ListCards({ cards, columnId, projectId, onUpdate }: ListCardsProps) {
  const { setNodeRef } = useDroppable({
    id: columnId,
  })

  return (
    <SortableContext items={cards.map((card) => card._id)} strategy={verticalListSortingStrategy}>
      <Box
        ref={setNodeRef}
        sx={{
          p: '0 5px',
          m: '0 5px',
          gap: 1,
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
          overflowY: 'auto',
          maxHeight: (theme) =>
            `calc(${trello.boardContentHeight} - ${theme.spacing(5)} - ${trello.ColumnHeaderHeight} - ${trello.ColumnFooterHeight})`,
          minHeight: '100px',
          '*::-webkit-scrollbar': {
            backgroundColor: '#ced0da',
          },
          '*::-webkit-scrollbar:hover': {
            backgroundColor: '#bfc2cf',
          },
        }}
      >
        {cards?.map((card) => {
          return <Card key={card._id} card={card} projectId={projectId} onUpdate={onUpdate} />
        })}
      </Box>
    </SortableContext>
  )
}

export default ListCards
