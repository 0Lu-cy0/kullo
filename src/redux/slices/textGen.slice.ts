import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const initialState: { textGen: string } = { textGen: '' }

export const textGenSlice = createSlice({
  name: 'textGen',
  initialState,
  reducers: {
    setTextGen: (state, action: PayloadAction<string>) => {
      state.textGen = action.payload
    },
  },
})
export const selectTextGen = (state: { textGen: { textGen: string } }) => state.textGen.textGen
export const { setTextGen } = textGenSlice.actions

export default textGenSlice.reducer
