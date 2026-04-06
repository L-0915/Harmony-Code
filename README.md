# Harmony Code

> 遥遥领先，中华有为

Harmony Code 是基于 [Claude Code](https://github.com/anthropics/claude-code) 的中文品牌定制版，将 Claude 的螃蟹吉祥物替换为华为花瓣 Logo（二进制数字艺术），主题色改为华为红，打造国产自主研发风格。

![Harmony Code](https://img.shields.io/badge/Harmony-Code-C7000B?style=for-the-badge&logo=huawei&logoColor=white)

## 特性

- 华为花瓣 Logo（0/1 二进制数字矩阵，11 行）
- 华为红主题色（`#C7000B`）
- 中文欢迎语：「遥遥领先，中华有为」
- 中文品牌名：「Harmony Code」
- 计费页面：「国产自主研发 · 鸿蒙生态」
- 支持紧凑模式（单框）和水平模式（双框）两种布局

## 前置要求

1. **Node.js** >= 18
2. **Claude Code** 已安装并登录（Harmony Code 依赖 Claude Code 的 npm 包）

```bash
# 安装 Claude Code（如果还没有）
npm install -g @anthropic-ai/claude-code

# 登录 Claude
claude
```

> 你需要一个有效的 Anthropic API 密钥或 Claude Pro/Max 订阅。Harmony Code 的核心功能完全等价于 Claude Code，所有配置和认证方式完全相同。

## 安装

### 方式一：一键安装（推荐）

```bash
git clone https://github.com/L-0915/Harmony-Code.git
cd Harmony-Code
npm run setup
```

`setup` 脚本会自动：
1. 从本地已安装的 Claude Code 复制 `cli.js`
2. 应用所有品牌补丁
3. 全局安装 `harmony` 命令

### 方式二：手动安装

```bash
git clone https://github.com/L-0915/Harmony-Code.git
cd Harmony-Code

# 1. 从本地 Claude Code 复制最新 cli.js
node scripts/extract.js

# 2. 应用品牌补丁
node scripts/patch.js

# 3. 全局安装
npm install -g .
```

## 使用

安装完成后，在任何终端中运行：

```bash
harmony
```

所有 Claude Code 命令和功能完全可用：

```bash
harmony "帮我写一个 Python 脚本"
harmony /help
harmony /compact
```

## 升级

当 Claude Code 发布新版本后，重新运行安装即可：

```bash
cd Harmony-Code
git pull
npm run setup
```

> `setup` 会自动检测本地 Claude Code 版本并重新应用补丁。

## 工作原理

```
Claude Code (npm)          Harmony Code (本项目)
     │                            │
     │  复制 cli.js               │
     ├──────────────────────────► │
     │                            │  应用品牌补丁：
     │                            │  - 替换吉祥物组件为华为 Logo
     │                            │  - 修改主题色为华为红
     │                            │  - 中文化界面文本
     │                            │
     │                            │  输出 harmony 命令
     │                            ├──────────────────► 终端
```

Harmony Code 不修改原始 Claude Code 安装，而是复制其 `cli.js` 文件并应用品牌补丁后作为独立命令运行。

## 补丁内容

| 补丁项 | 原始值 | 修改值 |
|--------|--------|--------|
| 主题色 clawd_body | rgb(215,119,87) | rgb(199,0,11) |
| 主题色 claude | rgb(215,119,87) | rgb(199,0,11) |
| 主题色 claudeShimmer | rgb(245,149,117) | rgb(230,50,50) |
| 吉祥物 | 螃蟹（box-drawing 字符） | 华为花瓣（二进制数字） |
| 边框标题 | Claude Code | Harmony Code |
| 欢迎语 | Welcome back! | 遥遥领先，中华有为 |
| 计费 | Claude Enterprise/Team/Pro | 华为企业版/团队版/Harmony Pro |
| API 计费 | API Usage Billing | 国产自主研发 · 鸿蒙生态 |
| 动态 | What's new | 最新动态 |
| 更新日志 | Claude Code changelog | Harmony Code 更新日志 |

## 项目结构

```
Harmony-Code/
├── cli.js              # 已打补丁的 Claude Code 运行文件（由 setup 生成）
├── harmony             # Linux/macOS 启动脚本
├── harmony.cmd         # Windows 启动脚本
├── package.json        # npm 包定义
├── scripts/
│   ├── extract.js      # 从本地 Claude Code 提取 cli.js
│   └── patch.js        # 应用品牌补丁
└── README.md           # 本文件
```

## 兼容性

| 平台 | 状态 |
|------|------|
| Windows (PowerShell, CMD, Git Bash) | ✅ |
| macOS (Terminal, iTerm2) | ✅ |
| Linux (各主流终端) | ✅ |

## 已测试的 Claude Code 版本

| 版本 | 状态 |
|------|------|
| 2.1.92 | ✅ |
| 更早版本请重新运行 setup | ⚠️ |

## 许可证

本项目基于 [Claude Code](https://github.com/anthropics/claude-code) 修改，遵循其原始许可协议。

Harmony Code 仅做品牌定制，核心功能 100% 等价于 Claude Code。所有 AI 能力、API 调用、认证机制均由 Anthropic 提供。
