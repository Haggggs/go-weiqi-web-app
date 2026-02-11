import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// 棋子类型
export type StoneType = 'black' | 'white' | null

// 棋盘坐标
export interface Position {
  row: number
  col: number
}

// 棋盘状态
export interface BoardState {
  stones: StoneType[][]
  currentPlayer: 'black' | 'white'
  gameHistory: Position[]
  lastMove: Position | null
  boardSize: number
  captured: {
    black: number
    white: number
  }
}

// 初始化棋盘状态
const initializeBoard = (size: number = 19): StoneType[][] => {
  return Array(size).fill(null).map(() => Array(size).fill(null))
}

const initialState: BoardState = {
  stones: initializeBoard(),
  currentPlayer: 'black',
  gameHistory: [],
  lastMove: null,
  boardSize: 19,
  captured: {
    black: 0,
    white: 0,
  },
}

const weiqiSlice = createSlice({
  name: 'weiqi',
  initialState,
  reducers: {
    placeStone: (state, action: PayloadAction<{ row: number; col: number }>) => {
      const { row, col } = action.payload
      if (state.stones[row][col] === null) {
        state.stones[row][col] = state.currentPlayer
        state.lastMove = { row, col }
        state.gameHistory.push({ row, col })
        state.currentPlayer = state.currentPlayer === 'black' ? 'white' : 'black'
      }
    },
    undoMove: (state) => {
      if (state.gameHistory.length > 0) {
        const lastMove = state.gameHistory.pop()
        if (lastMove) {
          state.stones[lastMove.row][lastMove.col] = null
          state.currentPlayer = state.currentPlayer === 'black' ? 'white' : 'black'
          state.lastMove = state.gameHistory.length > 0 
            ? state.gameHistory[state.gameHistory.length - 1] 
            : null
        }
      }
    },
    resetBoard: (state) => {
      state.stones = initializeBoard(state.boardSize)
      state.currentPlayer = 'black'
      state.gameHistory = []
      state.lastMove = null
      state.captured = {
        black: 0,
        white: 0,
      }
    },
    setBoardSize: (state, action: PayloadAction<number>) => {
      state.boardSize = action.payload
      state.stones = initializeBoard(action.payload)
      state.resetBoard()
    },
  },
})

export const { placeStone, undoMove, resetBoard, setBoardSize } = weiqiSlice.actions
export default weiqiSlice.reducer