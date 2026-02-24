import React, { useState } from 'react';

interface SharePanelProps {
  gameData: {
    gameName: string;
    blackPlayer: string;
    whitePlayer: string;
    rules: string;
    komi: number;
    moves: Array<{row: number; col: number; color: 'black' | 'white'}>;
  };
  onShare: (type: 'link' | 'clipboard' | 'qr') => void;
  enabled: boolean;
}

const SharePanel: React.FC<SharePanelProps> = ({ gameData, onShare, enabled }) => {
  const [copied, setCopied] = useState(false);
  const [shareType, setShareType] = useState<'url' | 'text' | 'qr'>('url');

  if (!enabled) return null;

  // 生成棋谱的文本格式 (SGF)
  const generateSGF = (): string => {
    const { gameName, blackPlayer, whitePlayer, rules, komi, moves } = gameData;
    
    let sgf = `(;FF[4]CA[UTF-8]GM[1]SZ[19]`;
    sgf += `RU[${rules === 'chinese' ? 'Chinese' : rules === 'japanese' ? 'Japanese' : 'Korean'}]`;
    sgf += `KM[${komi}]`;
    sgf += `PB[${blackPlayer}]`;
    sgf += `PW[${whitePlayer}]`;
    sgf += `GN[${gameName}]`;
    sgf += `DT[${new Date().toISOString().split('T')[0]}]`;
    
    moves.forEach((move, idx) => {
      const color = move.color === 'black' ? 'B' : 'W';
      const col = String.fromCharCode(97 + move.col);
      const row = String.fromCharCode(97 + move.row);
      sgf += `;${color}[${col}${row}]`;
    });
    
    sgf += ')';
    return sgf;
  };

  // 生成URL编码的分享链接
  const generateShareURL = (): string => {
    const sgf = generateSGF();
    const encoded = btoa(encodeURIComponent(sgf));
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://example.com';
    return `${baseUrl}/share?game=${encoded}`;
  };

  // 复制到剪贴板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onShare('clipboard');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // 复制链接
  const handleCopyLink = () => {
    const url = generateShareURL();
    copyToClipboard(url);
  };

  // 复制SGF文本
  const handleCopySGF = () => {
    const sgf = generateSGF();
    copyToClipboard(sgf);
  };

  // 生成分享文本
  const generateShareText = (): string => {
    const { gameName, blackPlayer, whitePlayer, moves } = gameData;
    return `围棋对局: ${gameName}
黑方: ${blackPlayer}
白方: ${whitePlayer}
手数: ${moves.length}手
${generateShareURL()}`;
  };

  // 复制分享文本
  const handleCopyText = () => {
    const text = generateShareText();
    copyToClipboard(text);
  };

  // 生成二维码数据 (简单实现)
  const generateQRData = (): string => {
    return generateShareURL();
  };

  return (
    <div className="share-panel">
      <h4 className="share-title">📤 棋谱分享</h4>

      {/* 分享类型选择 */}
      <div className="share-tabs">
        <button 
          className={`share-tab ${shareType === 'url' ? 'active' : ''}`}
          onClick={() => setShareType('url')}
        >
          🔗 链接
        </button>
        <button 
          className={`share-tab ${shareType === 'text' ? 'active' : ''}`}
          onClick={() => setShareType('text')}
        >
          📝 文本
        </button>
        <button 
          className={`share-tab ${shareType === 'qr' ? 'active' : ''}`}
          onClick={() => setShareType('qr')}
        >
          📱 二维码
        </button>
      </div>

      {/* 链接分享 */}
      {shareType === 'url' && (
        <div className="share-content">
          <p className="share-desc">
            生成分享链接，对方打开即可加载此棋谱
          </p>
          <div className="share-preview">
            <input
              type="text"
              value={generateShareURL()}
              readOnly
              className="share-input"
            />
          </div>
          <button 
            onClick={handleCopyLink}
            className={`share-btn ${copied ? 'copied' : ''}`}
          >
            {copied ? '✅ 已复制!' : '📋 复制链接'}
          </button>
        </div>
      )}

      {/* 文本分享 */}
      {shareType === 'text' && (
        <div className="share-content">
          <p className="share-desc">
            复制SGF格式棋谱，可粘贴到其他软件
          </p>
          <div className="share-preview">
            <textarea
              value={generateSGF()}
              readOnly
              className="share-textarea"
              rows={4}
            />
          </div>
          <div className="share-buttons">
            <button onClick={handleCopySGF} className="share-btn">
              📋 复制SGF
            </button>
            <button onClick={handleCopyText} className="share-btn">
              📋 复制分享文本
            </button>
          </div>
        </div>
      )}

      {/* 二维码分享 */}
      {shareType === 'qr' && (
        <div className="share-content">
          <p className="share-desc">
            扫描二维码加载此棋谱
          </p>
          <div className="qr-container">
            {/* 简单二维码占位符 - 实际可使用 qrcode.react 库 */}
            <div className="qr-placeholder">
              <div className="qr-code">
                <svg viewBox="0 0 100 100" className="qr-svg">
                  {/* 简化版二维码图案 */}
                  <rect x="10" y="10" width="20" height="20" fill="#1f2937"/>
                  <rect x="70" y="10" width="20" height="20" fill="#1f2937"/>
                  <rect x="10" y="70" width="20" height="20" fill="#1f2937"/>
                  <rect x="15" y="15" width="10" height="10" fill="white"/>
                  <rect x="75" y="15" width="10" height="10" fill="white"/>
                  <rect x="15" y="75" width="10" height="10" fill="white"/>
                  {Array(5).fill(0).map((_, i) => (
                    <rect key={`v-${i}`} x={40 + i * 4} y="10" width="2" height="20" fill="#1f2937"/>
                  ))}
                  {Array(5).fill(0).map((_, i) => (
                    <rect key={`h-${i}`} x="10" y={40 + i * 4} width="20" height="2" fill="#1f2937"/>
                  ))}
                </svg>
              </div>
              <p className="qr-hint">扫码加载棋谱</p>
            </div>
          </div>
          <button onClick={handleCopyLink} className="share-btn">
            📋 复制链接
          </button>
        </div>
      )}

      {/* 分享统计 */}
      <div className="share-stats">
        <div className="stat">
          <span className="stat-icon">⚫</span>
          <span className="stat-text">{gameData.blackPlayer}</span>
        </div>
        <div className="stat">
          <span className="stat-icon">⚪</span>
          <span className="stat-text">{gameData.whitePlayer}</span>
        </div>
        <div className="stat">
          <span className="stat-icon">👆</span>
          <span className="stat-text">{gameData.moves.length}手</span>
        </div>
      </div>

      {/* 分享平台快捷按钮 */}
      <div className="share-platforms">
        <button 
          className="platform-btn"
          onClick={() => {
            const text = generateShareText();
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
          }}
          title="分享到Twitter"
        >
          𝕏
        </button>
        <button 
          className="platform-btn"
          onClick={() => {
            const text = generateShareText();
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(generateShareURL())}`, '_blank');
          }}
          title="分享到Facebook"
        >
          f
        </button>
        <button 
          className="platform-btn"
          onClick={() => {
            const text = generateShareText();
            window.open(`mailto:?subject=${encodeURIComponent('围棋对局: ' + gameData.gameName)}&body=${encodeURIComponent(text)}`, '_blank');
          }}
          title="发送邮件"
        >
          ✉️
        </button>
      </div>

      <style>{`
        .share-panel {
          padding: 12px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .share-title {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: bold;
          color: #1f2937;
        }
        .share-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 12px;
        }
        .share-tab {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 6px;
          background: #f3f4f6;
          cursor: pointer;
          font-size: 12px;
          color: #6b7280;
          transition: all 0.2s;
        }
        .share-tab.active {
          background: #3b82f6;
          color: white;
        }
        .share-content {
          margin-bottom: 12px;
        }
        .share-desc {
          font-size: 12px;
          color: #6b7280;
          margin: 0 0 8px 0;
        }
        .share-preview {
          margin-bottom: 8px;
        }
        .share-input {
          width: 100%;
          padding: 8px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 11px;
          background: #f9fafb;
        }
        .share-textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 10px;
          font-family: monospace;
          resize: none;
          background: #f9fafb;
        }
        .share-buttons {
          display: flex;
          gap: 8px;
        }
        .share-btn {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 6px;
          background: #3b82f6;
          color: white;
          cursor: pointer;
          font-size: 13px;
          transition: background 0.2s;
        }
        .share-btn:hover {
          background: #2563eb;
        }
        .share-btn.copied {
          background: #22c55e;
        }
        .qr-container {
          display: flex;
          justify-content: center;
          padding: 16px;
        }
        .qr-placeholder {
          text-align: center;
        }
        .qr-code {
          width: 120px;
          height: 120px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          margin: 0 auto 8px;
        }
        .qr-svg {
          width: 100%;
          height: 100%;
        }
        .qr-hint {
          font-size: 12px;
          color: #6b7280;
          margin: 0;
        }
        .share-stats {
          display: flex;
          justify-content: space-around;
          padding: 10px;
          background: #f9fafb;
          border-radius: 6px;
          margin-bottom: 12px;
        }
        .stat {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
        }
        .stat-icon {
          font-size: 14px;
        }
        .stat-text {
          color: #1f2937;
        }
        .share-platforms {
          display: flex;
          gap: 8px;
          justify-content: center;
        }
        .platform-btn {
          width: 40px;
          height: 40px;
          border: 1px solid #e5e7eb;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s;
        }
        .platform-btn:hover {
          background: #f3f4f6;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default SharePanel;
