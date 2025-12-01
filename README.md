# ✨ UltraThink - Claude Code Extension

一个超级简单的 VSCode/Cursor 扩展，自动在右边分屏运行终端！

## ✨ 特性

- ✨ **Claude 官方图标** - 点击左边活动栏的 Claude 图标
- 📺 **右边分屏** - 终端自动在右边分屏显示
- 🎯 **自动运行** - 每个终端自动执行 `yolo` 命令
- 📑 **多标签支持** - 创建多个终端，都在右边窗口显示为 tab
- 📋 **Session 管理** - 查看和恢复之前的 Claude 对话
- ⚡ **一键安装** - 使用 `publish.sh` 一键打包安装

## 🚀 快速开始

### 方法1：一键安装（推荐）

```bash
cd /root/code/vscode-claude
./publish.sh
```

然后：
1. 重启 VSCode/Cursor
2. 看左边有没有 Claude 图标 ✨
3. 点它！

### 方法2：开发模式

```bash
npm install
npm run compile
code .  # 打开 VSCode
# 按 F5 启动调试
```

## 📖 文档

- **[START_HERE.md](START_HERE.md)** - 新手教程（3岁小孩都能看懂！）
- **[HOW_TO_PUBLISH.md](HOW_TO_PUBLISH.md)** - 发布和分享教程
- **[INSTALL.md](INSTALL.md)** - 超简单安装指引
- **[WHERE_IS_TERMINAL.md](WHERE_IS_TERMINAL.md)** - 终端会在哪里显示？

## 🎯 使用方法

1. 点击左边活动栏的 **Claude 图标** ✨
2. 侧边栏显示：
   - **New Terminal** 按钮 - 创建新终端
   - **Sessions** 区域 - 之前的 Claude 对话（点击可恢复）
   - **Terminals** 区域 - 当前活动终端
3. 点击 "New Terminal" 后，屏幕**自动分屏**：
   - **左边** = 你的代码
   - **右边** = 终端（自动运行 `yolo`）
4. 点击 Session 可以恢复之前的对话

## 🎨 效果图

**侧边栏结构：**
```
ULTRATHINK
├── ⚡ New Terminal
├── 🕐 ── Sessions ──  [🔄]
│   ├── 🔄 Fix login bug  (2m ago)
│   └── 🔄 Add dark mode  (1h ago)
└── 💻 ── Terminals ──
    └── 💻 UltraThink 1
```

**分屏效果：**
```
┌──────────────┬──────────────┐
│ 左边         │ ✨ 右边      │
│              │ [Terminal 1] │
│ 你的代码     │ [Terminal 2] │
│              │ [Terminal 3] │
│              │              │
│              │ $ yolo       │
└──────────────┴──────────────┘
```

## 🛠️ 开发

### 编译

```bash
npm run compile
```

### 监听模式

```bash
npm run watch
```

### 打包

```bash
./publish.sh
```

## 📦 分享给朋友

运行 `./publish.sh` 会生成 `ultrathink-0.0.1.vsix` 文件。

分享这个文件，朋友可以这样安装：

```bash
code --install-extension ultrathink-0.0.1.vsix
# 或
cursor --install-extension ultrathink-0.0.1.vsix
```

## 🤝 贡献

这个项目分 5 个 milestone 开发：

1. 基础扩展结构
2. 活动栏图标 + 侧边栏
3. 终端集成 + 自动运行 `yolo`
4. 多 tab 支持 + 右边分屏
5. Session 管理 + 恢复对话

查看 git 历史了解更多！

## 📄 许可证

MIT

---

**不知道怎么开始？** 👉 看 [START_HERE.md](START_HERE.md)
