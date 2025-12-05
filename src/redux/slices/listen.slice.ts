import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface AudioRecordingState {
  isListening: boolean | null
  isListeningOld: boolean | null
  wsUrl: string
  wsConnected: boolean
  isRecording: boolean
  language: string
  hotwords: string
  sendHotwords: boolean
  sentFrames: number
  errorCount: number
  micSampleRate: string
  currentSpeaker: string | null
  currentSpeakerName: string | null
  speakerConf: number | null
  partialText: string
  stableText: string
  unstableText: string
  finalTranscripts: Itranscript[]
  log: string
  // VAD (Voice Activity Detection) settings
  vadAggPercent: number
  vadMode: string
  vadStartMs: number
  vadEndMs: number
  vadPrerollMs: number
}
export interface Itranscript {
  text: string
  idx: number
  speaker?: string
}
const initialState: AudioRecordingState = {
  isListening: null,
  isListeningOld: null,
  wsUrl: 'wss://surprising-elementary-massachusetts-guidance.trycloudflare.com/realtime',
  wsConnected: false,
  isRecording: false,
  language: 'auto',
  hotwords: 'EUIPO, WhisperX, BocBang',
  sendHotwords: false,
  sentFrames: 0,
  errorCount: 0,
  micSampleRate: '?',
  currentSpeaker: null,
  currentSpeakerName: null,
  speakerConf: null,
  partialText: '',
  stableText: '',
  unstableText: '',
  finalTranscripts: [],
  log: '',
  // VAD defaults
  vadAggPercent: 56,
  vadMode: '?',
  vadStartMs: 0,
  vadEndMs: 0,
  vadPrerollMs: 0,
}

export const listenSlice = createSlice({
  name: 'listen',
  initialState,
  reducers: {
    setIsListening: (state, action: PayloadAction<boolean>) => {
      state.isListening = action.payload
    },
    setIsListeningOld: (state, action: PayloadAction<boolean>) => {
      state.isListeningOld = action.payload
    },
    setWsUrl: (state, action: PayloadAction<string>) => {
      state.wsUrl = action.payload
    },
    setWsConnected: (state, action: PayloadAction<boolean>) => {
      state.wsConnected = action.payload
    },
    setIsRecording: (state, action: PayloadAction<boolean>) => {
      state.isRecording = action.payload
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
    },
    setHotwords: (state, action: PayloadAction<string>) => {
      state.hotwords = action.payload
    },
    setSendHotwords: (state, action: PayloadAction<boolean>) => {
      state.sendHotwords = action.payload
    },
    setSentFrames: (state, action: PayloadAction<number>) => {
      state.sentFrames = action.payload
    },
    incrementSentFrames: (state) => {
      state.sentFrames += 1
    },
    setErrorCount: (state, action: PayloadAction<number>) => {
      state.errorCount = action.payload
    },
    incrementErrorCount: (state) => {
      state.errorCount += 1
    },
    setMicSampleRate: (state, action: PayloadAction<string>) => {
      state.micSampleRate = action.payload
    },
    setCurrentSpeaker: (state, action: PayloadAction<string | null>) => {
      state.currentSpeaker = action.payload
    },
    setCurrentSpeakerName: (state, action: PayloadAction<string | null>) => {
      state.currentSpeakerName = action.payload
    },
    setSpeakerConf: (state, action: PayloadAction<number | null>) => {
      state.speakerConf = action.payload
    },
    setPartialText: (state, action: PayloadAction<string>) => {
      state.partialText = action.payload
    },
    setStableText: (state, action: PayloadAction<string>) => {
      state.stableText = action.payload
    },
    setUnstableText: (state, action: PayloadAction<string>) => {
      state.unstableText = action.payload
    },
    addFinalTranscript: (state, action: PayloadAction<Itranscript>) => {
      state.finalTranscripts.unshift(action.payload)
    },
    updateFinalTranscripts: (state, action: PayloadAction<Itranscript[]>) => {
      state.finalTranscripts = action.payload
    },
    appendLog: (state, action: PayloadAction<string>) => {
      state.log += `\n${action.payload}`
    },
    setFinalTranscripts: (state, action: PayloadAction<Itranscript[]>) => {
      state.finalTranscripts = action.payload
    },
    clearTranscriptTexts: (state) => {
      state.stableText = ''
      state.unstableText = ''
      state.partialText = ''
    },
    resetAudioState: (state) => {
      state.isRecording = false
      state.wsConnected = false
      state.sentFrames = 0
      state.currentSpeaker = null
      state.speakerConf = null
      state.partialText = ''
      state.stableText = ''
      state.unstableText = ''
      state.finalTranscripts = []
      state.log = ''
    },
    // VAD actions
    setVadAggPercent: (state, action: PayloadAction<number>) => {
      state.vadAggPercent = action.payload
    },
    setVadParams: (
      state,
      action: PayloadAction<{
        mode: string
        startMs: number
        endMs: number
        prerollMs: number
      }>
    ) => {
      state.vadMode = action.payload.mode
      state.vadStartMs = action.payload.startMs
      state.vadEndMs = action.payload.endMs
      state.vadPrerollMs = action.payload.prerollMs
    },
  },
})

export const selectIsListening = (state: { listen: AudioRecordingState }) =>
  state.listen.isListening
export const selectIsListeningOld = (state: { listen: AudioRecordingState }) =>
  state.listen.isListeningOld
export const selectAudioRecordingState = (state: { listen: AudioRecordingState }) => state.listen
export const selectCurrentSpeaker = (state: { listen: AudioRecordingState }) =>
  state.listen.currentSpeaker
export const selectCurrentSpeakerName = (state: { listen: AudioRecordingState }) =>
  state.listen.currentSpeakerName
export const selectFinalTranscript = (state: { listen: AudioRecordingState }) =>
  state.listen.finalTranscripts
export const {
  setIsListening,
  setIsListeningOld,
  setWsUrl,
  setWsConnected,
  setIsRecording,
  setLanguage,
  setHotwords,
  setSendHotwords,
  setSentFrames,
  incrementSentFrames,
  setErrorCount,
  incrementErrorCount,
  setMicSampleRate,
  setCurrentSpeaker,
  setCurrentSpeakerName,
  setSpeakerConf,
  setPartialText,
  setStableText,
  setUnstableText,
  addFinalTranscript,
  updateFinalTranscripts,
  appendLog,
  setFinalTranscripts,
  clearTranscriptTexts,
  resetAudioState,
  setVadAggPercent,
  setVadParams,
} = listenSlice.actions

export default listenSlice.reducer
