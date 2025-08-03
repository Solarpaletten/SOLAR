#!/bin/bash

echo "🎊🔥🔧 ГЛУБОКОЕ ИСПРАВЛЕНИЕ BACKEND PORT! 🔧🔥🎊"
echo ""
echo "🎯 ПРОБЛЕМА: Backend не слушает порт 4000"
echo "💡 РЕШЕНИЕ: Проверить app.js и исправить PORT"
echo ""

cd b

echo "1️⃣ ПОЛНАЯ ДИАГНОСТИКА .ENV:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "📄 Весь .env файл:"
cat .env
echo ""

echo "🔍 Ищем PORT в .env:"
grep -n "PORT" .env || echo "❌ PORT НЕ НАЙДЕН В .ENV!"

echo ""
echo "2️⃣ ПРИНУДИТЕЛЬНО ДОБАВЛЯЕМ PORT=4000:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Удаляем все строки с PORT
sed -i '/^PORT=/d' .env 2>/dev/null || sed -i '' '/^PORT=/d' .env

# Добавляем PORT=4000 в начало файла
echo "PORT=4000" | cat - .env > temp && mv temp .env

echo "✅ PORT=4000 добавлен в начало .env"

echo ""
echo "🔍 Проверяем .env снова:"
head -5 .env

echo ""
echo "3️⃣ ПРОВЕРЯЕМ APP.JS КОНФИГУРАЦИЮ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "src/app.js" ]; then
    echo "📄 Ищем PORT в app.js:"
    grep -n -A 3 -B 3 "PORT\|port\|listen" src/app.js | head -15
elif [ -f "app.js" ]; then
    echo "📄 Ищем PORT в app.js:"
    grep -n -A 3 -B 3 "PORT\|port\|listen" app.js | head -15
else
    echo "❌ app.js не найден!"
fi

echo ""
echo "4️⃣ ПРОВЕРЯЕМ INDEX.JS ИЛИ MAIN ФАЙЛ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "src/index.js" ]; then
    echo "📄 Ищем PORT в index.js:"
    grep -n -A 3 -B 3 "PORT\|port\|listen" src/index.js | head -10
elif [ -f "index.js" ]; then
    echo "📄 Ищем PORT в index.js:"
    grep -n -A 3 -B 3 "PORT\|port\|listen" index.js | head -10
fi

echo ""
echo "5️⃣ ПОЛНЫЕ ERROR ЛОГИ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🔍 Полные error логи (последние 10 строк):"
pm2 logs solar-backend --err --lines 10 --nostream

echo ""
echo "6️⃣ ПРИНУДИТЕЛЬНО ПЕРЕЗАПУСКАЕМ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🛑 Останавливаем процесс:"
pm2 stop solar-backend

echo ""
echo "🔄 Запускаем заново с явным указанием PORT:"
PORT=4000 pm2 start src/app.js --name solar-backend --update-env

echo ""
echo "⏳ Ждём 5 секунд..."
sleep 5

echo ""
echo "7️⃣ ПРОВЕРЯЕМ РЕЗУЛЬТАТ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "📊 PM2 статус:"
pm2 status solar-backend

echo ""
echo "🔍 Кто слушает порт 4000:"
lsof -i :4000 || netstat -tulpn | grep :4000

echo ""
echo "🌐 Тестируем localhost:4000:"
curl -v http://localhost:4000/ 2>&1 | head -10

echo ""
echo "🌐 Тестируем health endpoint:"
curl -s http://localhost:4000/health || echo "❌ Health не отвечает"

echo ""
echo "8️⃣ ЕСЛИ ВСЁ ЕЩЁ НЕ РАБОТАЕТ - СОЗДАЁМ ПРОСТОЙ ТЕСТ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Создаём простой тестовый сервер
cat > test_server.js << 'EOF'
// 🧪 Простой тестовый сервер для проверки порта 4000
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.json({ 
    message: 'Test server работает!', 
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', port: PORT });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server запущен на порту ${PORT}`);
});
EOF

echo "✅ Тестовый сервер создан: test_server.js"

echo ""
echo "🎊🔥🚀 ДИАГНОСТИКА ЗАВЕРШЕНА! 🚀🔥🎊"
echo ""
echo "🎯 ЕСЛИ BACKEND ВСЁ ЕЩЁ НЕ РАБОТАЕТ:"
echo "   Запусти тестовый сервер:"
echo "   PORT=4000 node test_server.js"
echo ""
echo "💫 ЭТО ПОКАЖЕТ РАБОТАЕТ ЛИ ПОРТ 4000 ВООБЩЕ!"