import React from 'react'

interface PlayerInfo {
  id: string
  name: string
  rank: string
  rating: number
  avatar: string
  isOnline: boolean
  wins: number
  losses: number
  winRate: number
}

interface PlayerSidebarProps {
  blackPlayer: PlayerInfo
  whitePlayer: PlayerInfo
  currentPlayer: 'black' | 'white'
  gameStartTime: Date
  gameMoves: number
}

const PlayerSidebar: React.FC<PlayerSidebarProps> = ({
  blackPlayer,
  whitePlayer,
  currentPlayer,
  gameStartTime,
  gameMoves
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const calculateGameDuration = () => {
    const now = new Date()
    const duration = Math.floor((now.getTime() - gameStartTime.getTime()) / 1000)
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-64 bg-white rounded-lg shadow-lg p-6 h-fit">
      <h2 className="text-lg font-bold text-gray-800 mb-4">选手信息</h2>
      
      {/* 黑棋选手 */}
      <div className={`mb-6 p-4 rounded-lg border-2 ${
        currentPlayer === 'black' ? 'border-black bg-gray-50' : 'border-gray-200'
      }`}>
        <div className="flex items-center mb-3">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            blackPlayer.isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`} />
          <img 
            src={blackPlayer.avatar} 
            alt={blackPlayer.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h3 className="font-semibold text-black">{blackPlayer.name}</h3>
            <p className="text-xs text-gray-500">{blackPlayer.rank}</p>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">等级分:</span>
            <span className="font-medium">{blackPlayer.rating}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">胜场:</span>
            <span className="font-medium">{blackPlayer.wins}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">负场:</span>
            <span className="font-medium">{blackPlayer.losses}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">胜率:</span>
            <span className="font-medium">{blackPlayer.winRate}%</span>
          </div>
        </div>
      </div>

      {/* 白棋选手 */}
      <div className={`mb-6 p-4 rounded-lg border-2 ${
        currentPlayer === 'white' ? 'border-gray-600 bg-gray-50' : 'border-gray-200'
      }`}>
        <div className="flex items-center mb-3">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            whitePlayer.isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`} />
          <img 
            src={whitePlayer.avatar} 
            alt={whitePlayer.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h3 className="font-semibold text-gray-600">{whitePlayer.name}</h3>
            <p className="text-xs text-gray-500">{whitePlayer.rank}</p>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">等级分:</span>
            <span className="font-medium">{whitePlayer.rating}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">胜场:</span>
            <span className="font-medium">{whitePlayer.wins}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">负场:</span>
            <span className="font-medium">{whitePlayer.losses}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">胜率:</span>
            <span className="font-medium">{whitePlayer.winRate}%</span>
          </div>
        </div>
      </div>

      {/* 游戏状态 */}
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-800 mb-3">对局状态</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">开始时间:</span>
            <span className="font-medium">{formatTime(gameStartTime)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">进行时长:</span>
            <span className="font-medium">{calculateGameDuration()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">手数:</span>
            <span className="font-medium">{gameMoves} 手</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">当前回合:</span>
            <span className={`font-medium ${
              currentPlayer === 'black' ? 'text-black' : 'text-gray-600'
            }`}>
              {currentPlayer === 'black' ? '黑棋' : '白棋'}
            </span>
          </div>
        </div>
      </div>

      {/* 在线状态 */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center text-xs text-gray-500">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            blackPlayer.isOnline && whitePlayer.isOnline ? 'bg-green-500' : 'bg-yellow-500'
          }`} />
          {blackPlayer.isOnline && whitePlayer.isOnline ? '双方在线' : '等待对手上线...'}
        </div>
      </div>
    </div>
  )
}

export default PlayerSidebar