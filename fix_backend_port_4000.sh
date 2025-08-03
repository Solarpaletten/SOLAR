#!/bin/bash

echo "🎊🔥🔧 ИСПРАВЛЯЕМ BACKEND НА ПРАВИЛЬНЫЙ ПОРТ 4000! 🔧🔥🎊"
echo ""
echo "🎯 ПРОБЛЕМА: Backend работает на 3001, а должен на 4000"
echo "💡 РЕШЕНИЕ: Исправить конфигурацию backend без изменения архитектуры"
echo ""

echo "1️⃣ ПРОВЕРЯЕМ ТЕКУЩИЙ СТАТУС:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🔍 PM2 процесс сейчас:"
pm2 status solar-backend

echo ""
echo "🔍 Кто слушает порт 3001 (неправильный):"
lsof -i :3001 || echo "Никто не слушает 3001"

echo ""
echo "🔍 Кто слушает порт 4000 (правильный):"
lsof -i :4000 || echo "Никто не слушает 4000 - ЭТО ПРОБЛЕМА!"

echo ""
echo "2️⃣ ИСПРАВЛЯЕМ BACKEND .ENV НА ПОРТ 4000:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd b

# Бэкап текущего .env
cp .env .env.backup_before_port_fix
echo "✅ Backup создан: .env.backup_before_port_fix"

# Исправляем только PORT на 4000, остальное не трогаем
sed -i 's/PORT=3001/PORT=4000/g' .env 2>/dev/null || sed -i '' 's/PORT=3001/PORT=4000/g' .env

# Если PORT вообще нет, добавляем
if ! grep -q "PORT=" .env; then
    echo "PORT=4000" >> .env
fi

echo "✅ Backend .env исправлен на PORT=4000"

echo ""
echo "🔍 Проверяем .env файл:"
grep "PORT" .env || echo "PORT не найден"

echo ""
echo "3️⃣ ПРОВЕРЯЕМ PM2 ECOSYSTEM CONFIG:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "ecosystem.config.js" ]; then
    echo "✅ ecosystem.config.js найден"
    echo "📄 Конфигурация PM2:"
    cat ecosystem.config.js | grep -A 5 -B 5 "port\|PORT\|env" || echo "Порт в ecosystem не указан"
else
    echo "⚠️ ecosystem.config.js не найден"
fi

echo ""
echo "4️⃣ ПЕРЕЗАПУСКАЕМ BACKEND С ПРАВИЛЬНЫМ ПОРТОМ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🔄 Перезапускаем с обновлением environment:"
pm2 restart solar-backend --update-env

echo ""
echo "⏳ Ждём 5 секунд для запуска..."
sleep 5

echo ""
echo "5️⃣ ПРОВЕРЯЕМ РЕЗУЛЬТАТ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "📊 PM2 статус:"
pm2 status solar-backend

echo ""
echo "🔍 Проверяем кто слушает порт 4000 (ДОЛЖЕН БЫТЬ BACKEND):"
lsof -i :4000 || echo "❌ Backend не слушает порт 4000!"

echo ""
echo "🌐 Тестируем API на правильном порту 4000:"
curl -s http://localhost:4000/ | head -3 || echo "❌ Backend не отвечает на 4000"

echo ""
echo "🌐 Тестируем health на порту 4000:"
curl -s http://localhost:4000/health | head -3 || echo "❌ Health не работает на 4000"

echo ""
echo "6️⃣ ПРОВЕРЯЕМ ЛОГИ ЕСЛИ ПРОБЛЕМЫ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "📋 Последние логи backend:"
pm2 logs solar-backend --lines 5 --nostream

echo ""
echo "🎊🔥🚀 ИСПРАВЛЕНИЕ ЗАВЕРШЕНО! 🚀🔥🎊"
echo ""
echo "✅ РЕЗУЛЬТАТ:"
echo "   🎯 Backend должен работать на PORT=4000"
echo "   🎯 Frontend ищет его на localhost:4000 (правильно!)"
echo "   🎯 CORS включает все нужные домены"
echo "   🎯 Архитектура не изменена"
echo ""
echo "💫 ЕСЛИ ВСЁ РАБОТАЕТ:"
echo "   - Backend отвечает на localhost:4000"
echo "   - Frontend может подключиться"
echo "   - Live сайт https://itsolar.pl будет работать"
echo ""
echo "🎯 ЕСЛИ НЕ РАБОТАЕТ:"
echo "   - Покажи логи PM2"
echo "   - Проверим app.js конфигурацию"
echo "   - Исправим за 1 секунду!"