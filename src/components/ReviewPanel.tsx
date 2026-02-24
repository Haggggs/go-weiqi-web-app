import React, { useState, useEffect } from 'react';

interface Move {
  row: number;
  col: number;
  color: 'black' | 'white';
  moveNumber: number;
  timestamp?: number;
}

interface ReviewPanelProps {
  moves: Move[];
  currentMove: number;
  onGoToMove: (moveNumber: number) => void;
  onPrevMove: () => void;
  onNextMove: () => void;
  onJumpToStart: () => void;
  onJumpToEnd: () => void;
  board: Array<Array<'black' | 'white' | null>>;
  enabled: boolean;
}

const ReviewPanel: React.FC<ReviewPanelProps> = ({
  moves,
  currentMove,
  onGoToMove,
  onPrevMove,
  onNextMove,
  onJumpToStart,
  onJumpToEnd,
  board,
  enabled
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [markedMoves, setMarkedMoves] = useState<number[]>([]);

  // 标记关键手
  const toggleMarkMove = (moveNum: number) => {
    if (markedMoves.includes(moveNum)) {
      setMarkedMoves(markedMoves.filter(m => m !== moveNum));
    } else {
      setMarkedMoves([...markedMoves, moveNum]);
    }
  };

  // 获取指定手数的棋盘状态
  const getBoardAtMove = (moveNum: number): Array<Array<'black' | 'white' | null>> => {
    const tempBoard = Array(19).fill(null).map(() => Array(19).fill(null));
    for (let i = 0; i < moveNum && i < moves.length; i++) {
      const move = moves[i];
      if (move.row >= 0 && move.row < 19 && move.col >= 0 && move.col < 19) {
        tempBoard[move.row][move.col] = move.color;
      }
    }
    return tempBoard;
  };

  // 导航到指定手数并显示该手时的棋盘
  const goToMoveAndShow = (moveNum: number) => {
    onGoToMove(moveNum);
  };

  if (!enabled) return null;

  const totalMoves = moves.length;
  const isAtStart = currentMove === 0;
  const isAtEnd = currentMove >= totalMoves;

  return (
    <div className="review-panel">
      <h4 className="review-title">📻 复盘功能</h4>

      {/* 进度条 */}
      <div className="review-progress">
        <div 
          className="progress-bar"
          style={{ width: `${totalMoves > 0 ? (currentMove / totalMoves) * 100 : 0}%` }}
        />
        <span className="progress-text">
          {currentMove} / {totalMoves} 手
        </span>
      </div>

      {/* 导航控制 */}
      <div className="review-controls">
        <button onClick={onJumpToStart} disabled={isAtStart} className="control-btn" title="第一手">
          ⏮️
        </button>
        <button onClick={onPrevMove} disabled={isAtStart} className="control-btn" title="上一手">
          ◀️
        </button>
        <button onClick={onNextMove} disabled={isAtEnd} className="control-btn" title="下一手">
          ▶️
        </button>
        <button onClick={onJumpToEnd} disabled={isAtEnd} className="control-btn" title="最后一手">
          ⏭️
        </button>
      </div>

      {/* 快捷跳转 */}
      <div className="review-jumps">
        <button 
          className="jump-btn"
          onClick={() => goToMoveAndShow(Math.floor(totalMoves * 0.25))}
          disabled={totalMoves === 0}
        >
          25%
        </button>
        <button 
          className="jump-btn"
          onClick={() => goToMoveAndShow(Math.floor(totalMoves * 0.5))}
          disabled={totalMoves === 0}
        >
          50%
        </button>
        <button 
          className="jump-btn"
          onClick={() => goToMoveAndShow(Math.floor(totalMoves * 0.75))}
          disabled={totalMoves === 0}
        >
          75%
        </button>
        <button 
          className="jump-btn"
          onClick={() => goToMoveAndShow(totalMoves)}
          disabled={totalMoves === 0}
        >
          终局
        </button>
      </div>

      {/* 手动输入跳转 */}
      <div className="review-input">
        <input
          type="number"
          min={0}
          max={totalMoves}
          value={currentMove}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 0;
            if (val >= 0 && val <= totalMoves) {
              goToMoveAndShow(val);
            }
          }}
          className="move-input"
        />
        <span className="move-total">/ {totalMoves}</span>
      </div>

      {/* 展开/收起历史记录 */}
      <button 
        className="history-toggle"
        onClick={() => setShowHistory(!showHistory)}
      >
        📜 {showHistory ? '收起' : '展开'} 历史记录 ({totalMoves}手)
      </button>

      {/* 历史记录列表 */}
      {showHistory && (
        <div className="history-list">
          {moves.map((move, idx) => (
            <div 
              key={idx}
              className={`history-item ${idx === currentMove ? 'active' : ''} ${markedMoves.includes(idx) ? 'marked' : ''}`}
              onClick={() => goToMoveAndShow(idx)}
            >
              <span className="move-num">{move.moveNumber}.</span>
              <span className={`move-color ${move.color}`}>
                {move.color === 'black' ? '⚫' : '⚪'}
              </span>
              <span className="move-coord">
                {String.fromCharCode(65 + move.col)}{19 - move.row}
              </span>
              {markedMoves.includes(idx) && <span className="star">⭐</span>}
              <button 
                className="mark-btn"
                onClick={(e) => { e.stopPropagation(); toggleMarkMove(idx); }}
              >
                {markedMoves.includes(idx) ? '★' : '☆'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 统计信息 */}
      {totalMoves > 0 && (
        <div className="review-stats">
          <div className="stat-item">
            <span className="stat-label">黑:</span>
            <span className="stat-value">
              {moves.filter(m => m.color === 'black').length}手
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">白:</span>
            <span className="stat-value">
              {moves.filter(m => m.color === 'white').length}手
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">标记:</span>
            <span className="stat-value">{markedMoves.length}手</span>
          </div>
        </div>
      )}

      <style>{`
        .review-panel {
          padding: 12px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          max-height: 400px;
          overflow-y: auto;
        }
        .review-title {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: bold;
          color: #1f2937;
        }
        .review-progress {
          position: relative;
          height: 24px;
          background: #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 12px;
        }
        .progress-bar {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transition: width 0.3s;
        }
        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 12px;
          font-weight: bold;
          color: #1f2937;
          z-index: 1;
        }
        .review-controls {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        .control-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 8px;
          background: #f3f4f6;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s;
        }
        .control-btn:hover:not(:disabled) {
          background: #e5e7eb;
          transform: scale(1.05);
        }
        .control-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .review-jumps {
          display: flex;
          gap: 4px;
          margin-bottom: 12px;
        }
        .jump-btn {
          flex: 1;
          padding: 6px;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 11px;
          color: #6b7280;
        }
        .jump-btn:hover:not(:disabled) {
          background: #f3f4f6;
        }
        .jump-btn:disabled {
          opacity: 0.5;
        }
        .review-input {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .move-input {
          width: 60px;
          padding: 8px;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          text-align: center;
          font-size: 14px;
        }
        .move-total {
          font-size: 14px;
          color: #6b7280;
        }
        .history-toggle {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 6px;
          background: #eff6ff;
          color: #3b82f6;
          cursor: pointer;
          font-size: 13px;
          margin-bottom: 8px;
        }
        .history-list {
          max-height: 200px;
          overflow-y: auto;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
        }
        .history-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 8px;
          border-bottom: 1px solid #f3f4f6;
          cursor: pointer;
          font-size: 12px;
        }
        .history-item:hover {
          background: #f9fafb;
        }
        .history-item.active {
          background: #dbeafe;
        }
        .history-item.marked {
          background: #fef3c7;
        }
        .move-num {
          font-weight: bold;
          color: #6b7280;
          min-width: 24px;
        }
        .move-color {
          font-size: 14px;
        }
        .move-coord {
          font-family: monospace;
          color: #1f2937;
        }
        .star {
          color: #f59e0b;
        }
        .mark-btn {
          margin-left: auto;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: #f59e0b;
        }
        .review-stats {
          display: flex;
          justify-content: space-around;
          padding: 10px;
          background: #f9fafb;
          border-radius: 6px;
          margin-top: 12px;
        }
        .stat-item {
          text-align: center;
        }
        .stat-label {
          font-size: 11px;
          color: #6b7280;
        }
        .stat-value {
          display: block;
          font-size: 14px;
          font-weight: bold;
          color: #1f2937;
        }
      `}</style>
    </div>
  );
};

export default ReviewPanel;
