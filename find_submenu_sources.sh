#!/bin/bash
# 🔍 ПОИСК ИСТОЧНИКОВ SUBMENU ТЕКСТОВ
# Ищем откуда берутся: "All Sales", "New Sale", "Sales Orders"

echo "🎊🔥🔍 ПОИСК ИСТОЧНИКОВ SUBMENU ТЕКСТОВ! 🔍🔥🎊"
echo ""
echo "🎯 ИЩЕМ: All Sales, New Sale, Sales Orders"
echo "📁 ОБЛАСТЬ ПОИСКА: вся папка f/src/"
echo ""

# 1. Поиск "All Sales"
echo "1️⃣ ПОИСК 'All Sales':"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
find f/src -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" | xargs grep -l "All Sales" 2>/dev/null | while read file; do
    echo "📄 НАЙДЕНО В: $file"
    echo "   Строки:"
    grep -n "All Sales" "$file"
    echo ""
done

# 2. Поиск "New Sale"  
echo "2️⃣ ПОИСК 'New Sale':"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
find f/src -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" | xargs grep -l "New Sale" 2>/dev/null | while read file; do
    echo "📄 НАЙДЕНО В: $file"
    echo "   Строки:"
    grep -n "New Sale" "$file"
    echo ""
done

# 3. Поиск "Sales Orders"
echo "3️⃣ ПОИСК 'Sales Orders':"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
find f/src -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" | xargs grep -l "Sales Orders" 2>/dev/null | while read file; do
    echo "📄 НАЙДЕНО В: $file"
    echo "   Строки:"
    grep -n "Sales Orders" "$file"
    echo ""
done

# 4. Поиск по ключевым словам submenu
echo "4️⃣ ПОИСК ПО SUBMENU СТРУКТУРАМ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🔍 Поиск 'submenu' в коде:"
find f/src -name "*.tsx" -o -name "*.ts" | xargs grep -l "submenu\|subMenu" 2>/dev/null | while read file; do
    echo "📄 SUBMENU В: $file"
    grep -n -i "submenu" "$file" | head -3
    echo ""
done

# 5. Поиск expandable логики
echo "5️⃣ ПОИСК EXPANDABLE ЛОГИКИ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🔍 Поиск 'expandable' в коде:"
find f/src -name "*.tsx" -o -name "*.ts" | xargs grep -l "expandable" 2>/dev/null | while read file; do
    echo "📄 EXPANDABLE В: $file"
    grep -n "expandable" "$file" | head -5
    echo ""
done

# 6. Поиск в CompanySidebar конкретно
echo "6️⃣ ДЕТАЛЬНЫЙ АНАЛИЗ CompanySidebar:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "f/src/components/company/CompanySidebar.tsx" ]; then
    echo "📄 АНАЛИЗ CompanySidebar.tsx:"
    
    echo ""
    echo "🔍 Sales секция целиком:"
    grep -n -A 20 -B 5 '"sales"' f/src/components/company/CompanySidebar.tsx
    
    echo ""
    echo "🔍 Submenu рендеринг для sales:"
    grep -n -A 10 -B 2 "item.id === 'sales'" f/src/components/company/CompanySidebar.tsx
else
    echo "❌ CompanySidebar.tsx не найден"
fi

# 7. Поиск в любых конфигурационных файлах
echo ""
echo "7️⃣ ПОИСК В КОНФИГУРАЦИОННЫХ ФАЙЛАХ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🔍 Поиск в JSON/config файлах:"
find f/src -name "*.json" -o -name "*config*" | xargs grep -l -i "sales\|submenu" 2>/dev/null | while read file; do
    echo "📄 CONFIG В: $file"
    cat "$file" | head -20
    echo ""
done

# 8. Поиск всех вхождений слова "sales" в коде
echo ""
echo "8️⃣ ВСЕ УПОМИНАНИЯ 'SALES' В КОДЕ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🔍 Файлы содержащие 'sales' (первые 10):"
find f/src -name "*.tsx" -o -name "*.ts" | xargs grep -l -i "sales" 2>/dev/null | head -10 | while read file; do
    echo "📄 $file"
done

echo ""
echo "🎊🔥🔍 ПОИСК ЗАВЕРШЁН! 🔍🔥🎊"
echo ""
echo "💡 ИСПОЛЬЗУЙ РЕЗУЛЬТАТЫ ЧТОБЫ:"
echo "   🔍 Найти где определяются submenu items"  
echo "   🔧 Понять откуда берутся 'All Sales', 'New Sale', 'Sales Orders'"
echo "   ✂️  Удалить или изменить эти определения"
echo "   🎯 Сделать Sales прямой ссылкой как Clients"
echo ""
echo "🏆 ТЕПЕРЬ ТЫ ЗНАЕШЬ ОТКУДА РАСТУТ НОГИ!"