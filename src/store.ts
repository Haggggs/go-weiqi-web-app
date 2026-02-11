import { configureStore } from '@reduxjs/toolkit'
import weiqiReducer from '@/slices/weiqiSlice'

export const store = configureStore({
  reducer: {
    weiqi: weiqiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch