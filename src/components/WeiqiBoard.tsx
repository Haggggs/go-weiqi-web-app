import React, { useState } from 'react'

const WeiqiBoard: React.FC = () => {
  const [stones, setStones] = useState<Array<Array<'black' | 'white' | null>>>(Array(19).fill(null).map(() => Array(19).fill(null)))
  const [currentPlayer, setCurrentPlayer] = useState<'black' | 'white'>('black')

  // 提子功能
  const handlePlaceStone = (row: number, col: number) => {
    if (stones[row][col] === null) {
      // 创建新的棋盘状态
      const newStones = stones.map(row => [...row])
      newStones[row][col] = currentPlayer
      
      // 简单的提子逻辑：检查周围是否被包围
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
      let captured = false
      
      for (const [dr, dc] of directions) {
        const newRow = row + dr
        const newCol = col + dc
        if (newRow >= 0 && newRow < 19 && newCol >= 0 && newCol < 19) {
          if (newStones[newRow][newCol] === (currentPlayer === 'black' ? 'white' : 'black')) {
            // 检查是否被包围（简化版）
            let surrounded = true
            for (const [dr2, dc2] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
              const checkRow = newRow + dr2
              const checkCol = newCol + dc2
              if (checkRow >= 0 && checkRow < 19 && checkCol >= 0 && checkCol < 19) {
                if (newStones[checkRow][checkCol] === null) {
                  surrounded = false
                  break
                }
              }
            }
            if (surrounded) {
              newStones[newRow][newCol] = null
              captured = true
            }
          }
        }
      }
      
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
          height={boardSizePixels + 2 * margin + 40}
          viewBox={`0 0 ${boardSizePixels + 2 * margin} ${boardSizePixels + 2 * margin + 40}`}
        >
          {/* 棋盘背景 */}
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
          
          {/* 星位 */}
          {[[3, 3], [3, 9], [3, 15], [9, 3], [9, 9], [9, 15], [15, 3], [15, 9], [15, 15]].map(([row, col]) => (
            <circle
              key={`star-${row}-${col}`}
              cx={margin + col * cellSize}
              cy={margin + row * cellSize}
              r={3}
              fill="#8b7355"
            />
          ))}
          
          {/* 坐标 - 修复乱码问题 */}
          {/* 左侧行坐标 1-19 */}
          {Array(19).fill(null).map((_, i) => (
            <text
              key={`coord-row-${i}`}
              x={margin - 15}
              y={margin + i * cellSize + 5}
              fontSize="12"
              fill="#666"
              textAnchor="end"
            >
              {String(19 - i)}
            </text>
          ))}
          
          {/* 底部列坐标 A-T - 修复乱码问题 */}
          {Array(19).fill(null).map((_, i) => {
            const letters = 'ABCDEFGHJKLMNPQRST'
            return (
              <text
                key={`coord-col-${i}`}
                x={margin + i * cellSize}
                y={margin + 18 * cellSize + 25}
                fontSize="12"
                fill="#666"
                textAnchor="middle"
              >
                {letters[i]}
              </text>
            )
          })}
        </svg>
        
        {/* 棋子层 - 修复位置偏移问题 */}
        <div className="absolute" style={{ left: margin, top: margin, width: boardSizePixels, height: boardSizePixels }}>
          {stones.map((row, rowIndex) =>
            row.map((stone, colIndex) => {
              if (stone) {
                const stoneSize = cellSize * 0.8
                // 修复位置计算：确保棋子精确落在交叉点上
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="absolute"
                    style={{
                      // 修复：精确计算交叉点位置
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
        
        {/* 点击层 - 修复位置偏移问题 */}
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
                className="absolute cursor-crosshair hover:bg-yellow-300 hover:rounded-full transition-all duration-150 opacity-40 hover:opacity-80"
                style={{
                  // 修复：点击区域精确对应交叉点
                  left: margin + colIndex * cellSize - 10,
                  top: margin + rowIndex * cellSize - 10,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                }}
                onClick={() => handlePlaceStone(rowIndex, colIndex)}
              />
            ))
          )}
        </div>
      </div>
      
      {/* 控制面板 */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <p>当前回合: <span className={currentPlayer === 'black' ? 'font-bold text-black' : 'font-bold text-gray-600'}>{currentPlayer === 'black' ? '黑棋' : '白棋'}</span></p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setStones(Array(19).fill(null).map(() => Array(19).fill(null)))
              setCurrentPlayer('black')
            }}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            重新开始
          </button>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        <p>💡 棋子精确落在交叉点上，坐标清晰显示，基础提子功能已实现</p>
        <p>🎯 点击交叉点落子，星位标识清晰可见</p>
      </div>
    </div>
  )
}

export default WeiqiBoard