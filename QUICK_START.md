# 快速启动检查清单

## 启动步骤

### 1. 准备环境
```bash
cd /root/code/vscode-claude
npm install
npm run compile
```

### 2. 在 VSCode 中打开项目
```bash
code /root/code/vscode-claude
```

### 3. 启动调试 (两种方式)

**方式 A: 使用 F5**
- 直接按 `F5` 键

**方式 B: 使用菜单**
1. 点击左侧 "Run and Debug" 图标 (Ctrl+Shift+D)
2. 点击绿色播放按钮 "Run Extension"

### 4. 检查扩展是否加载

会打开一个新窗口，标题显示 `[Extension Development Host]`

#### 在原始窗口检查:
1. 打开 **Debug Console** (Ctrl+Shift+Y)
2. 应该看到以下日志:
   ```
   🚀 UltraThink extension is now active!
   ✅ Terminal manager initialized
   ✅ Tree view created for ultrathinkView
   ✅ Commands registered
   ✅ UltraThink extension fully activated
   ```

#### 在新窗口检查:
1. 右下角应该有通知: "UltraThink extension activated! Click the Claude Code icon in the activity bar."
2. **左侧活动栏应该有 Claude Code 图标** (一个方框和勾的图标)

### 5. 使用扩展

1. **点击活动栏的 Claude Code 图标**
   - 左侧会打开 UltraThink 侧边栏
   - 看到 "New Terminal" 按钮

2. **检查 Debug Console (原始窗口)**
   应该看到:
   ```
   👁️  View visibility changed: true
   🔨 Creating initial terminal
   🔧 Creating terminal: UltraThink 1
   ⚡ Sending 'yolo' command to UltraThink 1
   ✅ Terminal UltraThink 1 created successfully. Total terminals: 1
   ```

3. **检查终端面板 (新窗口)**
   - 底部应该自动打开终端
   - 终端名称: "UltraThink 1"
   - 应该自动执行 `yolo` 命令

### 6. 测试多 Tab 功能

1. 在侧边栏点击 "New Terminal"
2. 会创建 "UltraThink 2"
3. 点击侧边栏的终端名称可以切换

## 故障排查

### 问题: 看不到图标

**解决方案 1: 检查扩展是否运行**
在 Extension Development Host 窗口:
```
Ctrl+Shift+P -> "Developer: Show Running Extensions"
```
搜索 "ultrathink"，应该显示激活状态

**解决方案 2: 手动打开视图**
```
Ctrl+Shift+P -> "UltraThink"
```
应该能看到相关命令

**解决方案 3: 查看错误日志**
在原始窗口:
1. View -> Output
2. 下拉选择 "Extension Host"
3. 查看错误信息

### 问题: 扩展不激活

检查 package.json 中的 `activationEvents`:
```json
"activationEvents": [
    "onView:ultrathinkView"
]
```

手动触发激活:
```
Ctrl+Shift+P -> "Views: Focus on UltraThink View"
```

### 问题: 终端不自动运行 yolo

在 Debug Console 查看是否有:
```
⚡ Sending 'yolo' command to UltraThink X
```

如果没有，检查 terminalManager.ts 是否正确编译。

## 开发模式

### 监听文件变化自动编译
```bash
npm run watch
```

### 重新加载扩展
在 Extension Development Host 窗口:
```
Ctrl+Shift+P -> "Developer: Reload Window"
```

或者直接 `Ctrl+R`
