export const capitalizeFirstLetter = (string: string) => {
  if (!string) return ''
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`
}

export const generatePlaceholderCard = (column: any) => {
  return {
    _id: 'placeholder',
    boardId: column.boardId,
    columnId: column._id,
    FE_Placeholder: true,
  }
}
