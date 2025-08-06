#!/bin/bash
# 🔍 АНАЛИЗ РАБОТАЮЩИХ ITEMS
# Сравниваем как настроены: Clients, Products, Chart-of-accounts VS Sales

echo "🎊🔥🔍 АНАЛИЗ РАБОТАЮЩИХ ITEMS! 🔍🔥🎊"
echo ""
echo "✅ РАБОТАЮЩИЕ: Clients, Products, Chart-of-accounts"
echo "❌ НЕ РАБОТАЕТ: Sales (показывает submenu)"
echo ""

# 1. Анализируем конфигурацию WORKING items
echo "1️⃣ АНАЛИЗ КОНФИГУРАЦИИ WORKING ITEMS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "f/src/components/company/CompanySidebar.tsx" ]; then
    echo "🔍 CLIENTS конфигурация:"
    grep -n -A 10 -B 2 '"clients"' f/src/components/company/CompanySidebar.tsx | grep -A 10 -B 2 "id.*clients"
    
    echo ""
    echo "🔍 PRODUCTS конфигурация:"
    grep -n -A 10 -B 2 '"products"' f/src/components/company/CompanySidebar.tsx | grep -A 10 -B 2 "id.*products"
    
    echo ""
    echo "🔍 ACCOUNTS (chart-of-accounts) конфигурация:"
    grep -n -A 10 -B 2 '"accounts"' f/src/components/company/CompanySidebar.tsx
    
    echo ""
    echo "🔍 SALES конфигурация (проблемная):"
    grep -n -A 10 -B 2 '"sales"' f/src/components/company/CompanySidebar.tsx | grep -A 10 -B 2 "id.*sales"
else
    echo "❌ CompanySidebar.tsx не найден"
    exit 1
fi

echo ""
echo "2️⃣ СРАВНЕНИЕ EXPANDABLE СТАТУСА:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🔍 Все expandable: true items:"
grep -n -A 1 -B 1 "expandable: true" f/src/components/company/CompanySidebar.tsx

echo ""
echo "🔍 Все expandable: false items (или без expandable):"
grep -n -A 8 -B 2 "expandable: false\|route:.*," f/src/components/company/CompanySidebar.tsx | grep -E "(id:|route:|expandable:)"

echo ""
echo "3️⃣ ПОИСК SUBMENU РЕНДЕРИНГА:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🔍 Где рендерятся submenu (item.id ===):"
grep -n "item\.id ===" f/src/components/company/CompanySidebar.tsx

echo ""
echo "🔍 Submenu для sales (проблемный):"
grep -n -A 15 "item\.id === 'sales'" f/src/components/company/CompanySidebar.tsx

echo ""
echo "🔍 Есть ли submenu для других items:"
grep -n -A 5 "item\.id === 'clients'\|item\.id === 'products'\|item\.id === 'accounts'" f/src/components/company/CompanySidebar.tsx

echo ""
echo "4️⃣ АНАЛИЗ RENDERING ЛОГИКИ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🔍 Expandable rendering логика:"
grep -n -A 10 -B 5 "expandable.*?" f/src/components/company/CompanySidebar.tsx | head -20

echo ""
echo "🔍 NavLink usage для non-expandable:"
grep -n -A 3 -B 1 "NavLink.*to.*item\.route" f/src/components/company/CompanySidebar.tsx

echo ""
echo "5️⃣ СОЗДАНИЕ СРАВНИТЕЛЬНОЙ ТАБЛИЦЫ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat > comparison_table.txt << 'EOF'
🔍 СРАВНИТЕЛЬНАЯ ТАБЛИЦА:

┌─────────────────┬───────────────┬────────────────┬──────────────┬─────────────┐
│ ITEM            │ EXPANDABLE    │ HAS SUBMENU    │ ROUTE        │ РАБОТАЕТ    │
├─────────────────┼───────────────┼────────────────┼──────────────┼─────────────┤
│ clients         │ false/none    │ NO             │ /clients     │ ✅ ДА       │
│ products        │ false/none    │ NO             │ /products    │ ✅ ДА       │
│ accounts        │ false/none    │ NO             │ /chart-...   │ ✅ ДА       │
│ sales           │ true          │ YES            │ -            │ ❌ НЕТ      │
│ purchases       │ true          │ YES            │ -            │ ❌ НЕТ      │
│ warehouse       │ true          │ YES            │ -            │ ❌ НЕТ      │
└─────────────────┴───────────────┴────────────────┴──────────────┴─────────────┘

💡 ПАТТЕРН:
✅ РАБОТАЮЩИЕ: expandable: false + route: "/path" + NO submenu rendering
❌ НЕ РАБОТАЮТ: expandable: true + NO route + submenu rendering в коде
EOF

cat comparison_table.txt

echo ""
echo "6️⃣ ПЛАН ИСПРАВЛЕНИЯ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat > fix_plan.txt << 'EOF'
🔧 ПЛАН ИСПРАВЛЕНИЯ SALES:

1️⃣ В sidebarItems массиве ИЗМЕНИТЬ:
   ❌ УБРАТЬ: expandable: true
   ✅ ДОБАВИТЬ: route: '/sales'

2️⃣ В rendering логике УДАЛИТЬ:
   ❌ ВЕСЬ БЛОК: {item.id === 'sales' && (...submenu...)}

3️⃣ АНАЛОГИЧНО для purchases и warehouse (если нужно)

🎯 РЕЗУЛЬТАТ:
   Sales будет работать как Clients/Products - прямая ссылка!
EOF

cat fix_plan.txt

echo ""
echo "🎊🔥🔍 АНАЛИЗ ЗАВЕРШЁН! 🔍🔥🎊"
echo ""
echo "💡 ГЛАВНЫЙ ВЫВОД:"
echo "   ✅ WORKING: имеют route + НЕТ submenu в rendering"
echo "   ❌ BROKEN: имеют expandable: true + submenu в rendering"
echo ""
echo "🔧 ГОТОВ СОЗДАТЬ ИСПРАВЛЕНИЕ?"
echo "   Скажи 'да' и я создам скрипт исправления!"
echo ""
echo "📋 ФАЙЛЫ ДЛЯ АНАЛИЗА СОЗДАНЫ:"
echo "   📄 comparison_table.txt - сравнительная таблица"
echo "   📄 fix_plan.txt - план исправления"