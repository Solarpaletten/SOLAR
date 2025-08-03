#!/bin/bash
# 🚀 MASTER LAUNCHER - ВСЕ РАКЕТЫ TABBOOK

echo "🎊🔥🚀 ЗАПУСК ВСЕХ РАКЕТ TABBOOK! 🚀🔥🎊"
echo ""

# Делаем все скрипты исполняемыми
chmod +x scripts/rockets/*.sh

echo "🚀 Запускаем последовательность ракет..."
echo ""

# Запускаем по очереди
echo "1️⃣ РАКЕТА #1: Создание компонента"
./scripts/rockets/rocket1_create_file.sh
echo ""

echo "2️⃣ РАКЕТА #2: Добавление роутинга"
./scripts/rockets/rocket2_add_routing.sh
echo ""

echo "3️⃣ РАКЕТА #3: Интеграция в sidebar"
./scripts/rockets/rocket3_add_sidebar.sh
echo ""

echo "🎊 ВСЕ РАКЕТЫ ЗАПУЩЕНЫ! TABBOOK ИНТЕГРИРОВАН!"
echo ""
echo "🎯 СЛЕДУЮЩИЙ ШАГ:"
echo "   cd f && npm run dev"
echo "   Открой: http://localhost:5173/tabbook"
