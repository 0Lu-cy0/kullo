import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store'
export interface AudioSrc {
  audioSrc: string | undefined
}
const initialState: AudioSrc = {
  audioSrc: undefined,
}

export const commonSlice = createSlice({
  name: 'audioSrc',
  initialState,
  reducers: {
    changeAudioSrc: (state, action) => {
      state.audioSrc = action.payload
    },
  },
})

export const { changeAudioSrc } = commonSlice.actions

export const selectAudioSrc = (state: RootState) => state.audioSrc.audioSrc
export default commonSlice.reducer
