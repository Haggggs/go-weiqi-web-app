import { GameRecord, Position, StoneType } from './types'

/**
 * SGF格式工具函数
 */
export class SgfUtils {
  /**
   * 将棋盘坐标转换为SGF格式
   */
  static positionToSgf(row: number, col: number, boardSize: number = 19): string {
    const letters = 'ABCDEFGHJKLMNOPQRST' // 跳过I
    const sgfCol = letters[col]
    const sgfRow = String.fromCharCode(97 + (boardSize - 1 - row)) // a=97, b=98, ...
    return `${sgfCol}${sgfRow}`
  }

  /**
   * 将SGF坐标转换为棋盘坐标
   */
  static sgfToPosition(sgfCoord: string, boardSize: number = 19): Position {
    const letters = 'ABCDEFGHJKLMNOPQRST'
    const col = letters.indexOf(sgfCoord[0])
    const row = boardSize - 1 - (sgfCoord.charCodeAt(1) - 97)
    return { row, col }
  }

  /**
   * 生成SGF格式的棋谱
   */
  static generateSgf(gameRecord: GameRecord): string {
    let sgf = `(;GM[1]FF[4]CA[UTF-8]AP[WeiqiWebApp:1.0]`
    
    // 基本信息
    sgf += `PB[${gameRecord.blackPlayer}]`
    sgf += `PW[${gameRecord.whitePlayer}]`
    sgf += `DT[${gameRecord.date}]`
    sgf += `RE[${gameRecord.result}]`
    
    if (gameRecord.handicap) {
      sgf += `HA[${gameRecord.handicap}]`
    }
    if (gameRecord.komi) {
      sgf += `KM[${gameRecord.komi}]`
    }
    
    sgf += `SZ[${gameRecord.moves.length > 0 ? 19 : gameRecord.metadata?.boardSize || 19}]`
    
    // 棋谱步骤
    let moveCount = 0
    for (const move of gameRecord.moves) {
      moveCount++
      const sgfPos = this.positionToSgf(move.position.row, move.position.col)
      sgf += move.color === 'black' ? `B[${sgfPos}]` : `W[${sgfPos}]`
    }
    
    sgf += `)`

    return sgf
  }

  /**
   * 解析SGF格式的棋谱
   */
  static parseSgf(sgf: string): Partial<GameRecord> {
    // 简化的SGF解析器
    const result: Partial<GameRecord> = {
      moves: [],
      metadata: { boardSize: 19 }
    }

    // 提取基本信息
    const pbMatch = sgf.match(/PB\[([^\]]+)\]/)
    if (pbMatch) result.blackPlayer = pbMatch[1]

    const pwMatch = sgf.match(/PW\[([^\]]+)\]/)
    if (pwMatch) result.whitePlayer = pwMatch[1]

    const dtMatch = sgf.match(/DT\[([^\]]+)\]/)
    if (dtMatch) result.date = dtMatch[1]

    const reMatch = sgf.match(/RE\[([^\]]+)\]/)
    if (reMatch) result.result = reMatch[1]

    const kmMatch = sgf.match(/KM\[([^\]]+)\]/)
    if (kmMatch) result.komi = parseFloat(kmMatch[1])

    const szMatch = sgf.match(/SZ\[([^\]]+)\]/)
    if (szMatch) result.metadata!.boardSize = parseInt(szMatch[1])

    // 提取棋谱步骤
    const moveMatches = sgf.match(/(?:B\[([^\]]+)\]|W\[([^\]]+)\])/g) || []
    
    moveMatches.forEach((match, index) => {
      const blackMatch = match.match(/B\[([^\]]+)\]/)
      const whiteMatch = match.match(/W\[([^\]]+)\]/)
      
      const sgfPos = blackMatch ? blackMatch[1] : whiteMatch![1]
      const color = blackMatch ? 'black' : 'white'
      
      try {
        const position = this.sgfToPosition(sgfPos, result.metadata!.boardSize || 19)
        result.moves!.push({
          moveNumber: index + 1,
          position,
          color
        })
      } catch (error) {
        console.warn(`Failed to parse move ${index + 1}: ${sgfPos}`, error)
      }
    })

    return result
  }
}

/**
 * 棋盘工具函数
 */
export class BoardUtils {
  /**
   * 创建空棋盘
   */
  static createEmptyBoard(size: number = 19): StoneType[][] {
    return Array(size).fill(null).map(() => Array(size).fill(null))
  }

  /**
   * 复制棋盘状态
   */
  static cloneBoard(board: StoneType[][]): StoneType[][] {
    return board.map(row => [...row])
  }

  /**
   * 检查位置是否在棋盘内
   */
  static isValidPosition(row: number, col: number, boardSize: number = 19): boolean {
    return row >= 0 && row < boardSize && col >= 0 && col < boardSize
  }

  /**
   * 获取相邻位置
   */
  static getAdjacentPositions(row: number, col: number, boardSize: number = 19): Position[] {
    const adjacent: Position[] = []
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]] // 上下左右
    
    for (const [dr, dc] of directions) {
      const newRow = row + dr
      const newCol = col + dc
      
      if (this.isValidPosition(newRow, newCol, boardSize)) {
        adjacent.push({ row: newRow, col: newCol })
      }
    }
    
    return adjacent
  }

  /**
   * 计算气（liberty）
   */
  static countLiberties(board: StoneType[][], row: number, col: number, boardSize: number = 19): number {
    if (board[row][col] === null) return 0
    
    const color = board[row][col]
    const visited = new Set<string>()
    const queue: Position[] = [{ row, col }]
    let liberties = 0

    while (queue.length > 0) {
      const current = queue.shift()!
      const key = `${current.row},${current.col}`
      
      if (visited.has(key)) continue
      visited.add(key)
      
      const adjacent = this.getAdjacentPositions(current.row, current.col, boardSize)
      
      for (const adj of adjacent) {
        if (board[adj.row][adj.col] === null) {
          liberties++
        } else if (board[adj.row][adj.col] === color) {
          queue.push(adj)
        }
      }
    }
    
    return liberties
  }

  /**
   * 检查是否为有效着法
   */
  static isValidMove(board: StoneType[][], row: number, col: number, color: 'black' | 'white', boardSize: number = 19): boolean {
    // 位置已被占用
    if (board[row][col] !== null) return false
    
    // 临时放置棋子
    const newBoard = this.cloneBoard(board)
    newBoard[row][col] = color
    
    // 检查是否有气
    if (this.countLiberties(newBoard, row, col, boardSize) > 0) return true
    
    // 检查是否能提掉对方棋子
    const adjacent = this.getAdjacentPositions(row, col, boardSize)
    const opponentColor = color === 'black' ? 'white' : 'black'
    
    for (const adj of adjacent) {
      if (board[adj.row][adj.col] === opponentColor) {
        if (this.countLiberties(newBoard, adj.row, adj.col, boardSize) === 0) {
          return true
        }
      }
    }
    
    return false
  }
}

/**
 * 数据验证工具
 */
export class ValidationUtils {
  /**
   * 验证棋谱数据
   */
  static validateGameRecord(gameRecord: Partial<GameRecord>): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!gameRecord.blackPlayer) {
      errors.push('黑棋玩家名称不能为空')
    }

    if (!gameRecord.whitePlayer) {
      errors.push('白棋玩家名称不能为空')
    }

    if (!gameRecord.result) {
      errors.push('对局结果不能为空')
    }

    if (gameRecord.moves) {
      for (let i = 0; i < gameRecord.moves.length; i++) {
        const move = gameRecord.moves[i]
        if (!move.position || !BoardUtils.isValidPosition(move.position.row, move.position.col)) {
          errors.push(`第${i + 1}步：无效的位置`)
        }
        if (move.color !== 'black' && move.color !== 'white') {
          errors.push(`第${i + 1}步：无效的棋子颜色`)
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * 验证URL
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  /**
   * 验证棋盘大小
   */
  static isValidBoardSize(size: number): boolean {
    return [9, 13, 19].includes(size)
  }
}

/**
 * 数据转换工具
 */
export class DataTransformUtils {
  /**
   * 将棋谱转换为棋盘状态数组
   */
  static gameRecordToBoardStates(gameRecord: GameRecord): StoneType[][][] {
    const boardStates: StoneType[][][] = []
    const boardSize = 19 // 默认19路棋盘
    
    // 初始空棋盘
    boardStates.push(BoardUtils.createEmptyBoard(boardSize))
    
    let currentBoard = BoardUtils.createEmptyBoard(boardSize)
    
    for (const move of gameRecord.moves) {
      const newBoard = BoardUtils.cloneBoard(currentBoard)
      newBoard[move.position.row][move.position.col] = move.color
      currentBoard = newBoard
      boardStates.push(BoardUtils.cloneBoard(currentBoard))
    }
    
    return boardStates
  }

  /**
   * 生成棋谱摘要
   */
  static generateGameSummary(gameRecord: GameRecord): string {
    const moveCount = gameRecord.moves.length
    const players = `${gameRecord.blackPlayer} vs ${gameRecord.whitePlayer}`
    const result = gameRecord.result
    
    return `${players} - ${moveCount}手 - ${result}`
  }

  /**
   * 格式化日期
   */
  static formatDate(dateString: string): string {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    } catch {
      return dateString
    }
  }
}