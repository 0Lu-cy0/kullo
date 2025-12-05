import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
export interface Session {
  meetingId: string
  title: string
  hostId?: string
  isSetDate?: boolean
  setAt?: string
  isDelete?: boolean
  updateBy?: string
  createBy?: string
  createAt?: string
  lastUpdate?: string
  audioUrl?: string
  audioInfo?: string
}
const initialState: { currentSession: Session } = {
  currentSession: {} as Session,
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session>) => {
      state.currentSession = action.payload
    },
  },
})
export const selectCurrentSession = (state: { session: { currentSession: Session } }) =>
  state.session.currentSession
export const { setSession } = sessionSlice.actions

export default sessionSlice.reducer
