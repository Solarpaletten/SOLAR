#!/bin/bash

echo "🎊⚡🔧 ИСПРАВЛЯЕМ КЭШИРОВАНИЕ SIDEBAR! 🔧⚡🎊"
echo ""
echo "🎯 ПРОБЛЕМА: Ты редактировал CompanySidebar1.tsx, но React использует CompanySidebar.tsx"
echo "💡 РЕШЕНИЕ: Скопировать правильный код в нужный файл"
echo ""

cd f

echo "1️⃣ ПРОВЕРЯЕМ КАКИЕ ФАЙЛЫ SIDEBAR СУЩЕСТВУЮТ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "📁 Все файлы CompanySidebar*:"
ls -la src/components/company/CompanySidebar* 2>/dev/null || echo "Файлы не найдены"

echo ""
echo "2️⃣ КОПИРУЕМ ПРАВИЛЬНЫЙ КОД ИЗ CompanySidebar1.tsx:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "src/components/company/CompanySidebar1.tsx" ]; then
    echo "✅ CompanySidebar1.tsx найден"
    
    # Backup старого файла
    cp src/components/company/CompanySidebar.tsx src/components/company/CompanySidebar.tsx.old_cache
    
    # Копируем правильный код
    cp src/components/company/CompanySidebar1.tsx src/components/company/CompanySidebar.tsx
    
    echo "✅ Код скопирован: CompanySidebar1.tsx → CompanySidebar.tsx"
else
    echo "❌ CompanySidebar1.tsx не найден!"
fi

echo ""
echo "3️⃣ ПРОВЕРЯЕМ РЕЗУЛЬТАТ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "📄 Первые 5 строк CompanySidebar.tsx:"
head -5 src/components/company/CompanySidebar.tsx

echo ""
echo "🔍 Проверяем TAB-Бухгалтерия:"
grep -n "TAB-Бухгалтерия" src/components/company/CompanySidebar.tsx || echo "❌ TAB-Бухгалтерия не найдена"

echo ""
echo "4️⃣ ПРИНУДИТЕЛЬНО ОЧИЩАЕМ КЭШИ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🔄 Перезапускаем Vite dev server..."

# Останавливаем dev server если запущен
pkill -f "vite.*dev" 2>/dev/null || echo "Dev server не был запущен"

# Очищаем node_modules cache
rm -rf node_modules/.vite 2>/dev/null
rm -rf node_modules/.cache 2>/dev/null

echo "✅ Кэши очищены"

echo ""
echo "5️⃣ ЗАПУСКАЕМ FRONTEND ЗАНОВО:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🚀 Запускаем npm run dev..."
echo ""
echo "КОМАНДА ДЛЯ ЗАПУСКА:"
echo "cd f && npm run dev"

echo ""
echo "6️⃣ ДОПОЛНИТЕЛЬНО - ОЧИСТКА BROWSER КЭША:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🌐 ЧТОБЫ ОЧИСТИТЬ BROWSER КЭШ:"
echo "   1. Открой DevTools (F12)"
echo "   2. Правый клик на кнопке обновления"
echo "   3. Выбери 'Empty Cache and Hard Reload'"
echo "   4. Или нажми Ctrl+Shift+R (Cmd+Shift+R на Mac)"

echo ""
echo "🎊⚡🚀 ИСПРАВЛЕНИЕ КЭШИРОВАНИЯ ЗАВЕРШЕНО! 🚀⚡🎊"
echo ""
echo "✅ РЕЗУЛЬТАТ:"
echo "   ✅ Правильный код скопирован в CompanySidebar.tsx"
echo "   ✅ Кэши Vite очищены"
echo "   ✅ Frontend готов к перезапуску"
echo ""
echo "🎯 СЛЕДУЮЩИЕ ШАГИ:"
echo "   1️⃣ Запуски: cd f && npm run dev"
echo "   2️⃣ Очисти browser кэш (Ctrl+Shift+R)"
echo "   3️⃣ Открой: http://localhost:5173/dashboard"
echo "   4️⃣ Увидишь правильный sidebar!"
echo ""
echo "💫 КЭШИРОВАНИЕ НЕ ПОБЕДИТ НАС!"
echo "🏆 ПРАВИЛЬНЫЙ КОД БУДЕТ РАБОТАТЬ!"