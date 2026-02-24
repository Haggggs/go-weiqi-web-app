import React, { useState } from 'react';

type MarkType = 'circle' | 'triangle' | 'square' | 'cross' | 'plus' | 'dot' | 'label' | 'number';
type MarkColor = 'red' | 'blue' | 'green' | 'black';

interface Mark {
  row: number;
  col: number;
  type: MarkType;
  color: MarkColor;
  label?: string;
}

interface MarkToolProps {
  marks: Mark[];
  onAddMark: (mark: Mark) => void;
  onRemoveMark: (row: number, col: number) => void;
  onClearMarks: () => void;
  onUndo: () => void;
  enabled: boolean;
}

const markIcons: Record<MarkType, string> = {
  circle: '○',
  triangle: '△',
  square: '□',
  cross: '×',
  plus: '┼',
  dot: '•',
  label: 'A',
  number: '1'
};

const colorMap: Record<MarkColor, string> = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  black: '#1f2937'
};

const MarkTool: React.FC<MarkToolProps> = ({
  marks,
  onAddMark,
  onRemoveMark,
  onClearMarks,
  onUndo,
  enabled
}) => {
  const [selectedType, setSelectedType] = useState<MarkType>('circle');
  const [selectedColor, setSelectedColor] = useState<MarkColor>('red');
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [labelText, setLabelText] = useState('A');

  const markTypes: MarkType[] = ['circle', 'triangle', 'square', 'cross', 'plus', 'dot', 'label', 'number'];
  const colors: MarkColor[] = ['red', 'blue', 'green', 'black'];

  if (!enabled) return null;

  return (
    <div className="mark-tool">
      <h4 className="mark-tool-title">🎯 标记工具</h4>
      
      {/* 模式选择 */}
      <div className="mark-mode">
        <button 
          className={`mode-btn ${mode === 'add' ? 'active' : ''}`}
          onClick={() => setMode('add')}
        >
          ➕ 添加
        </button>
        <button 
          className={`mode-btn ${mode === 'remove' ? 'active' : ''}`}
          onClick={() => setMode('remove')}
        >
          ➖ 移除
        </button>
      </div>

      {/* 标记类型 */}
      <div className="mark-types">
        <label className="mark-label">类型:</label>
        <div className="mark-grid">
          {markTypes.map(type => (
            <button
              key={type}
              className={`mark-type-btn ${selectedType === type ? 'selected' : ''}`}
              onClick={() => setSelectedType(type)}
              title={type}
            >
              {markIcons[type]}
            </button>
          ))}
        </div>
      </div>

      {/* 颜色选择 */}
      <div className="mark-colors">
        <label className="mark-label">颜色:</label>
        <div className="color-grid">
          {colors.map(color => (
            <button
              key={color}
              className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
              style={{ backgroundColor: colorMap[color] }}
              onClick={() => setSelectedColor(color)}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* 标签文字输入 (当类型为label时) */}
      {selectedType === 'label' && (
        <div className="mark-label-input">
          <label className="mark-label">文字:</label>
          <input
            type="text"
            value={labelText}
            onChange={(e) => setLabelText(e.target.value.slice(0, 1))}
            maxLength={1}
            className="label-input"
          />
        </div>
      )}

      {/* 已添加的标记列表 */}
      {marks.length > 0 && (
        <div className="marks-list">
          <label className="mark-label">已添加 ({marks.length}):</label>
          <div className="marks-preview">
            {marks.slice(-5).map((mark, idx) => (
              <span 
                key={idx}
                className="mark-preview-item"
                style={{ color: colorMap[mark.color] }}
              >
                {markIcons[mark.type]}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="mark-actions">
        <button onClick={onUndo} className="action-btn">
          ↩️ 撤销
        </button>
        <button onClick={onClearMarks} className="action-btn clear">
          🗑️ 清除全部
        </button>
      </div>

      {/* 提示 */}
      <p className="mark-hint">
        💡 在棋盘上点击添加/移除标记
      </p>

      <style>{`
        .mark-tool {
          padding: 12px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .mark-tool-title {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: bold;
          color: #1f2937;
        }
        .mark-mode {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        .mode-btn {
          flex: 1;
          padding: 8px;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }
        .mode-btn.active {
          border-color: #3b82f6;
          background: #eff6ff;
          color: #3b82f6;
        }
        .mark-label {
          display: block;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 6px;
        }
        .mark-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
          margin-bottom: 12px;
        }
        .mark-type-btn {
          padding: 8px;
          border: 2px solid #e5e7eb;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s;
        }
        .mark-type-btn:hover {
          border-color: #9ca3af;
        }
        .mark-type-btn.selected {
          border-color: #3b82f6;
          background: #eff6ff;
        }
        .color-grid {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        .color-btn {
          width: 28px;
          height: 28px;
          border: 2px solid #e5e7eb;
          border-radius: 50%;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .color-btn:hover {
          transform: scale(1.1);
        }
        .color-btn.selected {
          border-color: #1f2937;
          box-shadow: 0 0 0 2px white, 0 0 0 4px currentColor;
        }
        .mark-label-input {
          margin-bottom: 12px;
        }
        .label-input {
          width: 100%;
          padding: 8px;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          font-size: 14px;
          text-align: center;
        }
        .marks-list {
          margin-bottom: 12px;
        }
        .marks-preview {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        .mark-preview-item {
          font-size: 16px;
          padding: 2px 6px;
          background: #f3f4f6;
          border-radius: 4px;
        }
        .mark-actions {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }
        .action-btn {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 6px;
          background: #f3f4f6;
          cursor: pointer;
          font-size: 12px;
        }
        .action-btn.clear {
          background: #fee2e2;
          color: #ef4444;
        }
        .mark-hint {
          font-size: 11px;
          color: #9ca3af;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export type { Mark, MarkType, MarkColor };
export default MarkTool;
