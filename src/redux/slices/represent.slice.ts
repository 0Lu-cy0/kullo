import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
export interface Representative {
  representativeId: string
  representativeName: string
  positionTitle: string
  organization: string
  createBy: string
  isDelete: boolean
  updateBy: string
  createAt: string
  lastUpdate: string
}
const initialState: { talkingRepresent: Representative } = {
  talkingRepresent: {} as Representative,
}

export const representSlice = createSlice({
  name: 'represent',
  initialState,
  reducers: {
    setRepresent: (state, action: PayloadAction<Representative>) => {
      state.talkingRepresent = action.payload
    },
  },
})
export const selectTalkingRepresentative = (state: {
  represent: { talkingRepresent: Representative }
}) => state.represent.talkingRepresent
export const { setRepresent } = representSlice.actions

export default representSlice.reducer
