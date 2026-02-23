import { configureStore } from '@reduxjs/toolkit'
import weiqiReducer from '@/slices/weiqiSlice'
import scrapingReducer from '@/slices/scrapingSlice'

export const store = configureStore({
  reducer: {
    weiqi: weiqiReducer,
    scraping: scrapingReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch