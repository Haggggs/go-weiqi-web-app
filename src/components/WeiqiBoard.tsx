import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { placeStone, undoMove } from '@/slices/weiqiSlice'

interface Position {
  row: number
  col: number
}

interface CellProps {
  row: number
  col: number
  onPlaceStone: (row: number, col: number) => void
}

const Cell: React.FC<CellProps> = ({ row, col, onPlaceStone }) => {
  const stone = useSelector((state: RootState) => state.weiqi.stones[row][col])
  const lastMove = useSelector((state: RootState) => state.weiqi.lastMove)
  const currentPlayer = useSelector((state: RootState) => state.weiqi.currentPlayer)

  const isLastMove = lastMove?.row === row && lastMove?.col === col
  const stoneColor = stone === 'black' ? 'weiqi-stone-black' : 'weiqi-stone-white'
  
  return (
    <div
      className={`relative w-full h-full cursor-pointer hover:bg-gray-200 transition-colors ${
        isLastMove ? 'bg-yellow-100' : ''
      }`}
      onClick={() => onPlaceStone(row, col)}
    >
      {stone && (
        <div
          className={`absolute inset-0 m-1 rounded-full ${stoneColor}`}
        />
      )}
    </div>
  )
}

const WeiqiBoard: React.FC = () => {
  const boardSize = useSelector((state: RootState) => state.weiqi.boardSize)
  const dispatch = useDispatch()

  const handlePlaceStone = (row: number, col: number) => {
    dispatch(placeStone({ row, col }))
  }

  const handleUndo = () => {
    dispatch(undoMove())
  }

  const cellSize = 30
  const boardSizePixels = cellSize * boardSize
  const margin = 30

  // 绘制棋盘网格线
  const renderGridLines = () => {
    const lines = []
    for (let i = 0; i < boardSize; i++) {
      // 垂直线
      lines.push(
        <line
          key={`v-${i}`}
          x1={margin + i * cellSize}
          y1={margin}
          x2={margin + i * cellSize}
          y2={boardSizePixels - margin}
          className="weiqi-grid-line"
        />
      )
      // 水平线
      lines.push(
        <line
          key={`h-${i}`}
          x1={margin}
          y1={margin + i * cellSize}
          x2={boardSizePixels - margin}
          y2={margin + i * cellSize}
          className="weiqi-grid-line"
        />
      )
    }
    return lines
  }

  // 绘制星位
  const renderStarPoints = () => {
    const starPoints = []
    if (boardSize === 19) {
      // 19路棋盘的星位
      const starPositions = [3, 9, 15]
      starPositions.forEach(row => {
        starPositions.forEach(col => {
          starPoints.push(
            <circle
              key={`star-${row}-${col}`}
              cx={margin + col * cellSize}
              cy={margin + row * cellSize}
              r={3}
              fill="#8b7355"
            />
          )
        })
      })
    }
    return starPoints
  }

  // 绘制坐标
  const renderCoordinates = () => {
    const coordinates = []
    const letters = 'ABCDEFGHJKLMNOPQRST' // 跳过I
    
    // 列坐标 (A-T)
    for (let i = 0; i < boardSize; i++) {
      coordinates.push(
        <text
          key={`coord-x-${i}`}
          x={margin + i * cellSize}
          y={boardSizePixels - margin + 15}
          textAnchor="middle"
          className="weiqi-coordinate"
        >
          {letters[i]}
        </text>
      )
    }
    
    // 行坐标 (1-19)
    for (let i = 0; i < boardSize; i++) {
      coordinates.push(
        <text
          key={`coord-y-${i}`}
          x={margin - 15}
          y={margin + i * cellSize + 4}
          textAnchor="middle"
          className="weiqi-coordinate"
        >
          {boardSize - i}
        </text>
      )
    }
    
    return coordinates
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        <button
          onClick={handleUndo}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          disabled={useSelector((state: RootState) => state.weiqi.gameHistory.length) === 0}
        >
          悔棋
        </button>
      </div>
      
      <div className="weiqi-board rounded-lg overflow-hidden">
        <svg
          width={boardSizePixels + 2 * margin}
          height={boardSizePixels + 2 * margin}
          viewBox={`0 0 ${boardSizePixels + 2 * margin} ${boardSizePixels + 2 * margin}`}
        >
          {/* 背景棋盘 */}
          <rect
            x={margin}
            y={margin}
            width={boardSizePixels - 2 * margin}
            height={boardSizePixels - 2 * margin}
            fill="#deb887"
          />
          
          {/* 网格线 */}
          {renderGridLines()}
          
          {/* 星位 */}
          {renderStarPoints()}
          
          {/* 坐标 */}
          {renderCoordinates()}
        </svg>
        
        {/* 棋子网格 */}
        <div
          className="grid absolute inset-0"
          style={{
            gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
            width: boardSizePixels + 2 * margin,
            height: boardSizePixels + 2 * margin,
            marginLeft: margin,
            marginTop: margin,
          }}
        >
          {Array(boardSize * boardSize).fill(null).map((_, index) => {
            const row = Math.floor(index / boardSize)
            const col = index % boardSize
            return (
              <Cell
                key={index}
                row={row}
                col={col}
                onPlaceStone={handlePlaceStone}
              />
            )
          })}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>点击棋盘交叉点落子，当前回合: {useSelector((state: RootState) => state.weiqi.currentPlayer === 'black' ? '黑棋' : '白棋')}</p>
      </div>
    </div>
  )
}

export default WeiqiBoard