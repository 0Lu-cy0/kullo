// import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
// import { Box } from '@mui/material'
// import { Column } from './Column'

// interface ListColumnsProps {
//   columns: Columndata[]
//   projectId: string
//   onRefresh?: () => void
// }

// function ListColumns({ columns, projectId, onRefresh }: ListColumnsProps) {
//   return (
//     <SortableContext items={columns?.map((c) => c._id)} strategy={horizontalListSortingStrategy}>
//       <Box
//         sx={{
//           bgcolor: 'inherit',
//           width: '100%',
//           height: '100%',
//           display: 'flex',
//           overflowX: 'auto',
//           overflowY: 'hidden',
//           '&::-webkit-scrollbar-track': { m: 2 },
//         }}
//       >
//         {columns?.map((column) => (
//           <Column key={column._id} column={column} projectId={projectId} onRefresh={onRefresh} />
//         ))}
//       </Box>
//     </SortableContext>
//   )
// }

// export default ListColumns
