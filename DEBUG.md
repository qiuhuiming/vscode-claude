# 调试指南

## 如何运行和调试扩展

### 步骤 1: 打开项目
```bash
code /root/code/vscode-claude
```

### 步骤 2: 编译项目
在 VSCode 中打开终端 (Ctrl+`)，运行:
```bash
npm install
npm run compile
```

### 步骤 3: 启动调试
- 按 `F5` 或者点击 "Run and Debug" (Ctrl+Shift+D)
- 这会打开一个新的 VSCode 窗口，标题为 `[Extension Development Host]`

### 步骤 4: 查看调试输出
在原始 VSCode 窗口中:
1. 打开 "Debug Console" (Ctrl+Shift+Y)
2. 你应该看到: `UltraThink extension is now active`

### 步骤 5: 查找 Claude Code 图标
在新打开的 `[Extension Development Host]` 窗口中:
1. 查看左侧活动栏 (Activity Bar)
2. 应该有一个 Claude Code 图标 (方框和勾的 SVG 图标)
3. 点击它应该在左侧打开 UltraThink 侧边栏

## 常见问题排查

### 问题 1: 看不到图标

**检查 1: 扩展是否激活**
- 打开 Debug Console，查找 "UltraThink extension is now active"
- 如果没有看到，扩展没有激活

**检查 2: 查看 Output 面板**
- View -> Output
- 下拉菜单选择 "Extension Host"
- 查看是否有错误信息

**检查 3: 检查扩展列表**
- 在 Extension Development Host 窗口
- Ctrl+Shift+P -> "Show Running Extensions"
- 查找 "ultrathink" 扩展

**检查 4: 手动触发视图**
- Ctrl+Shift+P
- 输入 "Focus on UltraThink View"
- 应该能打开侧边栏

### 问题 2: 扩展激活但没有图标

可能是图标路径问题。运行:
```bash
ls -la /root/code/vscode-claude/resources/claude-icon.svg
```

### 问题 3: 终端没有自动运行 yolo

检查终端是否创建:
1. 打开侧边栏后，应该自动创建一个终端
2. 查看底部的终端面板
3. 应该有一个名为 "UltraThink 1" 的终端

## 查看所有激活的扩展

在 Extension Development Host 窗口:
```
Ctrl+Shift+P -> "Developer: Show Running Extensions"
```

查找 "ultrathink" - 应该显示状态和激活原因。

## 重新编译并重启

如果修改了代码:
1. 在原始窗口运行 `npm run compile`
2. 在 Extension Development Host 窗口: Ctrl+Shift+P -> "Developer: Reload Window"
