import React, { useState } from 'react'

const SimpleWeiqiBoard: React.FC = () => {
  const [stones, setStones] = useState<Array<Array<'black' | 'white' | null>>>(Array(19).fill(null).map(() => Array(19).fill(null)))
  const [currentPlayer, setCurrentPlayer] = useState<'black' | 'white'>('black')

  const handlePlaceStone = (row: number, col: number) => {
    if (stones[row][col] === null) {
      const newStones = [...stones]
      newStones[row] = [...stones[row]]
      newStones[row][col] = currentPlayer
      setStones(newStones)
      setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black')
    }
  }

  const cellSize = 30
  const boardSizePixels = cellSize * (19 - 1)  // 19×19棋盘只有18个间隔
  const margin = 30

  return (
    <div className="weiqi-board-container">
      <div className="relative bg-amber-100 p-6 rounded-lg shadow-lg">
        <svg
          width={boardSizePixels + 2 * margin}
          height={boardSizePixels + 2 * margin}
          viewBox={`0 0 ${boardSizePixels + 2 * margin} ${boardSizePixels + 2 * margin}`}
        >
          <rect
            x={margin}
            y={margin}
            width={boardSizePixels}
            height={boardSizePixels}
            fill="#deb887"
          />
          
          {/* 网格线 */}
          {Array(19).fill(null).map((_, i) => (
            <>
              <line
                key={`v-${i}`}
                x1={margin + i * cellSize}
                y1={margin}
                x2={margin + i * cellSize}
                y2={margin + 18 * cellSize}
                stroke="#8b7355"
                strokeWidth="1"
              />
              <line
                key={`h-${i}`}
                x1={margin}
                y1={margin + i * cellSize}
                x2={margin + 18 * cellSize}
                y2={margin + i * cellSize}
                stroke="#8b7355"
                strokeWidth="1"
              />
            </>
          ))}
        </svg>
        
        {/* 棋子层 */}
        <div className="absolute" style={{ left: margin, top: margin, width: boardSizePixels, height: boardSizePixels }}>
          {stones.map((row, rowIndex) =>
            row.map((stone, colIndex) => {
              if (stone) {
                const stoneSize = cellSize * 0.8
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="absolute"
                    style={{
                      left: margin + colIndex * cellSize - stoneSize / 2,
                      top: margin + rowIndex * cellSize - stoneSize / 2,
                      width: stoneSize,
                      height: stoneSize,
                    }}
                  >
                    <div className={`w-full h-full rounded-full ${
                      stone === 'black' ? 'bg-black' : 'bg-white border border-gray-300'
                    }`} />
                  </div>
                )
              }
              return null
            })
          )}
        </div>
        
        {/* 点击层 */}
        <div 
          className="absolute"
          style={{
            left: margin,
            top: margin,
            width: boardSizePixels,
            height: boardSizePixels,
          }}
        >
          {Array(19).fill(null).map((_, rowIndex) =>
            Array(19).fill(null).map((_, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="absolute cursor-crosshair"
                style={{
                  left: margin + colIndex * cellSize - 10,
                  top: margin + rowIndex * cellSize - 10,
                  width: 20,
                  height: 20,
                }}
                onClick={() => handlePlaceStone(rowIndex, colIndex)}
              />
            ))
          )}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>当前回合: {currentPlayer === 'black' ? '黑棋' : '白棋'}</p>
      </div>
    </div>
  )
}

export default SimpleWeiqiBoard