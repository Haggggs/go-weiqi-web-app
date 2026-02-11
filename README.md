# 围棋Web应用

基于React 18 + TypeScript开发的现代化围棋Web应用。

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发环境启动
```bash
npm run dev
```

应用将在 http://localhost:3000 启动

### 构建生产版本
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

### 代码格式化
```bash
npm run format
```

### 运行测试
```bash
npm test
```

### 类型检查
```bash
npm run type-check
```

## 🛠️ 技术栈

### 核心技术
- **React 18** - 用户界面框架
- **TypeScript** - 类型安全的JavaScript
- **Vite** - 快速的构建工具
- **Redux Toolkit** - 状态管理
- **Tailwind CSS** - 样式框架

### 开发工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Jest** - 单元测试
- **React Testing Library** - React组件测试

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── Header.tsx      # 页面头部
│   └── WeiqiBoard.tsx  # 围棋棋盘组件
├── slices/             # Redux状态切片
│   └── weiqiSlice.ts   # 围棋游戏状态管理
├── store.ts            # Redux store配置
├── App.tsx            # 应用主组件
├── main.tsx           # 应用入口
└── index.css          # 全局样式
```

## 🎯 功能特性

### 当前实现
- ✅ 19×19棋盘渲染
- ✅ 黑白棋子交替落子
- ✅ 棋盘坐标显示 (A-T, 1-19)
- ✅ 星位标记
- ✅ 悔棋功能
- ✅ 重新开始
- ✅ 提子计数
- ✅ 最后落子标记

### 技术特性
- 🎨 响应式设计
- ⚡ 高性能渲染
- 🔒 TypeScript类型安全
- 🧪 完整的测试覆盖
- 📝 代码质量保证

## 🎮 使用方法

1. **落子**: 点击棋盘交叉点放置棋子
2. **悔棋**: 点击"悔棋"按钮撤销上一步
3. **重新开始**: 点击"重新开始"按钮重置游戏
4. **查看状态**: 头部显示当前回合和提子数

## 📈 开发计划

### Phase 1 - 基础功能 ✅
- [x] 项目初始化
- [x] 棋盘渲染
- [x] 基本落子功能
- [x] 悔棋功能

### Phase 2 - 游戏逻辑 🚧
- [ ] 吃子规则实现
- [ ] 禁着点检测
- [ ] 劫争处理
- [ ] 终局判定

### Phase 3 - 高级功能 📋
- [ ] 棋谱记录与回放
- [ ] AI对手
- [ ] 网络对战
- [ ] 棋谱分析

### Phase 4 - 用户体验 🎨
- [ ] 动画效果
- [ ] 音效支持
- [ ] 主题切换
- [ ] 移动端适配

## 🔧 配置说明

### ESLint配置
- 严格模式开启
- TypeScript规则
- React Hooks规则
- 代码格式化规则

### Prettier配置
- 使用单引号
- 分号结尾
- 2空格缩进
- 80字符行宽

### Jest配置
- DOM环境模拟
- 覆盖率报告
- 快照测试
- 模块映射

## 📝 开发规范

### 组件开发
- 使用函数组件和Hooks
- 类型明确的Props定义
- 合理的组件拆分
- 完整的单元测试

### 状态管理
- 使用Redux Toolkit管理全局状态
- 合理的状态切片设计
- 异步处理使用createAsyncThunk
- 类型安全的selectors

### 代码风格
- 遵循ESLint和Prettier规则
- 使用TypeScript类型注解
- 清晰的代码注释
- 统一的命名规范

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交变更
4. 推送到分支
5. 创建Pull Request

## 📄 许可证

MIT License

## 👨‍💻 技术负责人

**阿毛** - 全栈开发技术负责人
- 专业: React, TypeScript, 状态管理
- 目标: 高质量代码, 优秀用户体验
- 方式: 持续优化, 迭代开发

---

**开始你的围棋之旅！** 🎯