#!/bin/bash

echo "🚀 UltraThink 测试脚本"
echo "===================="
echo ""

# Step 1: 安装依赖
echo "📦 第1步: 安装需要的东西..."
npm install

# Step 2: 编译
echo ""
echo "🔨 第2步: 编译代码..."
npm run compile

# Step 3: 检查文件
echo ""
echo "✅ 第3步: 检查文件是否都在..."

if [ -f "out/extension.js" ]; then
    echo "  ✓ extension.js 存在"
else
    echo "  ✗ extension.js 不存在 - 编译失败!"
    exit 1
fi

if [ -f "resources/claude-icon.svg" ]; then
    echo "  ✓ 图标文件存在"
else
    echo "  ✗ 图标文件不存在!"
    exit 1
fi

if [ -f "package.json" ]; then
    echo "  ✓ package.json 存在"
else
    echo "  ✗ package.json 不存在!"
    exit 1
fi

echo ""
echo "🎉 准备完成！"
echo ""
echo "📖 下一步："
echo "  1. 在 VSCode 中打开这个文件夹: code ."
echo "  2. 按 F5 键"
echo "  3. 看左边有没有一个紫色圆圈的图标 (字母 C)"
echo ""
echo "如果还是看不到，告诉我你按 F5 后右下角出现了什么消息！"
