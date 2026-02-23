/**
 * 围棋棋谱网站数据库
 * 包含常用围棋棋谱网站信息（根据Devvi提供的数据）
 */

export interface GoGameSite {
  id: string;
  name: string;           // 网站名称
  nameCN: string;         // 中文名称
  url: string;            // 基础URL
  searchUrl: string;      // 搜索URL模式
  logo?: string;          // Logo图标
  language: string;       // 语言
  features: string[];     // 特色功能
  sgfSupport: boolean;    // 是否支持SGF
  isActive: boolean;      // 是否可用
  reliability: number;    // 可靠性 1-5
  gameCount: string;     // 棋谱数量
  description: string;   // 描述
}

// 常用围棋棋谱网站数据库（真实数据）
export const goGameSites: GoGameSite[] = [
  {
    id: 'go4go',
    name: 'Go4Go',
    nameCN: 'Go4Go',
    url: 'https://go4go.net',
    searchUrl: 'https://go4go.net/go/search?q={query}',
    language: 'en',
    features: ['每日更新', '职业棋谱', '手动验证准确性', '邮件订阅'],
    sgfSupport: true,
    isActive: true,
    reliability: 5,
    gameCount: '125,713+',
    description: '每日更新，手动验证棋谱准确性，提供邮件订阅服务'
  },
  {
    id: 'gogod',
    name: 'GoGoD',
    nameCN: 'GoGoD',
    url: 'https://gogod.com',
    searchUrl: 'https://gogod.com/search?q={query}',
    language: 'en',
    features: ['历史棋谱', '古谱丰富', 'SGF格式'],
    sgfSupport: true,
    isActive: true,
    reliability: 5,
    gameCount: '112,000+',
    description: '历史棋谱丰富，包含大量古谱，SGF格式'
  },
  {
    id: 'gobase',
    name: 'GoBase',
    nameCN: 'GoBase',
    url: 'https://gobase.org',
    searchUrl: 'https://gobase.org/search?query={query}',
    language: 'en',
    features: ['可搜索定式', '布局分析', '棋手传记', '文章'],
    sgfSupport: true,
    isActive: true,
    reliability: 4,
    gameCount: '98,918+',
    description: '可搜索定式、布局，含棋手传记和文章'
  },
  {
    id: 'waltheri',
    name: "Waltheri's",
    nameCN: "Waltheri's",
    url: 'https://waltheri.net',
    searchUrl: 'https://waltheri.net/search?q={query}',
    language: 'en',
    features: ['局面搜索', 'Pattern Search', '免费使用'],
    sgfSupport: true,
    isActive: true,
    reliability: 4,
    gameCount: '~70,000',
    description: '支持局面搜索(pattern search)，免费使用'
  },
  {
    id: 'gokifu',
    name: 'GoKifu',
    nameCN: 'GoKifu',
    url: 'https://gokifu.com',
    searchUrl: 'https://gokifu.com/?s={query}',
    language: 'en',
    features: ['更新快', 'SGF下载', '可嵌入博客'],
    sgfSupport: true,
    isActive: true,
    reliability: 4,
    gameCount: '持续增长',
    description: '更新快，支持SGF下载，可嵌入博客分享'
  },
  {
    id: 'yeewang',
    name: '野狐围棋',
    nameCN: '野狐围棋',
    url: 'https://www.yikeweiqi.com',
    searchUrl: 'https://www.yikeweiqi.com/search?q={query}',
    language: 'zh',
    features: ['腾讯旗下', '最大对弈平台', 'AI复盘', '职业比赛直播'],
    sgfSupport: true,
    isActive: true,
    reliability: 5,
    gameCount: '10万+',
    description: '腾讯旗下，国内最大对弈平台，含AI复盘、职业比赛直播'
  },
  {
    id: 'yicheng',
    name: '弈城围棋',
    nameCN: '弈城围棋',
    url: 'http://www.yywq.com',
    searchUrl: 'http://www.yywq.com/search?q={query}',
    language: 'zh',
    features: ['老牌对弈', '中韩高手聚集'],
    sgfSupport: true,
    isActive: true,
    reliability: 4,
    gameCount: '大量',
    description: '老牌对弈网站，中韩高手聚集'
  },
  {
    id: '101weiqi',
    name: '101围棋网',
    nameCN: '101围棋网',
    url: 'http://www.101weiqi.com',
    searchUrl: 'http://www.101weiqi.com/search?q={query}',
    language: 'zh',
    features: ['免安装', '微信登录', '开放题库', '棋谱库'],
    sgfSupport: true,
    isActive: true,
    reliability: 4,
    gameCount: '完善',
    description: '免安装，微信登录，开放题库，棋谱库功能完善'
  },
  {
    id: 'wangyou',
    name: '忘忧围棋',
    nameCN: '忘忧围棋',
    url: 'http://www.wuyouweiqi.com',
    searchUrl: 'http://www.wuyouweiqi.com/search?q={query}',
    language: 'zh',
    features: ['10万+职业棋谱', '视频对弈', '语音对弈'],
    sgfSupport: true,
    isActive: true,
    reliability: 4,
    gameCount: '10万+',
    description: '10万+职业棋谱，支持视频/语音对弈'
  },
  {
    id: 'kgs',
    name: 'KGS',
    nameCN: 'KGS',
    url: 'https://www.gokgs.com',
    searchUrl: 'https://www.gokgs.com/search?query={query}',
    language: 'en',
    features: ['国际知名', 'Fuseki Info', '定式/布局分析'],
    sgfSupport: true,
    isActive: true,
    reliability: 4,
    gameCount: '高段棋谱',
    description: '国际知名，Fuseki Info提供其高段棋谱的定式/布局分析'
  },
  {
    id: 'ogs',
    name: 'OGS',
    nameCN: 'OGS',
    url: 'https://online-go.com',
    searchUrl: 'https://online-go.com/search?q={query}',
    language: 'en',
    features: ['开源平台', 'SGF导出', '业余对局数据库'],
    sgfSupport: true,
    isActive: true,
    reliability: 4,
    gameCount: '庞大',
    description: '开源平台，支持SGF导出，有庞大业余对局数据库'
  },
  {
    id: 'eidogo',
    name: 'Eidogo',
    nameCN: 'Eidogo',
    url: 'https://eidogo.com',
    searchUrl: 'https://eidogo.com/search?query={query}',
    language: 'en',
    features: ['棋谱搜索', 'SGF支持', '在线分析'],
    sgfSupport: true,
    isActive: true,
    reliability: 4,
    gameCount: '大量',
    description: '棋谱搜索，SGF支持，在线分析'
  }
];

// 常用棋手名字（用于搜索建议）
export const popularPlayers = [
  // 中国顶级棋手
  '柯洁', '芈昱廷', '杨鼎新', '辜梓豪', '李轩豪', '丁浩', '谢尔豪', '范廷钰',
  '王星昊', '许嘉阳', '赵晨宇', '李维清', '蒋其润', '刘宇航', '李欣怡', '於之莹',
  // 日本顶级棋手
  '井山裕太', '一力辽', '芝野虎丸', '许家元', '余正麒', '河野临', '羽根直树', '高尾绅路',
  // 韩国顶级棋手
  '申真谞', '朴廷桓', '卞相壹', '申旻埈', '金明训', '朴键昊', '韩升周', '崔精',
  // AI
  'KataGo', 'AlphaGo', '绝艺', '星阵', 'Leela Zero'
];

// 常用比赛名称
export const popularEvents = [
  'LG杯', '三星杯', '应氏杯', '春兰杯', '梦百合杯', 'BC卡杯',
  '名人战', '本因坊', '十段战', '天元战', '王座战', '棋圣战',
  '衢州·烂柯杯', '阿含·桐山杯', '龙星战', '新人王'
];

// 搜索建议
export interface SearchSuggestion {
  type: 'player' | 'event' | 'recent';
  text: string;
  count?: number;
}

// 快速搜索选项
export const quickSearchOptions = [
  { id: 'latest', name: '最新对局', icon: '🆕' },
  { id: 'ai', name: 'AI对局', icon: '🤖' },
  { id: 'classic', name: '经典名局', icon: '⭐' },
  { id: 'tianyuan', name: '天元', icon: '👑' },
  { id: 'mingzhu', name: '名人对局', icon: '🏆' }
];
