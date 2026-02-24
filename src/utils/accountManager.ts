/**
 * 围棋网站账号管理器
 * 自动注册并保存账号密码
 */

import { browser, Browser } from 'playwright';

// 账号配置
interface AccountConfig {
  email: string;
  password: string;
  name?: string;
  createdAt?: string;
}

interface SiteAccount {
  siteId: string;
  siteName: string;
  username: string;
  email: string;
  password: string;
  registered: boolean;
  registeredAt?: string;
  notes?: string;
}

// 已注册的账号数据库
class AccountManager {
  private accounts: SiteAccount[] = [];
  private configPath = '/Users/galthran2027/.openclaw/workspace/agents/amao_workspace/src/data/site_accounts.json';

  constructor() {
    this.loadAccounts();
  }

  // 加载账号
  private loadAccounts() {
    try {
      const fs = require('fs');
      if (fs.existsSync(this.configPath)) {
        const data = fs.readFileSync(this.configPath, 'utf-8');
        this.accounts = JSON.parse(data);
      }
    } catch (e) {
      this.accounts = [];
    }
  }

  // 保存账号
  private saveAccounts() {
    try {
      const fs = require('fs');
      const dir = require('path').dirname(this.configPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.configPath, JSON.stringify(this.accounts, null, 2));
    } catch (e) {
      console.error('保存账号失败:', e);
    }
  }

  // 添加账号
  addAccount(account: SiteAccount) {
    const existing = this.accounts.find(a => a.siteId === account.siteId);
    if (existing) {
      Object.assign(existing, account);
    } else {
      this.accounts.push(account);
    }
    this.saveAccounts();
  }

  // 获取账号
  getAccount(siteId: string): SiteAccount | undefined {
    return this.accounts.find(a => a.siteId === siteId);
  }

  // 获取所有账号
  getAllAccounts(): SiteAccount[] {
    return this.accounts;
  }

  // 删除账号
  deleteAccount(siteId: string) {
    this.accounts = this.accounts.filter(a => a.siteId !== siteId);
    this.saveAccounts();
  }
}

// 需要注册的围棋网站
const goSitesRequiringRegistration = [
  {
    id: 'go4go',
    name: 'Go4Go',
    url: 'https://go4go.net/users/signup',
    emailRequired: true,
    notes: '125,713+职业棋谱'
  },
  {
    id: 'gogod',
    name: 'GoGoD',
    url: 'https://gogod.com/register',
    emailRequired: true,
    notes: '112,000+历史棋谱'
  },
  {
    id: '野狐围棋',
    name: '野狐围棋',
    url: 'https://www.yikeweiqi.com/register',
    emailRequired: true,
    notes: '10万+棋谱,AI复盘'
  },
  {
    id: '弈城围棋',
    name: '弈城围棋',
    url: 'http://www.yywq.com/register',
    emailRequired: true,
    notes: '中韩高手聚集'
  },
  {
    id: '101围棋',
    name: '101围棋网',
    url: 'http://www.101weiqi.com/register',
    emailRequired: true,
    notes: '棋谱库,题库'
  }
];

export { AccountManager, SiteAccount, goSitesRequiringRegistration };
