import React, { useState, useEffect, useRef } from 'react';

interface TimerProps {
  initialTime?: number; // 秒为单位
  isRunning: boolean;
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ 
  initialTime = 3600, // 默认1小时
  isRunning, 
  onTimeUp 
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setTimeLeft(initialTime);
    setIsPaused(false);
  };

  const progress = (timeLeft / initialTime) * 100;
  const isLow = timeLeft < 300; // 少于5分钟变红

  return (
    <div className="timer-container">
      <div className="timer-display">
        <div 
          className="timer-bar"
          style={{ 
            width: `${progress}%`,
            backgroundColor: isLow ? '#ef4444' : '#22c55e'
          }}
        />
        <span className={`timer-text ${isLow ? 'timer-low' : ''}`}>
          {formatTime(timeLeft)}
        </span>
      </div>
      
      <div className="timer-controls">
        <button 
          onClick={handlePause}
          className={`timer-btn ${isPaused ? 'play' : 'pause'}`}
        >
          {isPaused ? '▶️ 继续' : '⏸️ 暂停'}
        </button>
        <button onClick={handleReset} className="timer-btn reset">
          🔄 重置
        </button>
      </div>

      <style>{`
        .timer-container {
          padding: 10px;
          background: #f9fafb;
          border-radius: 8px;
        }
        .timer-display {
          position: relative;
          height: 40px;
          background: #e5e7eb;
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .timer-bar {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          transition: width 1s linear, background-color 0.3s;
        }
        .timer-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
          z-index: 1;
        }
        .timer-text.timer-low {
          color: #ef4444;
          animation: blink 1s infinite;
        }
        @keyframes blink {
          50% { opacity: 0.5; }
        }
        .timer-controls {
          display: flex;
          gap: 8px;
        }
        .timer-btn {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          transition: background 0.2s;
        }
        .timer-btn.pause {
          background: #fbbf24;
          color: #1f2937;
        }
        .timer-btn.play {
          background: #22c55e;
          color: white;
        }
        .timer-btn.reset {
          background: #6b7280;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Timer;
