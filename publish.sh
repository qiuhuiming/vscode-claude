#!/bin/bash

echo "🚀 UltraThink 一键发布脚本"
echo "=========================="
echo ""
echo "给3岁小孩准备的超级简单版！"
echo ""

# 第1步：编译代码
echo "📦 第1步: 编译代码..."
npm run compile
if [ $? -ne 0 ]; then
    echo "❌ 编译失败！"
    exit 1
fi
echo "✅ 编译成功！"
echo ""

# 第2步：安装打包工具
echo "🔧 第2步: 安装打包工具..."
if ! command -v vsce &> /dev/null; then
    echo "   正在安装 vsce..."
    npm install -g @vscode/vsce
else
    echo "   ✓ vsce 已经安装了"
fi
echo ""

# 第3步：打包扩展
echo "📦 第3步: 打包扩展..."
vsce package --no-git-tag-version
if [ $? -ne 0 ]; then
    echo "❌ 打包失败！"
    exit 1
fi
echo "✅ 打包成功！"
echo ""

# 找到生成的 .vsix 文件
VSIX_FILE=$(ls -t *.vsix 2>/dev/null | head -1)

if [ -z "$VSIX_FILE" ]; then
    echo "❌ 找不到 .vsix 文件！"
    exit 1
fi

echo "📦 生成的文件: $VSIX_FILE"
echo ""

# 第4步：安装到 VSCode
echo "🎯 第4步: 安装到编辑器..."
INSTALLED=false

# 尝试安装到 code (VSCode)
if command -v code &> /dev/null; then
    echo "   → 正在安装到 VSCode..."
    code --install-extension "$VSIX_FILE"
    if [ $? -eq 0 ]; then
        echo "   ✅ VSCode 安装成功！"
        INSTALLED=true
    fi
fi

# 尝试安装到 cursor
if command -v cursor &> /dev/null; then
    echo "   → 正在安装到 Cursor..."
    cursor --install-extension "$VSIX_FILE"
    if [ $? -eq 0 ]; then
        echo "   ✅ Cursor 安装成功！"
        INSTALLED=true
    fi
fi

echo ""

if [ "$INSTALLED" = true ]; then
    echo "🎉 完成！扩展已经安装好了！"
    echo ""
    echo "📖 下一步："
    echo "  1. 重启 VSCode 或 Cursor"
    echo "  2. 看左边有没有紫色圆圈 🟣"
    echo "  3. 点它！开始使用！"
    echo ""
    echo "💾 打包文件保存在: $VSIX_FILE"
    echo "   (你可以分享这个文件给朋友！)"
else
    echo "⚠️  没找到 VSCode 或 Cursor"
    echo ""
    echo "📖 手动安装方法："
    echo "  1. 打开 VSCode 或 Cursor"
    echo "  2. 按 Ctrl+Shift+P (或 Cmd+Shift+P)"
    echo "  3. 输入: Install from VSIX"
    echo "  4. 选择这个文件: $VSIX_FILE"
fi

echo ""
echo "✨ 大功告成！✨"
