/**
 * 围棋棋谱库系统
 * 支持搜索、批量抓取、查重等功能
 */

export interface GameRecord {
  id: string;
  // 基本信息
  gameName: string;
  date: string;
  rules: 'chinese' | 'japanese' | 'korean';
  komi: number;
  handicap: number;
  result?: string;
  
  // 玩家信息
  blackPlayer: string;
  whitePlayer: string;
  blackRank?: string;
  whiteRank?: string;
  
  // 对局信息
  event?: string;    // 比赛名称
  round?: string;    // 轮次
  venue?: string;     // 地点
  time?: string;     // 时间控制
  
  // 棋谱
  moves: Array<{
    row: number;
    col: number;
    color: 'black' | 'white';
    comment?: string;
  }>;
  
  // 元数据
  source?: string;   // 来源网站
  sourceUrl?: string; // 原始URL
  downloadedAt?: string; // 下载时间
  tags?: string[];   // 标签
}

export interface SearchOptions {
  query?: string;
  player?: string;
  dateFrom?: string;
  dateTo?: string;
  rules?: 'chinese' | 'japanese' | 'korean';
  event?: string;
  tags?: string[];
}

// 棋谱库主类
export class GameLibrary {
  private games: Map<string, GameRecord> = new Map();
  private storageKey = 'weiqi_game_library';

  constructor() {
    this.loadFromStorage();
  }

  // 添加棋谱
  addGame(game: GameRecord): string {
    const id = this.generateId(game);
    this.games.set(id, { ...game, id });
    this.saveToStorage();
    return id;
  }

  // 批量添加棋谱
  addGames(games: GameRecord[]): string[] {
    const ids: string[] = [];
    for (const game of games) {
      const id = this.addGame(game);
      ids.push(id);
    }
    return ids;
  }

  // 搜索棋谱
  search(options: SearchOptions): GameRecord[] {
    const results: GameRecord[] = [];

    for (const game of this.games.values()) {
      let matches = true;

      // 全文搜索
      if (options.query) {
        const query = options.query.toLowerCase();
        const searchable = [
          game.gameName,
          game.blackPlayer,
          game.whitePlayer,
          game.event,
          game.date,
          game.source || ''
        ].join(' ').toLowerCase();
        
        if (!searchable.includes(query)) {
          matches = false;
        }
      }

      // 棋手搜索
      if (options.player && matches) {
        const player = options.player.toLowerCase();
        if (!game.blackPlayer.toLowerCase().includes(player) &&
            !game.whitePlayer.toLowerCase().includes(player)) {
          matches = false;
        }
      }

      // 日期范围
      if (options.dateFrom && matches) {
        if (game.date < options.dateFrom) matches = false;
      }
      if (options.dateTo && matches) {
        if (game.date > options.dateTo) matches = false;
      }

      // 规则
      if (options.rules && matches) {
        if (game.rules !== options.rules) matches = false;
      }

      // 比赛
      if (options.event && matches) {
        if (!game.event?.toLowerCase().includes(options.event.toLowerCase())) {
          matches = false;
        }
      }

      // 标签
      if (options.tags && options.tags.length > 0 && matches) {
        const gameTags = game.tags || [];
        if (!options.tags.some(tag => gameTags.includes(tag))) {
          matches = false;
        }
      }

      if (matches) {
        results.push(game);
      }
    }

    // 按日期排序
    results.sort((a, b) => b.date.localeCompare(a.date));

    return results;
  }

  // 查重 - 基于玩家和日期
  findDuplicate(game: GameRecord): GameRecord | null {
    for (const existing of this.games.values()) {
      // 检查是否同一天同一对局
      if (existing.date === game.date) {
        if ((existing.blackPlayer === game.blackPlayer && existing.whitePlayer === game.whitePlayer) ||
            (existing.blackPlayer === game.whitePlayer && existing.whitePlayer === game.blackPlayer)) {
          // 检查手数是否相同
          if (existing.moves.length === game.moves.length) {
            return existing;
          }
        }
      }
    }
    return null;
  }

  // 获取棋谱
  getGame(id: string): GameRecord | undefined {
    return this.games.get(id);
  }

  // 删除棋谱
  deleteGame(id: string): boolean {
    const result = this.games.delete(id);
    if (result) {
      this.saveToStorage();
    }
    return result;
  }

  // 更新棋谱
  updateGame(id: string, updates: Partial<GameRecord>): boolean {
    const game = this.games.get(id);
    if (!game) return false;
    
    this.games.set(id, { ...game, ...updates });
    this.saveToStorage();
    return true;
  }

  // 获取统计信息
  getStats(): {
    total: number;
    byRules: Record<string, number>;
    byPlayer: Record<string, number>;
    byYear: Record<string, number>;
  } {
    const stats = {
      total: this.games.size,
      byRules: {} as Record<string, number>,
      byPlayer: {} as Record<string, number>,
      byYear: {} as Record<string, number>
    };

    for (const game of this.games.values()) {
      // 按规则统计
      stats.byRules[game.rules] = (stats.byRules[game.rules] || 0) + 1;

      // 按棋手统计
      [game.blackPlayer, game.whitePlayer].forEach(player => {
        if (player) {
          stats.byPlayer[player] = (stats.byPlayer[player] || 0) + 1;
        }
      });

      // 按年份统计
      const year = game.date.substring(0, 4);
      stats.byYear[year] = (stats.byYear[year] || 0) + 1;
    }

    return stats;
  }

  // 生成唯一ID
  private generateId(game: GameRecord): string {
    const base = `${game.date}_${game.blackPlayer}_${game.whitePlayer}_${game.moves.length}`;
    let id = this.simpleHash(base);
    let counter = 0;
    
    while (this.games.has(id)) {
      id = this.simpleHash(base + counter++);
    }
    
    return id;
  }

  // 简单哈希函数
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  // 保存到本地存储
  private saveToStorage(): void {
    try {
      const data = Array.from(this.games.entries());
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save game library:', e);
    }
  }

  // 从本地存储加载
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const entries = JSON.parse(data) as [string, GameRecord][];
        this.games = new Map(entries);
      }
    } catch (e) {
      console.error('Failed to load game library:', e);
    }
  }

  // 导出棋谱库
  exportLibrary(): string {
    return JSON.stringify(Array.from(this.games.entries()), null, 2);
  }

  // 导入棋谱库
  importLibrary(json: string): number {
    try {
      const entries = JSON.parse(json) as [string, GameRecord][];
      let count = 0;
      for (const [id, game] of entries) {
        if (!this.games.has(id)) {
          this.games.set(id, game);
          count++;
        }
      }
      this.saveToStorage();
      return count;
    } catch (e) {
      console.error('Failed to import library:', e);
      return 0;
    }
  }

  // 清空棋谱库
  clear(): void {
    this.games.clear();
    this.saveToStorage();
  }
}

// 搜索源配置
export interface SearchSource {
  name: string;
  searchUrl: (query: string) => string;
  parseResults: (html: string) => Array<{ title: string; url: string; info?: string }>;
  parseSGF?: (html: string) => string | null;
}

// 常用围棋网站搜索源
export const searchSources: SearchSource[] = [
  {
    name: 'GoQuest',
    searchUrl: (query) => `https://goquest.net/search?q=${encodeURIComponent(query)}`,
    parseResults: (html) => {
      // 解析搜索结果
      const results: Array<{ title: string; url: string; info?: string }> = [];
      // 实现解析逻辑
      return results;
    }
  },
  {
    name: 'Smart Game',
    searchUrl: (query) => `https://www.smart-games.com/search?q=${encodeURIComponent(query)}`,
    parseResults: (html) => {
      const results: Array<{ title: string; url: string; info?: string }> = [];
      return results;
    }
  }
];

// 默认导出实例
export const gameLibrary = new GameLibrary();
