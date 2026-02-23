/**
 * 围棋网站账号数据库
 * 已保存的账号信息
 */

export interface SiteAccount {
  siteId: string;
  siteName: string;
  username: string;
  email: string;
  password: string;
  registered: boolean;
  registeredAt?: string;
  notes?: string;
}

// 空的账号数据库 - 首次使用
export const savedAccounts: SiteAccount[] = [];

// 需要注册的网站列表
export const sitesToRegister = [
  {
    id: 'go4go',
    name: 'Go4Go',
    nameEN: 'Go4Go',
    url: 'https://go4go.net/users/signup',
    gameCount: '125,713+',
    features: ['每日更新', '职业棋谱', '手动验证'],
    requiresRegistration: true,
    priority: 1
  },
  {
    id: 'gogod',
    name: 'GoGoD',
    nameEN: 'GoGoD', 
    url: 'https://gogod.com/register',
    gameCount: '112,000+',
    features: ['历史棋谱', '古谱丰富', 'SGF格式'],
    requiresRegistration: false,
    priority: 2
  },
  {
    id: 'yeewang',
    name: '野狐围棋',
    nameEN: 'Yeeku Go',
    url: 'https://www.yikeweiqi.com/wap/user/signup',
    gameCount: '10万+',
    features: ['腾讯旗下', 'AI复盘', '职业直播'],
    requiresRegistration: true,
    priority: 1
  },
  {
    id: 'yicheng',
    name: '弈城围棋',
    nameEN: 'Yicheng',
    url: 'http://www.yywq.com/user/registe',
    gameCount: '大量',
    features: ['中韩高手', '老牌对弈'],
    requiresRegistration: true,
    priority: 2
  },
  {
    id: '101weiqi',
    name: '101围棋网',
    nameEN: '101 Weiqi',
    url: 'http://www.101weiqi.com/index.php?m=user&c=index&a=reg',
    gameCount: '完善',
    features: ['免安装', '微信登录', '题库'],
    requiresRegistration: true,
    priority: 2
  },
  {
    id: 'wangyou',
    name: '忘忧围棋',
    nameEN: 'Wangyou',
    url: 'http://www.wuyouweiqi.com/register',
    gameCount: '10万+',
    features: ['职业棋谱', '视频对弈'],
    requiresRegistration: true,
    priority: 3
  }
];

// Gmail配置（用于注册）
export const gmailConfig = {
  email: 'qrqrrqqe@gmail.com',
  appPassword: 'btyk xful jmmd olzk'  // Gmail应用密码
};
