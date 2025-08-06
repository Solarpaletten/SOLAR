#!/bin/bash
# 🔧 ИСПРАВЛЕНИЕ SALES ЧТОБЫ РАБОТАЛ КАК CLIENTS
# На основе точного анализа: убираем expandable + удаляем submenu rendering

echo "🎊🔥🔧 ИСПРАВЛЕНИЕ SALES ЧТОБЫ РАБОТАЛ КАК CLIENTS! 🔧🔥🎊"
echo ""
echo "🎯 ПЛАН: Делаем Sales точно как Clients"
echo "✅ ЕСТЬ route: '/sales' - оставляем"
echo "❌ УБИРАЕМ expandable: true"
echo "❌ УДАЛЯЕМ submenu rendering (строки 377-392+)"
echo ""

# 1. Backup
echo "1️⃣ СОЗДАНИЕ BACKUP:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "f/src/components/company/CompanySidebar.tsx" ]; then
    cp f/src/components/company/CompanySidebar.tsx f/src/components/company/CompanySidebar.tsx.before_fix_sales
    echo "✅ Backup: CompanySidebar.tsx.before_fix_sales"
else
    echo "❌ Файл не найден"
    exit 1
fi

# 2. Убираем expandable: true у Sales
echo ""
echo "2️⃣ УБИРАЕМ expandable: true У SALES:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Используем sed для замены
sed -i '' '/id: .sales.,/,/},/{
  s/expandable: true,//g
}' f/src/components/company/CompanySidebar.tsx

echo "✅ expandable: true удалён из Sales config"

# 3. Удаляем submenu rendering для Sales
echo ""
echo "3️⃣ УДАЛЯЕМ SUBMENU RENDERING ДЛЯ SALES:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Создаём временный файл для обработки
python3 << 'PYTHON_SCRIPT'
import re

# Читаем файл
with open('f/src/components/company/CompanySidebar.tsx', 'r') as f:
    content = f.read()

# Удаляем весь блок submenu для sales
# Паттерн: от {item.id === 'sales' && до закрывающей скобки блока
sales_submenu_pattern = r'\s*\{item\.id === \'sales\' && \(\s*<div className="space-y-1">.*?</div>\s*\)\}'

# Удаляем блок (используем DOTALL для многострочного поиска)
content = re.sub(sales_submenu_pattern, '', content, flags=re.DOTALL)

# Записываем обратно
with open('f/src/components/company/CompanySidebar.tsx', 'w') as f:
    f.write(content)

print("✅ Sales submenu rendering удалён")
PYTHON_SCRIPT

# 4. Проверяем результат
echo ""
echo "4️⃣ ПРОВЕРЯЕМ РЕЗУЛЬТАТ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🔍 Sales конфигурация после исправления:"
grep -n -A 8 -B 2 '"sales"' f/src/components/company/CompanySidebar.tsx | grep -A 8 -B 2 "id.*sales"

echo ""
echo "🔍 Проверяем что submenu для sales удалён:"
if grep -q "item.id === 'sales'" f/src/components/company/CompanySidebar.tsx; then
    echo "⚠️  Submenu для sales всё ещё найден:"
    grep -n -A 3 "item.id === 'sales'" f/src/components/company/CompanySidebar.tsx
else
    echo "✅ Sales submenu полностью удалён"
fi

# 5. Убираем sales из SubmenuState если не используется
echo ""
echo "5️⃣ ОЧИСТКА SubmenuState:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🔍 Текущий SubmenuState:"
grep -n -A 5 -B 1 "interface SubmenuState" f/src/components/company/CompanySidebar.tsx

echo ""
echo "💡 Если sales больше не expandable, можно убрать sales: boolean из SubmenuState"
echo "   Но оставляем на всякий случай для совместимости"

# 6. Сравнение с рабочими items
echo ""
echo "6️⃣ СРАВНЕНИЕ С РАБОЧИМИ ITEMS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🔍 Сравнение конфигураций:"
echo ""
echo "📋 CLIENTS (рабочий):"
grep -n -A 8 -B 1 '"clients"' f/src/components/company/CompanySidebar.tsx | grep -A 8 -B 1 "id.*clients"

echo ""
echo "📋 SALES (исправленный):"
grep -n -A 8 -B 1 '"sales"' f/src/components/company/CompanySidebar.tsx | grep -A 8 -B 1 "id.*sales"

# 7. Очистка кэша
echo ""
echo "7️⃣ ОЧИСТКА КЭША:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

pkill -f "vite\|npm.*dev" 2>/dev/null || true
echo "🛑 Dev server остановлен"

if [ -d "f/node_modules/.vite" ]; then
    rm -rf f/node_modules/.vite
    echo "🔄 Vite кэш очищен"
fi

echo ""
echo "🎊🔥🔧 SALES ИСПРАВЛЕН ЧТОБЫ РАБОТАТЬ КАК CLIENTS! 🔧🔥🎊"
echo ""
echo "✅ ВЫПОЛНЕННЫЕ ИЗМЕНЕНИЯ:"
echo "   ❌ Убрано expandable: true из Sales config"
echo "   ❌ Удалён submenu rendering для Sales"
echo "   ✅ Остался route: '/sales' для прямого перехода"
echo ""
echo "🎯 ТЕСТИРОВАНИЕ:"
echo "   1️⃣ cd f && npm run dev"
echo "   2️⃣ Открой http://localhost:5173/dashboard"
echo "   3️⃣ Кликни Sales в sidebar"
echo "   4️⃣ Должен открыться http://localhost:5173/sales БЕЗ submenu"
echo ""
echo "💡 ТЕПЕРЬ SALES = CLIENTS:"
echo "   ✅ Прямой переход на страницу"
echo "   ✅ НЕТ аккордеона"
echo "   ✅ Работает как Products и Chart-of-accounts"
echo ""
echo "🏆 SALES ТЕПЕРЬ РАБОТАЕТ КАК CLIENTS!"