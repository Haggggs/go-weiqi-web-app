import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ScrapingState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  data: any[]
  lastUpdated: string | null
}

const initialState: ScrapingState = {
  status: 'idle',
  error: null,
  data: [],
  lastUpdated: null,
}

const scrapingSlice = createSlice({
  name: 'scraping',
  initialState,
  reducers: {
    scrapingStart: (state) => {
      state.status = 'loading'
      state.error = null
    },
    scrapingSuccess: (state, action: PayloadAction<any[]>) => {
      state.status = 'succeeded'
      state.data = action.payload
      state.lastUpdated = new Date().toISOString()
    },
    scrapingFailure: (state, action: PayloadAction<string>) => {
      state.status = 'failed'
      state.error = action.payload
    },
    clearScrapingData: (state) => {
      state.status = 'idle'
      state.data = []
      state.error = null
      state.lastUpdated = null
    },
  },
})

export const {
  scrapingStart,
  scrapingSuccess,
  scrapingFailure,
  clearScrapingData,
} = scrapingSlice.actions

export default scrapingSlice.reducer