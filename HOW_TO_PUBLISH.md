# 🎈 如何发布（3岁小孩版）

## 🎯 你要做的事：

把这个扩展装到你的 VSCode 或 Cursor 里！

---

## ⚡ 超级简单！就一行命令！

打开终端，复制粘贴这个：

```bash
cd /root/code/vscode-claude
./publish.sh
```

按回车！

---

## 🎬 等它跑完！

你会看到：

```
🚀 UltraThink 一键发布脚本
==========================

📦 第1步: 编译代码...
✅ 编译成功！

🔧 第2步: 安装打包工具...
✅ 安装成功！

📦 第3步: 打包扩展...
✅ 打包成功！

🎯 第4步: 安装到编辑器...
✅ VSCode 安装成功！
✅ Cursor 安装成功！

🎉 完成！
```

---

## 🎊 就这样！完成了！

现在：
1. **关闭** VSCode/Cursor（完全关掉）
2. **重新打开** VSCode/Cursor
3. **看左边** 有没有紫色圆圈 🟣
4. **点它！** 开始用！

---

## 📤 想分享给朋友？

脚本会创建一个 `.vsix` 文件，比如 `ultrathink-0.0.1.vsix`

把这个文件发给朋友，他们可以这样安装：

### 方法1：拖拽安装
1. 打开 VSCode/Cursor
2. 把 `.vsix` 文件拖进去
3. 点 "Install"

### 方法2：命令安装
```bash
code --install-extension ultrathink-0.0.1.vsix
```

或者

```bash
cursor --install-extension ultrathink-0.0.1.vsix
```

---

## 🆘 出错了？

### 问题1: "command not found: vsce"

没关系！脚本会自动安装的！

### 问题2: "没找到 VSCode 或 Cursor"

手动安装：
1. 打开 VSCode/Cursor
2. 按 `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)
3. 输入: `Install from VSIX`
4. 选择生成的 `.vsix` 文件

### 问题3: "编译失败"

运行这个：
```bash
npm install
npm run compile
```

然后再运行 `./publish.sh`

---

## 🎮 测试是否成功

1. 重启 VSCode/Cursor
2. 看左边活动栏有没有紫色圆圈 🟣
3. 点它！
4. 点 "New Terminal"
5. 右边分屏出现终端！
6. 自动运行 `yolo`！

**成功了！** 🎉

---

## 🚀 更新版本

如果你改了代码，想重新发布：

1. 改 `package.json` 的版本号：
   ```json
   "version": "0.0.2"  // 改成新版本
   ```

2. 再运行一次：
   ```bash
   ./publish.sh
   ```

就这么简单！

---

就这样！3岁小孩都能学会！💪
