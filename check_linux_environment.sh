#!/bin/bash
# 🐧 ПРОВЕРКА LINUX ОКРУЖЕНИЯ

echo "🎊🔥🚀 ПРОВЕРЯЕМ ЧТО МЫ В LINUX! 🚀🔥🎊"
echo ""

# ========================================
# ОСНОВНЫЕ ПРОВЕРКИ LINUX
# ========================================

echo "🔍 ОСНОВНЫЕ ПРОВЕРКИ:"
echo ""

# 1. Операционная система
echo "1️⃣ ОПЕРАЦИОННАЯ СИСТЕМА:"
if [ -f /etc/os-release ]; then
    echo "   📋 OS Info:"
    cat /etc/os-release | head -3
    echo ""
else
    echo "   ❌ Не Linux (нет /etc/os-release)"
fi

# 2. Kernel info
echo "2️⃣ KERNEL:"
echo "   🐧 Kernel: $(uname -s)"
echo "   🔢 Version: $(uname -r)"
echo "   🏗️ Architecture: $(uname -m)"
echo ""

# 3. Hostname
echo "3️⃣ HOSTNAME:"
echo "   🖥️ Host: $(hostname)"
echo ""

# 4. Current directory
echo "4️⃣ ТЕКУЩАЯ ПАПКА:"
echo "   📁 PWD: $(pwd)"
echo "   📂 Contents:"
ls -la | head -10
echo ""

# 5. Available tools
echo "5️⃣ ДОСТУПНЫЕ ИНСТРУМЕНТЫ:"
echo "   🟢 Bash: $(which bash 2>/dev/null || echo '❌ Not found')"
echo "   🟢 Node: $(which node 2>/dev/null || echo '❌ Not found')"
echo "   🟢 NPM: $(which npm 2>/dev/null || echo '❌ Not found')"
echo "   🟢 Git: $(which git 2>/dev/null || echo '❌ Not found')"
echo ""

# ========================================
# DOCKER CONTAINER ПРОВЕРКИ
# ========================================

echo "🐳 DOCKER CONTAINER ПРОВЕРКИ:"
echo ""

# Проверка что мы в контейнере
if [ -f /.dockerenv ]; then
    echo "   ✅ Мы внутри Docker контейнера!"
    echo "   📋 Docker info:"
    cat /.dockerenv 2>/dev/null || echo "   🔸 Empty .dockerenv"
else
    echo "   ⚠️ Не в Docker контейнере (и