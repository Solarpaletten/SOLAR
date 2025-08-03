#!/bin/bash

echo "🎊🔥🔍 ДИАГНОСТИРУЕМ ТОЛЬКО BACKEND! 🔍🔥🎊"
echo ""
echo "🎯 ЦЕЛЬ: Проверить работу backend после GitHub sync"
echo "⚠️  FRONTEND НЕ ТРОГАЕМ!"
echo ""

echo "1️⃣ ПРОВЕРЯЕМ PM2 СТАТУС:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pm2 status

echo ""
echo "2️⃣ ПРОВЕРЯЕМ ЛОГИ BACKEND:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Последние 10 строк логов solar-backend:"
pm2 logs solar-backend --lines 10 --nostream

echo ""
echo "3️⃣ ПРОВЕРЯЕМ ПОРТЫ И СОЕДИНЕНИЯ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Проверяем кто слушает порт 3001 (backend):"
lsof -i :3001 || netstat -tulpn | grep :3001

echo ""
echo "🔍 Проверяем кто слушает порт 5432 (PostgreSQL):"
lsof -i :5432 || netstat -tulpn | grep :5432

echo ""
echo "4️⃣ ТЕСТИРУЕМ API ЭНДПОИНТЫ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🌐 Тестируем основной эндпоинт:"
curl -s http://localhost:3001/ | head -5 || echo "❌ Основной эндпоинт недоступен"

echo ""
echo "🌐 Тестируем health check:"
curl -s http://localhost:3001/health | head -5 || echo "❌ Health check недоступен"

echo ""
echo "🌐 Тестируем API статус:"
curl -s http://localhost:3001/api/status | head -5 || echo "❌ API статус недоступен"

echo ""
echo "5️⃣ ПРОВЕРЯЕМ BACKEND ФАЙЛЫ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd b

echo "📁 BACKEND ДИРЕКТОРИЯ: $(pwd)"
echo ""

echo "📄 Основные файлы backend:"
ls -la | grep -E '\.(js|json|env)$' | head -10

echo ""
echo "🔍 package.json backend:"
if [ -f "package.json" ]; then
    echo "✅ package.json найден"
    echo "📦 Название: $(grep '"name"' package.json)"
    echo "📦 Версия: $(grep '"version"' package.json)"
else
    echo "❌ package.json НЕ НАЙДЕН!"
fi

echo ""
echo "🔍 app.js или main файл:"
if [ -f "app.js" ]; then
    echo "✅ app.js найден"
elif [ -f "src/app.js" ]; then
    echo "✅ src/app.js найден"
elif [ -f "index.js" ]; then
    echo "✅ index.js найден"
else
    echo "❌ Главный файл приложения не найден!"
    echo "📂 Содержимое директории:"
    ls -la
fi

echo ""
echo "6️⃣ ПРОВЕРЯЕМ ENVIRONMENT VARIABLES:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f ".env" ]; then
    echo "✅ .env файл найден"
    echo "🔐 Environment переменные (без секретных данных):"
    grep -E '^[A-Z_]+=.*' .env | grep -v -E '(PASSWORD|SECRET|KEY)' | head -5
else
    echo "❌ .env файл НЕ НАЙДЕН!"
fi

echo ""
echo "7️⃣ ПРОВЕРЯЕМ DATABASE СОЕДИНЕНИЕ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🗄️ Проверяем доступность PostgreSQL:"
pg_isready -h localhost -p 5432 || echo "⚠️ PostgreSQL может быть недоступен"

echo ""
echo "🔍 Проверяем соединение с базой (если есть psql):"
if command -v psql &> /dev/null; then
    echo "✅ psql доступен"
    # Пробуем подключиться к базе
    psql -h localhost -p 5432 -U solar_user -d solar -c "SELECT version();" 2>/dev/null | head -3 || echo "⚠️ Не удалось подключиться к базе"
else
    echo "⚠️ psql не установлен"
fi

echo ""
echo "8️⃣ ПРОВЕРЯЕМ СИСТЕМНЫЕ РЕСУРСЫ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "💾 Использование памяти:"
free -h | head -2

echo ""
echo "💽 Использование диска:"
df -h | head -3

echo ""
echo "⚡ Load average:"
uptime

echo ""
echo "9️⃣ ФИНАЛЬНАЯ ДИАГНОСТИКА:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🔍 Последние error логи (если есть):"
pm2 logs solar-backend --err --lines 5 --nostream 2>/dev/null || echo "Нет error логов"

echo ""
echo "🎯 СТАТУС BACKEND ДИАГНОСТИКИ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Проверяем что backend действительно отвечает
if curl -s http://localhost:3001/ > /dev/null; then
    echo "✅ BACKEND РАБОТАЕТ - отвечает на запросы"
else
    echo "❌ BACKEND НЕ ОТВЕЧАЕТ - требует исправления"
fi

# Проверяем PM2 процесс
if pm2 list | grep -q "online.*solar-backend"; then
    echo "✅ PM2 ПРОЦЕСС АКТИВЕН"
else
    echo "❌ PM2 ПРОЦЕСС ПРОБЛЕМНЫЙ"
fi

echo ""
echo "🎊 ДИАГНОСТИКА BACKEND ЗАВЕРШЕНА!"
echo ""
echo "💡 СЛЕДУЮЩИЕ ШАГИ:"
echo "1️⃣ Покажи результаты диагностики"
echo "2️⃣ Исправлю найденные проблемы"
echo "3️⃣ Перезапустим backend если нужно"
echo "4️⃣ Протестируем API эндпоинты"
echo ""
echo "⚠️  FRONTEND ОСТАЁТСЯ НЕТРОНУТЫМ!"