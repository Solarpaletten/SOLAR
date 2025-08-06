#!/bin/bash
# 🎯 СОЗДАНИЕ DASHKAPAGE КАК КОПИИ DASHBOARDPAGE
# План: Копируем структуру, меняем содержимое, добавляем routing

echo "🎊🔥🎯 СОЗДАНИЕ DASHKAPAGE КАК КОПИИ DASHBOARDPAGE! 🎯🔥🎊"
echo ""
echo "🎯 ПЛАН:"
echo "   1️⃣ Скопировать DashboardPage.tsx → DashkaPage.tsx"
echo "   2️⃣ Изменить содержимое для DashkaPage"
echo "   3️⃣ Добавить route в AppRouter"
echo "   4️⃣ Добавить в Sidebar"
echo ""

# 1. Проверяем исходный файл
echo "1️⃣ ПРОВЕРЯЕМ ИСХОДНЫЙ DASHBOARDPAGE:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "f/src/pages/company/dashboard/DashboardPage.tsx" ]; then
    echo "✅ DashboardPage.tsx найден"
    echo "📏 Размер: $(wc -c < f/src/pages/company/dashboard/DashboardPage.tsx) байт"
    echo "📄 Строки: $(wc -l < f/src/pages/company/dashboard/DashboardPage.tsx)"
else
    echo "❌ DashboardPage.tsx не найден!"
    exit 1
fi

# 2. Создаем папку для DashkaPage
echo ""
echo "2️⃣ СОЗДАЕМ СТРУКТУРУ ПАПОК:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

mkdir -p f/src/pages/company/dashka
echo "✅ Папка f/src/pages/company/dashka создана"

# 3. Копируем DashboardPage → DashkaPage
echo ""
echo "3️⃣ КОПИРУЕМ И МОДИФИЦИРУЕМ DASHBOARDPAGE:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Копируем файл
cp f/src/pages/company/dashboard/DashboardPage.tsx f/src/pages/company/dashka/DashkaPage.tsx
echo "✅ Файл скопирован"

# Модифицируем содержимое
python3 << 'PYTHON_SCRIPT'
# Читаем скопированный файл
with open('f/src/pages/company/dashka/DashkaPage.tsx', 'r') as f:
    content = f.read()

# Заменяем основные элементы
replacements = {
    'DashboardPage': 'DashkaPage',
    'Company Dashboard': 'Dashka Analytics',
    'Welcome to SWAPOIL GMBH': 'Welcome to DASHKA CORP',
    'Total Clients': 'Total Partners',
    '24': '42',
    'Monthly Revenue': 'Annual Income', 
    '€45,230': '€89,650',
    'Active Projects': 'Active Deals',
    '12': '25',
    'Team Members': 'Staff Count',
    '8': '15',
    'Quick Actions': 'Dashka Actions',
    'Add Client': 'Add Partner',
    'Products': 'Services',
    'Sales': 'Contracts',
    'Purchases': 'Acquisitions',
    'Warehouse': 'Storage',
    'Chart of Accounts': 'Financial Plan',
    'Banking': 'Treasury',
    'Settings': 'Configuration',
    'Recent Activity': 'Latest Updates',
    'New client added': 'New partner onboarded',
    'ACME Corporation': 'DASHKA Solutions',
    '2 hours ago': '1 hour ago',
    'Payment received': 'Contract signed',
    '€2,450': '€5,780',
    'Tech Solutions': 'Innovation Labs',
    '4 hours ago': '3 hours ago',
    'System Health': 'Platform Status',
    'Database Status': 'Server Health',
    'Connected': 'Online',
    'Operational': 'Active',
    '2.3 GB / 10 GB': '4.7 GB / 20 GB',
    'Active Users': 'Online Users',
    '8 online': '15 active'
}

# Применяем все замены
for old, new in replacements.items():
    content = content.replace(old, new)

# Записываем обратно
with open('f/src/pages/company/dashka/DashkaPage.tsx', 'w') as f:
    f.write(content)

print("✅ Содержимое DashkaPage модифицировано")
PYTHON_SCRIPT

# 4. Добавляем в AppRouter
echo ""
echo "4️⃣ ДОБАВЛЯЕМ ROUTE В APPROUTER:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Backup AppRouter
cp f/src/app/AppRouter.tsx f/src/app/AppRouter.tsx.before_dashka

# Добавляем import
sed -i '' '/import DashboardPage/a\
import DashkaPage from '\''../pages/company/dashka/DashkaPage'\'';' f/src/app/AppRouter.tsx

# Добавляем route после dashboard route
sed -i '' '/path="\/dashboard"/,/^\s*\/>/a\
\
        <Route\
          path="/dashka"\
          element={\
            <AuthGuard>\
              <CompanyLayout>\
                <DashkaPage />\
              </CompanyLayout>\
            </AuthGuard>\
          }\
        />
' f/src/app/AppRouter.tsx

echo "✅ Route /dashka добавлен в AppRouter"

# 5. Добавляем в Sidebar
echo ""
echo "5️⃣ ДОБАВЛЯЕМ В SIDEBAR:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Backup Sidebar
cp f/src/components/company/CompanySidebar.tsx f/src/components/company/CompanySidebar.tsx.before_dashka

# Добавляем новый item в sidebarItems массив после dashboard
python3 << 'PYTHON_SCRIPT'
import re

with open('f/src/components/company/CompanySidebar.tsx', 'r') as f:
    content = f.read()

# Находим место после dashboard item и добавляем dashka item
dashka_item = '''    {
      id: 'dashka',
      icon: '🎯',
      title: 'Dashka',
      route: '/dashka',
      priority: 2,
      isPinned: false,
      badge: 'HOT',
    },'''

# Ищем dashboard item и добавляем после него
dashboard_pattern = r'(\s+{\s+id: \'dashboard\',.*?},)'
replacement = r'\1\n' + dashka_item

content = re.sub(dashboard_pattern, replacement, content, flags=re.DOTALL)

# Обновляем priority для других items (сдвигаем на 1)
priority_updates = {
    "priority: 2,": "priority: 3,",  # clients
    "priority: 3,": "priority: 4,",  # products  
    "priority: 4,": "priority: 5,",  # sales
    "priority: 5,": "priority: 6,",  # purchases
    "priority: 6,": "priority: 7,",  # warehouse
    "priority: 7,": "priority: 8,",  # accounts
    "priority: 8,": "priority: 9,",  # banking
    "priority: 9,": "priority: 10,", # tabbook
    "priority: 10,": "priority: 11,", # cloudide
    "priority: 11,": "priority: 12,", # settings
}

for old_priority, new_priority in priority_updates.items():
    if old_priority in content:
        content = content.replace(old_priority, new_priority, 1)

with open('f/src/components/company/CompanySidebar.tsx', 'w') as f:
    f.write(content)

print("✅ Dashka item добавлен в Sidebar")
PYTHON_SCRIPT

# 6. Проверяем результат
echo ""
echo "6️⃣ ПРОВЕРЯЕМ РЕЗУЛЬТАТ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🔍 Созданные файлы:"
if [ -f "f/src/pages/company/dashka/DashkaPage.tsx" ]; then
    echo "  ✅ DashkaPage.tsx создан ($(wc -l < f/src/pages/company/dashka/DashkaPage.tsx) строк)"
else
    echo "  ❌ DashkaPage.tsx не найден"
fi

echo ""
echo "🔍 AppRouter изменения:"
if grep -q "DashkaPage" f/src/app/AppRouter.tsx; then
    echo "  ✅ Import DashkaPage добавлен"
else
    echo "  ❌ Import не найден"
fi

if grep -q 'path="/dashka"' f/src/app/AppRouter.tsx; then
    echo "  ✅ Route /dashka добавлен"
else
    echo "  ❌ Route не найден"
fi

echo ""
echo "🔍 Sidebar изменения:"
if grep -q "id: 'dashka'" f/src/components/company/CompanySidebar.tsx; then
    echo "  ✅ Dashka item добавлен в Sidebar"
else
    echo "  ❌ Sidebar item не найден"
fi

# 7. Очистка кэша
echo ""
echo "7️⃣ ОЧИСТКА КЭША:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

pkill -f "vite\|npm.*dev" 2>/dev/null || true
if [ -d "f/node_modules/.vite" ]; then
    rm -rf f/node_modules/.vite
fi
echo "🔄 Кэш очищен"

echo ""
echo "🎊🔥🎯 DASHKAPAGE СОЗДАНА! 🎯🔥🎊"
echo ""
echo "✅ РЕЗУЛЬТАТ:"
echo "   📄 DashkaPage.tsx создана в f/src/pages/company/dashka/"
echo "   🗂️ Route /dashka добавлен в AppRouter"
echo "   📱 Dashka item добавлен в Sidebar с badge 'HOT'"
echo "   🎨 Уникальное содержимое для Dashka Analytics"
echo ""
echo "🎯 ТЕСТИРОВАНИЕ:"
echo "   1️⃣ cd f && npm run dev"
echo "   2️⃣ Открой http://localhost:5173/dashboard"
echo "   3️⃣ Кликни Dashka в sidebar (с badge HOT)"
echo "   4️⃣ Увидишь http://localhost:5173/dashka"
echo ""
echo "💡 УНИКАЛЬНЫЕ ДАННЫЕ DASHKA:"
echo "   🏢 DASHKA CORP вместо SWAPOIL GMBH"
echo "   👥 42 Partners вместо 24 Clients" 
echo "   💰 €89,650 Annual Income вместо €45,230"
echo "   📊 25 Active Deals вместо 12 Projects"
echo ""
echo "🏆 DASHKAPAGE ГОТОВА К ИСПОЛЬЗОВАНИЮ!"