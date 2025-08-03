#!/bin/bash
# 🔧 ИСПРАВЛЯЕМ ДУБЛИРОВАНИЕ В TabBook
# Точечное исправление строк 128-132

echo "🔧 ИСПРАВЛЯЕМ ДУБЛИРОВАНИЕ В TabBook!"
echo ""
echo "🎯 ПРОБЛЕМА: Дублирование полей в строках 128-132"
echo "📁 ФАЙЛ: f/src/components/company/CompanySidebar.tsx"

# Backup на всякий случай
cp f/src/components/company/CompanySidebar.tsx f/src/components/company/CompanySidebar.tsx.before_fix

echo "💾 Backup создан: CompanySidebar.tsx.before_fix"

# Точечное исправление: удаляем дублированные строки 130-131
# Используем sed для удаления строк с isPinned и badge: null после expandable: false
sed -i '' '/expandable: false$/,/}$/ {
    /isPinned: true.*последний/d
    /badge: null$/d
}' f/src/components/company/CompanySidebar.tsx

echo "✅ Дублированные строки удалены"

# Добавляем пропущенную запятую после expandable: false если её нет
sed -i '' 's/expandable: false$/expandable: false,/' f/src/components/company/CompanySidebar.tsx

echo "✅ Запятая после expandable: false добавлена"

echo ""
echo "🔍 ПРОВЕРЯЕМ РЕЗУЛЬТАТ:"

# Показываем исправленную область
echo "📋 ИСПРАВЛЕННЫЙ КОД (строки 120-135):"
echo "---"
sed -n '120,135p' f/src/components/company/CompanySidebar.tsx | nl -v120
echo "---"

echo ""
echo "✅ ИСПРАВЛЕНИЕ ЗАВЕРШЕНО!"
echo ""
echo "🚀 ПРОВЕРЬ РЕЗУЛЬТАТ:"
echo "   1. Frontend должен перезагрузиться автоматически"  
echo "   2. Открой: http://localhost:5173/account/dashboard"
echo "   3. Войди в компанию"
echo "   4. Найди ⚡ TAB-Бухгалтерия (NEW) в sidebar"
echo "   5. Кликни и увидишь TabBook!"
echo ""
echo "💡 ЕСЛИ ПРОБЛЕМА ОСТАЛАСЬ:"
echo "   cp CompanySidebar.tsx.backup CompanySidebar.tsx"
echo "   И добавь TabBook вручную в правильное место"