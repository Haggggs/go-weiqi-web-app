import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { resetBoard } from '@/slices/weiqiSlice'

const Header: React.FC = () => {
  const currentPlayer = useSelector((state: RootState) => state.weiqi.currentPlayer)
  const captured = useSelector((state: RootState) => state.weiqi.captured)
  const dispatch = useDispatch()

  const getCurrentPlayerColor = () => {
    return currentPlayer === 'black' ? '黑棋' : '白棋'
  }

  const getPlayerColorClass = () => {
    return currentPlayer === 'black' ? 'text-black' : 'text-gray-600'
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">围棋Web应用</h1>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">当前回合</p>
              <p className={`text-lg font-semibold ${getPlayerColorClass()}`}>
                {getCurrentPlayerColor()}
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">提子</p>
              <p className="text-lg font-semibold text-black">黑: {captured.black}</p>
              <p className="text-lg font-semibold text-gray-600">白: {captured.white}</p>
            </div>
            
            <button
              onClick={() => dispatch(resetBoard())}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              重新开始
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header