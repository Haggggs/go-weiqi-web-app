/**
 * 围棋棋手数据库
 * 包含中日韩棋手的中文、英文、日文、韩文名字
 */

export interface Player {
  id: string;
  nameCN: string;        // 中文名
  nameEN: string;        // 英文名
  nameJP?: string;       // 日文名
  nameKR?: string;       // 韩文名
  country: 'CN' | 'JP' | 'KR';  // 国家
  rank: string;          // 段位/等级
  profile?: string;      // 简介
}

// 完整棋手数据库
export const players: Player[] = [
  // ============ 中国棋手 ============
  { id: 'kejie', nameCN: '柯洁', nameEN: 'Ke Jie', nameJP: '柯潔', country: 'CN', rank: '九段', profile: '中国第一人' },
  { id: 'miyuting', nameCN: '芈昱廷', nameEN: 'Mi Yuting', nameJP: '芈昱廷', country: 'CN', rank: '九段' },
  { id: 'yangdingsin', nameCN: '杨鼎新', nameEN: 'Yang Dingxin', nameJP: '楊鼎新', country: 'CN', rank: '九段' },
  { id: 'guzihao', nameCN: '辜梓豪', nameEN: 'Gu Zihao', nameJP: '辜梓豪', country: 'CN', rank: '九段' },
  { id: 'lixuanhao', nameCN: '李轩豪', nameEN: 'Li Xuanhao', nameJP: '李軒豪', country: 'CN', rank: '九段' },
  { id: 'dinghao', nameCN: '丁浩', nameEN: 'Ding Hao', nameJP: '丁浩', country: 'CN', rank: '九段' },
  { id: 'xieerhao', nameCN: '谢尔豪', nameEN: 'Xie Erhao', nameJP: '謝爾豪', country: 'CN', rank: '九段' },
  { id: 'fantingyu', nameCN: '范廷钰', nameEN: 'Fan Tingyu', nameJP: '范廷钰', country: 'CN', rank: '九段' },
  { id: 'wangxinghao', nameCN: '王星昊', nameEN: 'Wang Xinghao', nameJP: '王星昊', country: 'CN', rank: '八段' },
  { id: 'xujiayang', nameCN: '许嘉阳', nameEN: 'Xu Jiayang', nameJP: '許嘉陽', country: 'CN', rank: '八段' },
  { id: 'zhaochenyu', nameCN: '赵晨宇', nameEN: 'Zhao Chenyu', nameJP: '趙晨宇', country: 'CN', rank: '八段' },
  { id: 'liweiqing', nameCN: '李维清', nameEN: 'Li Weiqing', nameJP: '李維清', country: 'CN', rank: '八段' },
  { id: 'jiangqirun', nameCN: '蒋其润', nameEN: 'Jiang Qirun', nameJP: '蔣其潤', country: 'CN', rank: '七段' },
  { id: 'liuyuhang', nameCN: '刘宇航', nameEN: 'Liu Yuhang', nameJP: '劉宇航', country: 'CN', rank: '七段' },
  { id: 'lixinyi', nameCN: '李欣怡', nameEN: 'Li Xinyi', nameJP: '李欣怡', country: 'CN', rank: '七段', profile: '女子顶尖' },
  { id: 'yuzhiying', nameCN: '於之莹', nameEN: 'Yu Zhiying', nameJP: '於之瑩', country: 'CN', rank: '七段', profile: '女子顶尖' },
  { id: 'zhouhaoyu', nameCN: '周泓余', nameEN: 'Zhou Haoyu', nameJP: '周泓餘', country: 'CN', rank: '六段', profile: '女子新星' },
  { id: 'tangweixing', nameCN: '唐韦星', nameEN: 'Tang Weixing', nameJP: '唐韋星', country: 'CN', rank: '九段' },
  { id: 'pengliujun', nameCN: '彭立尧', nameEN: 'Peng Liujun', nameJP: '彭立堯', country: 'CN', rank: '七段' },
  { id: 'liujiahao', nameCN: '刘兆哲', nameEN: 'Liu Zhaozhe', nameJP: '劉兆喆', country: 'CN', rank: '六段' },
  
  // ============ 日本棋手 ============
  { id: 'iyama', nameCN: '井山裕太', nameEN: 'Iyama Yuta', nameJP: '井山裕太', nameKR: '이야마 유타', country: 'JP', rank: '九段', profile: '日本第一人' },
  { id: 'ichiriki', nameCN: '一力辽', nameEN: 'Ichiriki Ryo', nameJP: '一力遼', nameKR: '이치리키료', country: 'JP', rank: '九段' },
  { id: 'shibashare', nameCN: '芝野虎丸', nameEN: 'Shibashare Tomoe', nameJP: '芝野虎丸', nameKR: '시바시레 톰오', country: 'JP', rank: '九段' },
  { id: 'motogakuen', nameCN: '许家元', nameEN: 'Motogakuen Yu', nameJP: '許家元', nameKR: '요트가아와 유', country: 'JP', rank: '九段' },
  { id: 'yosei', nameCN: '余正麒', nameEN: 'Yosei Shin', nameJP: '余正麒', nameKR: '요세이 신', country: 'JP', rank: '八段' },
  { id: 'kohno', nameCN: '河野临', nameEN: 'Kohno Masaki', nameJP: '河野臨', nameKR: '고노 마사키', country: 'JP', rank: '九段' },
  { id: 'hane', nameCN: '羽根直树', nameEN: 'Hane Naoki', nameJP: '羽根直樹', nameKR: '하네 나오키', country: 'JP', rank: '九段' },
  { id: 'takao', nameCN: '高尾绅路', nameEN: 'Takao Shinji', nameJP: '高尾紳路', nameKR: '타카오 신지', country: 'JP', rank: '九段' },
  { id: 'cho', nameCN: '赵治勋', nameEN: 'Cho Chikun', nameJP: '趙治勳', nameKR: '조치훈', country: 'JP', rank: '九段', profile: '传奇' },
  { id: 'kobayashi', nameCN: '小林光一', nameEN: 'Kobayashi Koichi', nameJP: '小林光一', nameKR: '고바야시 코이치', country: 'JP', rank: '九段', profile: '传奇' },
  { id: 'sakai', nameCN: '坂井秀至', nameEN: 'Sakai Hideyuki', nameJP: '坂井秀至', country: 'JP', rank: '八段' },
  { id: 'murakawa', nameCN: '村川大介', nameEN: 'Murakawa Daisuke', nameJP: '村川大介', country: 'JP', rank: '八段' },
  { id: 'ichiriki2', nameCN: '藤泽里菜', nameEN: 'Fujisawa Rina', nameJP: '藤沢里菜', country: 'JP', rank: '五段', profile: '女子本因坊' },
  { id: 'nokata', nameCN: '上野爱咲美', nameEN: 'Nokata Aya', nameJP: '上野愛咲美', country: 'JP', rank: '四段', profile: '女子新星' },
  
  // ============ 韩国棋手 ============
  { id: 'shin', nameCN: '申真谞', nameEN: 'Shin Jinseo', nameJP: '申真諝', nameKR: '신진서', country: 'KR', rank: '九段', profile: '韩国第一人' },
  { id: 'park', nameCN: '朴廷桓', nameEN: 'Park Junghwan', nameJP: '朴廷桓', nameKR: '박정환', country: 'KR', rank: '九段' },
  { id: 'byun', nameCN: '卞相壹', nameEN: 'Byun Sangil', nameJP: '卞相壹', nameKR: '변상일', country: 'KR', rank: '九段' },
  { id: 'shinmin', nameCN: '申旻埈', nameEN: 'Shin Minjun', nameJP: '申旻埈', nameKR: '신민준', country: 'KR', rank: '九段' },
  { id: 'kim', nameCN: '金明训', nameEN: 'Kim Myeonghoon', nameJP: '金明訓', nameKR: '김명훈', country: 'KR', rank: '九段' },
  { id: 'parkkyu', nameCN: '朴键昊', nameEN: 'Park Keumho', nameJP: '朴鍵昊', nameKR: '박검호', country: 'KR', rank: '八段' },
  { id: 'han', nameCN: '韩升周', nameEN: 'Han Seungjoo', nameJP: '韓昇周', nameKR: '한승주', country: 'KR', rank: '八段' },
  { id: 'chojeong', nameCN: '崔精', nameEN: 'Cho Jeong', nameJP: '崔精', nameKR: '최정', country: 'KR', rank: '九段', profile: '女子第一人' },
  { id: 'kimyj', nameCN: '金恩持', nameEN: 'Kim Eunji', nameJP: '金恩持', nameKR: '김은지', country: 'KR', rank: '三段', profile: '女子新星' },
  { id: 'lee', nameCN: '李昌镐', nameEN: 'Lee Changho', nameJP: '李昌鎬', nameKR: '이창호', country: 'KR', rank: '九段', profile: '传奇' },
  { id: 'leejh', nameCN: '李世石', nameEN: 'Lee Sedol', nameJP: '李世石', nameKR: '이세돌', country: 'KR', rank: '九段', profile: '传奇' },
  { id: 'parkjty', nameCN: '朴永训', nameEN: 'Park Yeonghun', nameJP: '朴永訓', nameKR: '박영훈', country: 'KR', rank: '九段' },
  { id: 'hong', nameCN: '洪旼杓', nameEN: 'Hong Minpyo', nameJP: '洪旼杓', nameKR: '홍민표', country: 'KR', rank: '九段' },
  { id: 'choih', nameCN: '崔哲瀚', nameEN: 'Choi Cheolhan', nameJP: '崔哲瀚', nameKR: '최철한', country: 'KR', rank: '九段' },

  // ============ AI棋手 ============
  { id: 'katago', nameCN: 'KataGo', nameEN: 'KataGo', nameJP: 'KataGo', nameKR: 'KataGo', country: 'CN', rank: 'AI', profile: '开源AI' },
  { id: 'alphago', nameCN: 'AlphaGo', nameEN: 'AlphaGo', nameJP: 'AlphaGo', nameKR: 'AlphaGo', country: 'CN', rank: 'AI', profile: 'DeepMind' },
  { id: 'jueyi', nameCN: '绝艺', nameEN: 'JueYi', nameJP: '絶芸', nameKR: '졀예', country: 'CN', rank: 'AI', profile: '腾讯AI' },
  { id: 'xingzhen', nameCN: '星阵', nameEN: 'XingZhen', nameJP: '星陣', nameKR: '성진', country: 'CN', rank: 'AI', profile: 'AI公司' },
  { id: 'leela', nameCN: 'Leela Zero', nameEN: 'Leela Zero', nameJP: 'Leela Zero', nameKR: 'Leela Zero', country: 'CN', rank: 'AI', profile: '开源AI' },
  { id: 'gnugo', nameCN: 'GNU Go', nameEN: 'GNU Go', nameJP: 'GNU Go', nameKR: 'GNU Go', country: 'CN', rank: 'AI', profile: '开源AI' },
  { id: 'ags', nameCN: 'Aya', nameEN: 'Aya', nameJP: 'Aya', nameKR: 'Aya', country: 'CN', rank: 'AI', profile: '开源AI' }
];

// 按国家分组
export const playersByCountry = {
  CN: players.filter(p => p.country === 'CN'),
  JP: players.filter(p => p.country === 'JP'),
  KR: players.filter(p => p.country === 'KR'),
  AI: players.filter(p => p.rank === 'AI')
};

// 搜索棋手（支持任意语言）
export function searchPlayers(query: string): Player[] {
  if (!query.trim()) return [];
  
  const q = query.toLowerCase();
  return players.filter(p => 
    p.nameCN.toLowerCase().includes(q) ||
    p.nameEN.toLowerCase().includes(q) ||
    p.nameJP?.toLowerCase().includes(q) ||
    p.nameKR?.toLowerCase().includes(q)
  );
}

// 获取棋手的所有名字
export function getPlayerAllNames(player: Player): string[] {
  const names = [player.nameCN, player.nameEN];
  if (player.nameJP) names.push(player.nameJP);
  if (player.nameKR) names.push(player.nameKR);
  return names;
}

// 获取棋手显示名称
export function getPlayerDisplayName(player: Player): string {
  return `${player.nameCN} (${player.nameEN})`;
}
