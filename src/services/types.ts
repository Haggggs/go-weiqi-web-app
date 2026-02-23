// 围棋数据抓取相关的类型定义

// 棋子类型
export type StoneType = 'black' | 'white' | null

// 棋盘坐标
export interface Position {
  row: number
  col: number
}

// 棋谱步骤
export interface GameMove {
  moveNumber: number
  position: Position
  color: 'black' | 'white'
  comment?: string
  timestamp?: number
}

// 围棋棋谱信息
export interface GameRecord {
  id: string
  title: string
  blackPlayer: string
  whitePlayer: string
  date: string
  result: string
  moves: GameMove[]
  handicap?: number
  komi?: number
  source?: string
  url?: string
}

// 玩家信息
export interface PlayerInfo {
  id: string
  name: string
  rank?: string
  rating?: number
  wins?: number
  losses?: number
  avatar?: string
  country?: string
}

// 对局数据
export interface GameData {
  gameId: string
  gameRecord: GameRecord
  players: {
    black: PlayerInfo
    white: PlayerInfo
  }
  metadata: {
    boardSize: number
    timeControl?: string
    tournament?: string
    rules?: string
  }
}

// 抓取配置
export interface ScrapingConfig {
  baseUrl: string
  timeout: number
  retries: number
  userAgent: string
  headers?: Record<string, string>
}

// 抓取结果
export interface ScrapingResult<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: number
  source: string
}

// API响应结构
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
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

// 棋谱查询参数
export interface GameQueryParams {
  player?: string
  dateFrom?: string
  dateTo?: string
  result?: string
  tournament?: string
  limit?: number
  offset?: number
}