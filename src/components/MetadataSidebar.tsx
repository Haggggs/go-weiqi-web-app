import React from 'react'

interface GameMetadata {
  id: string
  title: string
  tournament?: string
  rules: string
  komi: number
  timeControl: string
  handicap?: number
  boardSize: number
  createdAt: Date
  lastMoveAt?: Date
  gameStatus: 'playing' | 'finished' | 'paused'
  blackTime: number
  whiteTime: number
  captures: {
    black: number
    white: number
  }
}

interface MetadataSidebarProps {
  metadata: GameMetadata
  onGameAction: (action: 'pause' | 'resume' | 'resign' | 'pass') => void
  gameHistory: string[]
  currentMove: number
}

const MetadataSidebar: React.FC<MetadataSidebarProps> = ({
  metadata,
  onGameAction,
  gameHistory,
  currentMove
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusColor = () => {
    switch (metadata.gameStatus) {
      case 'playing':
        return 'text-green-600 bg-green-100'
      case 'finished':
        return 'text-red-600 bg-red-100'
      case 'paused':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = () => {
    switch (metadata.gameStatus) {
      case 'playing':
        return '进行中'
      case 'finished':
        return '已结束'
      case 'paused':
        return '已暂停'
      default:
        return '未知状态'
    }
  }

  return (
    <div className="w-64 bg-white rounded-lg shadow-lg p-6 h-fit">
      <h2 className="text-lg font-bold text-gray-800 mb-4">对局信息</h2>
      
      {/* 对局标题 */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{metadata.title}</h3>
        {metadata.tournament && (
          <p className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
            {metadata.tournament}
          </p>
        )}
      </div>

      {/* 基本信息 */}
      <div className="mb-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">规则:</span>
          <span className="font-medium">{metadata.rules}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">贴目:</span>
          <span className="font-medium">{metadata.komi} 目</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">计时:</span>
          <span className="font-medium">{metadata.timeControl}</span>
        </div>
        {metadata.handicap && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">让子:</span>
            <span className="font-medium">{metadata.handicap} 子</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">棋盘:</span>
          <span className="font-medium">{metadata.boardSize}×{metadata.boardSize}</span>
        </div>
      </div>

      {/* 状态信息 */}
      <div className="mb-6">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </div>
      </div>

      {/* 剩余时间 */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">剩余时间</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-black rounded-full mr-2" />
              <span className="text-sm">黑棋</span>
            </div>
            <span className="font-medium">{formatTime(metadata.blackTime)}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-white border border-gray-300 rounded-full mr-2" />
              <span className="text-sm">白棋</span>
            </div>
            <span className="font-medium">{formatTime(metadata.whiteTime)}</span>
          </div>
        </div>
      </div>

      {/* 吃子统计 */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">吃子统计</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-black rounded-full mr-2" />
              <span className="text-sm">黑棋</span>
            </div>
            <span className="font-medium">{metadata.captures.black} 子</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-white border border-gray-300 rounded-full mr-2" />
              <span className="text-sm">白棋</span>
            </div>
            <span className="font-medium">{metadata.captures.white} 子</span>
          </div>
        </div>
      </div>

      {/* 进度信息 */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">对局进度</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">总手数:</span>
            <span className="font-medium">{gameHistory.length} 手</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">当前手数:</span>
            <span className="font-medium">{currentMove + 1} / {gameHistory.length}</span>
          </div>
          {metadata.lastMoveAt && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">最后落子:</span>
              <span className="font-medium">
                {metadata.lastMoveAt.toLocaleTimeString('zh-CN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 游戏控制按钮 */}
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-800 mb-3">游戏操作</h3>
        <div className="space-y-2">
          <button
            onClick={() => onGameAction('pass')}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
          >
            判定虚手 (Pass)
          </button>
          <button
            onClick={() => metadata.gameStatus === 'playing' ? onGameAction('pause') : onGameAction('resume')}
            className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm"
          >
            {metadata.gameStatus === 'playing' ? '暂停对局' : '继续对局'}
          </button>
          <button
            onClick={() => onGameAction('resign')}
            className="w-full px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
          >
            认输
          </button>
        </div>
      </div>

      {/* 创建时间 */}
      <div className="mt-4 pt-4 border-t text-xs text-gray-500">
        <p>创建于: {metadata.createdAt.toLocaleString('zh-CN')}</p>
      </div>
    </div>
  )
}

export default MetadataSidebar