#!/bin/bash
# 🔍 РУЧНАЯ ПРОВЕРКА DashboardPage
# Цель: Посмотреть что внутри DashboardPage.tsx
# Проанализировать структуру, импорты, компоненты

echo "🎊🔥🔍 РУЧНАЯ ПРОВЕРКА DashboardPage! 🔍🔥🎊"
echo ""
echo "🎯 ЦЕЛЬ: Проанализировать DashboardPage.tsx вручную"
echo "🔍 Смотрим что внутри файла"
echo ""

# 1. Показываем полное содержимое DashboardPage
echo "1️⃣ СОДЕРЖИМОЕ DashboardPage.tsx:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "f/src/pages/company/dashboard/DashboardPage.tsx" ]; then
    echo "📄 ПОЛНЫЙ ФАЙЛ:"
    echo ""
    cat f/src/pages/company/dashboard/DashboardPage.tsx
else
    echo "❌ DashboardPage.tsx НЕ НАЙДЕН!"
fi

echo ""
echo ""
echo "2️⃣ АНАЛИЗ ИМПОРТОВ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "f/src/pages/company/dashboard/DashboardPage.tsx" ]; then
    echo "🔍 Все импорты:"
    grep -n "^import" f/src/pages/company/dashboard/DashboardPage.tsx
    
    echo ""
    echo "🔍 CompanyLayout импорт:"
    if grep -q "CompanyLayout" f/src/pages/company/dashboard/DashboardPage.tsx; then
        echo "  ❌ НАЙДЕН CompanyLayout импорт - ЭТО ПРОБЛЕМА!"
        grep -n "CompanyLayout" f/src/pages/company/dashboard/DashboardPage.tsx
    else
        echo "  ✅ CompanyLayout НЕ импортируется"
    fi
    
    echo ""
    echo "🔍 React Router импорты:"
    grep -n "react-router\|Link\|NavLink\|useNavigate" f/src/pages/company/dashboard/DashboardPage.tsx
fi

echo ""
echo ""
echo "3️⃣ АНАЛИЗ JSX СТРУКТУРЫ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "f/src/pages/company/dashboard/DashboardPage.tsx" ]; then
    echo "🔍 Использование CompanyLayout в JSX:"
    if grep -q "<CompanyLayout\|</CompanyLayout>" f/src/pages/company/dashboard/DashboardPage.tsx; then
        echo "  ❌ НАЙДЕНО использование CompanyLayout в JSX!"
        grep -n -A 3 -B 3 "CompanyLayout" f/src/pages/company/dashboard/DashboardPage.tsx
    else
        echo "  ✅ CompanyLayout НЕ используется в JSX"
    fi
    
    echo ""
    echo "🔍 Return statement:"
    echo "  Ищем что возвращает компонент..."
    grep -n -A 10 "return (" f/src/pages/company/dashboard/DashboardPage.tsx | head -15
    
    echo ""
    echo "🔍 Quick Actions секция:"
    if grep -q "Quick Actions" f/src/pages/company/dashboard/DashboardPage.tsx; then
        echo "  ✅ Quick Actions найдены"
        grep -n -A 5 -B 5 "Quick Actions" f/src/pages/company/dashboard/DashboardPage.tsx
    else
        echo "  ❌ Quick Actions не найдены"
    fi
fi

echo ""
echo ""
echo "4️⃣ АНАЛИЗ НАВИГАЦИОННЫХ ССЫЛОК:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "f/src/pages/company/dashboard/DashboardPage.tsx" ]; then
    echo "🔍 Link компоненты в файле:"
    grep -n -B 2 -A 2 "<Link\|to=" f/src/pages/company/dashboard/DashboardPage.tsx
    
    echo ""
    echo "🔍 Пути навигации:"
    grep -o 'to="[^"]*"' f/src/pages/company/dashboard/DashboardPage.tsx | sort | uniq
fi

echo ""
echo ""
echo "5️⃣ СТАТИСТИКА ФАЙЛА:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "f/src/pages/company/dashboard/DashboardPage.tsx" ]; then
    echo "📊 Размер файла: $(wc -c < f/src/pages/company/dashboard/DashboardPage.tsx) байт"
    echo "📄 Строк кода: $(wc -l < f/src/pages/company/dashboard/DashboardPage.tsx)"
    echo "🔍 Слов 'import': $(grep -c "^import" f/src/pages/company/dashboard/DashboardPage.tsx)"
    echo "🔗 Слов 'Link': $(grep -c "Link" f/src/pages/company/dashboard/DashboardPage.tsx)"
    echo "🎨 Слов 'className': $(grep -c "className" f/src/pages/company/dashboard/DashboardPage.tsx)"
fi

echo ""
echo ""
echo "🎊🔥🔍 РУЧНАЯ ПРОВЕРКА ЗАВЕРШЕНА! 🔍🔥🎊"
echo ""
echo "✅ ПРОАНАЛИЗИРОВАНО:"
echo "   📄 Полное содержимое файла"
echo "   🔗 Все импорты и зависимости"
echo "   🎨 JSX структура и компоненты"
echo "   🧭 Навигационные ссылки"
echo "   📊 Статистика файла"
echo ""
echo "🎯 ТЕПЕРЬ МОЖЕМ ОБСУДИТЬ:"
echo "   💬 Что видим в файле?"
echo "   ❓ Есть ли проблемы?"
echo "   🔧 Что нужно исправить?"
echo ""
echo "🏆 ГОТОВ К ОБСУЖДЕНИЮ РЕЗУЛЬТАТОВ!"