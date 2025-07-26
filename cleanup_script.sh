#!/bin/bash
# 🧹 СКРИПТ ОЧИСТКИ FRONTEND СТРУКТУРЫ
# Запускать из папки f/src/

echo "🧹 НАЧИНАЕМ ОЧИСТКУ FRONTEND СТРУКТУРЫ..."
echo "📍 Текущая папка: $(pwd)"

# ===========================================
# 1️⃣ СОЗДАНИЕ НОВОЙ СТРУКТУРЫ
# ===========================================

echo "\n📂 Создаем новую структуру папок..."

# Создаем app/ для маршрутизации
mkdir -p app
mkdir -p styles

# Создаем недостающие папки в hooks
mkdir -p hooks/shared

# Создаем папки для navigation
mkdir -p pages/company/navigation
mkdir -p components/shared

echo "✅ Новые папки созданы"

# ===========================================
# 2️⃣ ПЕРЕМЕЩЕНИЕ ФАЙЛОВ
# ===========================================

echo "\n📦 Перемещаем файлы в правильные места..."

# Перемещаем App.tsx в app/
if [ -f "App.tsx" ]; then
    echo "📄 Перемещаем App.tsx → app/AppRouter.tsx"
    mv App.tsx app/AppRouter.tsx
fi

# Перемещаем App.css в styles/
if [ -f "App.css" ]; then
    echo "📄 Перемещаем App.css → styles/app.css"
    mv App.css styles/app.css
fi

# Перемещаем компании страницы в navigation
if [ -f "pages/company/CompanySelectPage.tsx" ]; then
    echo "📄 Перемещаем CompanySelectPage.tsx → pages/company/navigation/"
    mv pages/company/CompanySelectPage.tsx pages/company/navigation/
fi

if [ -f "pages/company/CompanyTransitPage.tsx" ]; then
    echo "📄 Перемещаем CompanyTransitPage.tsx → pages/company/navigation/"
    mv pages/company/CompanyTransitPage.tsx pages/company/navigation/
fi

echo "✅ Файлы перемещены"

# ===========================================
# 3️⃣ ПЕРЕИМЕНОВАНИЕ ТИПОВ
# ===========================================

echo "\n🏷️ Переименовываем типы..."

if [ -f "types/company/purchasesTypes.ts" ]; then
    echo "📄 Переименовываем purchasesTypes.ts → purchases.ts"
    mv types/company/purchasesTypes.ts types/company/purchases.ts
fi

if [ -f "types/company/salesTypes.ts" ]; then
    echo "📄 Переименовываем salesTypes.ts → sales.ts"
    mv types/company/salesTypes.ts types/company/sales.ts
fi

echo "✅ Типы переименованы"

# ===========================================
# 4️⃣ АНАЛИЗ ДУБЛИРУЮЩИХСЯ ФАЙЛОВ
# ===========================================

echo "\n🔍 АНАЛИЗИРУЕМ ДУБЛИРУЮЩИЕСЯ LAYOUT ФАЙЛЫ:"

echo "\n📁 В components/layout/account/:"
ls -la components/layout/account/ 2>/dev/null || echo "❌ Папка не найдена"

echo "\n🤔 НАЙДЕННЫЕ ДУБЛИ:"
if [ -f "components/layout/account/Header.tsx" ] && [ -f "components/layout/account/AccountHeader.tsx" ]; then
    echo "⚠️  Header.tsx И AccountHeader.tsx (возможный дубль)"
fi

if [ -f "components/layout/account/Layout.tsx" ] && [ -f "components/layout/account/AccountLayout.tsx" ]; then
    echo "⚠️  Layout.tsx И AccountLayout.tsx (возможный дубль)"
fi

if [ -f "components/layout/account/Sidebar.tsx" ] && [ -f "components/layout/account/AccountSidebar.tsx" ]; then
    echo "⚠️  Sidebar.tsx И AccountSidebar.tsx (возможный дубль)"
fi

# ===========================================
# 5️⃣ ПРОВЕРКА ИСПОЛЬЗОВАНИЯ ФАЙЛОВ
# ===========================================

echo "\n🔍 ПРОВЕРЯЕМ ИСПОЛЬЗОВАНИЕ ФАЙЛОВ:"

echo "\n📄 Поиск использования react.svg:"
grep -r "react.svg" . 2>/dev/null || echo "❌ react.svg не используется"

echo "\n📄 Поиск использования старых layout файлов:"
grep -r "components/layout/account/Header" . 2>/dev/null && echo "⚠️  Header.tsx используется"
grep -r "components/layout/account/Layout" . 2>/dev/null && echo "⚠️  Layout.tsx используется"
grep -r "components/layout/account/Sidebar" . 2>/dev/null && echo "⚠️  Sidebar.tsx используется"

# ===========================================
# 6️⃣ ОТЧЕТ О СОСТОЯНИИ
# ===========================================

echo "\n📊 ОТЧЕТ О СОСТОЯНИИ СТРУКТУРЫ:"

echo "\n✅ ХОРОШО ОРГАНИЗОВАННЫЕ ПАПКИ:"
echo "   📂 api/account/ и api/company/"
echo "   📂 pages/account/ и pages/company/"
echo "   📂 services/account/ и services/company/"
echo "   📂 types/account/ и types/company/"

echo "\n⚠️  ТРЕБУЮТ ВНИМАНИЯ:"

# Проверяем пустые папки
if [ -z "$(ls -A hooks/account/)" ]; then
    echo "   📂 hooks/account/ - ПУСТАЯ"
fi

if [ -z "$(ls -A hooks/company/)" ]; then
    echo "   📂 hooks/company/ - ПУСТАЯ"
fi

if [ -z "$(ls -A api/company/)" ]; then
    echo "   📂 api/company/ - ПУСТАЯ (нужно добавить bankApi.ts)"
fi

echo "\n🗑️  КАНДИДАТЫ НА УДАЛЕНИЕ:"
[ -f "assets/account/react.svg" ] && echo "   🗑️  assets/account/react.svg (не используется)"
[ -f "assets/company/.gitkeep" ] && echo "   🗑️  .gitkeep файлы"

# ===========================================
# 7️⃣ РЕКОМЕНДАЦИИ
# ===========================================

echo "\n💡 РЕКОМЕНДАЦИИ:"

echo "\n1️⃣  УДАЛИТЬ ДУБЛИ LAYOUT:"
echo "    Выбрать один вариант: Header.tsx ИЛИ AccountHeader.tsx"
echo "    Выбрать один вариант: Layout.tsx ИЛИ AccountLayout.tsx"
echo "    Выбрать один вариант: Sidebar.tsx ИЛИ AccountSidebar.tsx"

echo "\n2️⃣  ЗАПОЛНИТЬ ПУСТЫЕ ПАПКИ:"
echo "    hooks/account/ - добавить useAuth.ts"
echo "    hooks/company/ - добавить useBankAccounts.ts"
echo "    api/company/ - добавить bankApi.ts"

echo "\n3️⃣  ОБНОВИТЬ ИМПОРТЫ:"
echo "    После перемещения файлов обновить импорты в:"
echo "    - main.tsx (App.tsx → app/AppRouter.tsx)"
echo "    - компонентах, использующих moved файлы"

echo "\n4️⃣  СОЗДАТЬ SHARED КОМПОНЕНТЫ:"
echo "    components/shared/ - для общих UI компонентов"
echo "    hooks/shared/ - для общих хуков"

echo "\n🎯 СЛЕДУЮЩИЕ ШАГИ:"
echo "1. Выполнить этот скрипт: bash cleanup_structure.sh"
echo "2. Удалить дублирующиеся layout файлы вручную"
echo "3. Обновить импорты в компонентах"
echo "4. Добавить недостающие API и hooks"
echo "5. Протестировать сборку: npm run dev"

echo "\n✨ ПОСЛЕ ОЧИСТКИ СТРУКТУРА БУДЕТ ИДЕАЛЬНОЙ!"