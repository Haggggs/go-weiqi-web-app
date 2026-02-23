/**
 * SGF (Smart Game Format) 围棋棋谱解析和生成工具
 * 支持完整的中国、日本、韩国规则
 */

export type RuleType = 'chinese' | 'japanese' | 'korean';
export type StoneColor = 'black' | 'white';

export interface SGFMove {
  color: StoneColor;
  row: number;
  col: number;
  comment?: string;
}

export interface SGFGame {
  // 基本信息
  gameName?: string;
  date?: string;
  rules?: RuleType;
  komi?: number; // 贴目
  handicap?: number; // 让子数
  result?: string; // 胜负结果
  
  // 玩家信息
  blackPlayer?: string;
  whitePlayer?: string;
  
  // 棋谱
  moves: SGFMove[];
  
  // 元数据
  application?: string;
  copyright?: string;
}

/**
 * 将坐标转换为SGF格式 (a-s = 0-18)
 */
export function toSGFCoord(row: number, col: number): string {
  if (row < 0 || row > 18 || col < 0 || col > 18) return '';
  return String.fromCharCode(97 + col) + String.fromCharCode(97 + row);
}

/**
 * 将SGF坐标转换为数组坐标
 */
export function fromSGFCoord(coord: string): { row: number; col: number } | null {
  if (!coord || coord.length !== 2) return null;
  const col = coord.charCodeAt(0) - 97;
  const row = coord.charCodeAt(1) - 97;
  if (row < 0 || row > 18 || col < 0 || col > 18) return null;
  return { row, col };
}

/**
 * 解析SGF格式棋谱
 */
export function parseSGF(sgfContent: string): SGFGame {
  const game: SGFGame = {
    moves: []
  };

  // 移除换行和多余空格
  const content = sgfContent.replace(/[\r\n]+/g, '').trim();

  // 解析头部信息
  // 获取第一个括号内的内容
  const rootMatch = content.match(/\(([\s\S]*?)\)/);
  if (!rootMatch) return game;

  const rootContent = rootMatch[1];

  // 解析各种标签
  const parseProperty = (pattern: RegExp, callback: (value: string) => void) => {
    const match = rootContent.match(pattern);
    if (match && match[1]) {
      callback(match[1].replace(/\\\]/g, ']'));
    }
  };

  parseProperty(/GN\[([^\]]*)\]/, v => game.gameName = v);
  parseProperty(/DT\[([^\]]*)\]/, v => game.date = v);
  parseProperty(/RU\[([^\]]*)\]/, v => {
    const ruleMap: Record<string, RuleType> = {
      'chinese': 'chinese',
      'japanese': 'japanese',
      'korean': 'korean',
      'jp': 'japanese',
      'kr': 'korean'
    };
    game.rules = ruleMap[v.toLowerCase()] || 'chinese';
  });
  parseProperty(/KM\[([^\]]*)\]/, v => game.komi = parseFloat(v));
  parseProperty(/HA\[([^\]]*)\]/, v => game.handicap = parseInt(v));
  parseProperty(/RE\[([^\]]*)\]/, v => game.result = v);
  parseProperty(/PB\[([^\]]*)\]/, v => game.blackPlayer = v);
  parseProperty(/PW\[([^\]]*)\]/, v => game.whitePlayer = v);
  parseProperty(/AP\[([^\]]*)\]/, v => game.application = v);
  parseProperty(/CO\[([^\]]*)\]/, v => game.copyright = v);

  // 解析棋步
  const movePattern = /(B|W)\[([a-s]{2})?\]/gi;
  let currentColor: StoneColor = 'black';
  let moveMatch;

  while ((moveMatch = movePattern.exec(rootContent)) !== null) {
    const color = moveMatch[1].toUpperCase() === 'B' ? 'black' : 'white';
    const coord = moveMatch[2];

    if (coord && coord.length === 2) {
      const pos = fromSGFCoord(coord);
      if (pos) {
        // 查找这一手之后的注释
        const commentMatch = rootContent.substring(moveMatch.index).match(/C\[([^\]]*)\]/);
        const comment = commentMatch ? commentMatch[1].replace(/\\\]/g, ']') : undefined;

        game.moves.push({
          color,
          row: pos.row,
          col: pos.col,
          comment
        });
      }
    }
    currentColor = color === 'black' ? 'white' : 'black';
  }

  // 默认规则
  if (!game.rules) {
    game.rules = 'chinese';
  }

  return game;
}

/**
 * 生成SGF格式棋谱
 */
export function generateSGF(game: SGFGame): string {
  const lines: string[] = [];

  // 文件头
  lines.push('(;');

  // 基本信息
  if (game.gameName) lines.push(`GN[${escapeSGF(game.gameName)}]`);
  if (game.date) lines.push(`DT[${escapeSGF(game.date)}]`);
  else lines.push(`DT[${new Date().toISOString().split('T')[0]}]`);
  
  // 规则
  const ruleNames: Record<RuleType, string> = {
    'chinese': 'Chinese',
    'japanese': 'Japanese',
    'korean': 'Korean'
  };
  lines.push(`RU[${ruleNames[game.rules || 'chinese']}]`);
  
  // 贴目
  if (game.komi !== undefined) lines.push(`KM[${game.komi}]`);
  else lines.push(`KM[${game.rules === 'chinese' ? '7.5' : '6.5'}]`);
  
  // 让子
  if (game.handicap && game.handicap > 0) {
    lines.push(`HA[${game.handicap}]`);
    // 添加让子位置的星位
    const handicapPositions = getHandicapPositions(game.handicap);
    for (const pos of handicapPositions) {
      lines.push(`AB[${toSGFCoord(pos.row, pos.col)}]`);
    }
  }
  
  // 玩家信息
  if (game.blackPlayer) lines.push(`PB[${escapeSGF(game.blackPlayer)}]`);
  else lines.push(`PB[黑方]`);
  
  if (game.whitePlayer) lines.push(`PW[${escapeSGF(game.whitePlayer)}]`);
  else lines.push(`PW[白方]`);
  
  // 胜负结果
  if (game.result) lines.push(`RE[${escapeSGF(game.result)}]`);
  
  // 应用信息
  lines.push(`AP[WeiqiWebApp:1.0]`);

  // 棋盘大小
  lines.push('SZ[19]');

  // 棋步
  for (const move of game.moves) {
    const color = move.color === 'black' ? 'B' : 'W';
    const coord = toSGFCoord(move.row, move.col);
    if (coord) {
      lines.push(`${color}[${coord}]`);
      // 如果有注释，添加注释
      if (move.comment) {
        lines.push(`C[${escapeSGF(move.comment)}]`);
      }
    }
  }

  // 文件尾
  lines.push(')');

  return lines.join('\n');
}

/**
 * 获取让子位置（星位）
 */
function getHandicapPositions(handicap: number): Array<{ row: number; col: number }> {
  const positions: Array<{ row: number; col: number }> = [];
  
  // 标准让子位置
  const standardPositions = [
    { row: 3, col: 3 },
    { row: 3, col: 15 },
    { row: 15, col: 3 },
    { row: 15, col: 15 },
    { row: 9, col: 3 },
    { row: 3, col: 9 },
    { row: 15, col: 9 },
    { row: 9, col: 15 },
    { row: 9, col: 9 }
  ];

  for (let i = 0; i < Math.min(handicap, 9); i++) {
    positions.push(standardPositions[i]);
  }

  return positions;
}

/**
 * 转义SGF特殊字符
 */
function escapeSGF(str: string): string {
  return str.replace(/\]/g, '\\]');
}

/**
 * 获取规则的显示名称
 */
export function getRuleDisplayName(rule: RuleType): string {
  const names: Record<RuleType, string> = {
    'chinese': '中国规则',
    'japanese': '日本规则',
    'korean': '韩国规则'
  };
  return names[rule];
}

/**
 * 获取规则的贴目
 */
export function getRuleKomi(rule: RuleType): number {
  const komi: Record<RuleType, number> = {
    'chinese': 7.5,
    'japanese': 6.5,
    'korean': 6.5
  };
  return komi[rule];
}

/**
 * 下载SGF文件
 */
export function downloadSGF(game: SGFGame, filename?: string): void {
  const sgf = generateSGF(game);
  const blob = new Blob([sgf], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${game.gameName || 'weiqi_game'}_${new Date().toISOString().split('T')[0]}.sgf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * 读取本地SGF文件
 */
export function readLocalSGF(file: File): Promise<SGFGame> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const game = parseSGF(content);
        resolve(game);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
