#!/bin/bash
# 🧪 ПРОСТОЙ ТЕСТ РОУТИНГА
# Цель: Проверить только структуру роутов без изменений
# Создать минимальный тест для понимания проблемы

echo "🎊🔥🧪 ПРОСТОЙ ТЕСТ РОУТИНГА! 🧪🔥🎊"
echo ""
echo "🎯 ЦЕЛЬ: Протестировать роутинг БЕЗ изменений"
echo "🔍 Анализируем текущую структуру"
echo ""

# 1. Проверяем путь к AppRouter
echo "1️⃣ ПРОВЕРЯЕМ РАСПОЛОЖЕНИЕ AppRouter:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "f/src/app/AppRouter.tsx" ]; then
    echo "✅ AppRouter найден: f/src/app/AppRouter.tsx"
    echo "📏 Размер файла: $(wc -c < f/src/app/AppRouter.tsx) байт"
    echo "📄 Строк кода: $(wc -l < f/src/app/AppRouter.tsx)"
else
    echo "❌ AppRouter НЕ найден в f/src/app/AppRouter.tsx"
fi

# 2. Проверяем main.tsx - как импортируется AppRouter
echo ""
echo "2️⃣ ПРОВЕРЯЕМ ИМПОРТ AppRouter В main.tsx:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "f/src/main.tsx" ]; then
    echo "📄 main.tsx содержимое:"
    cat f/src/main.tsx
else
    echo "❌ main.tsx не найден"
fi

# 3. Проверяем index.html - правильный ли root
echo ""
echo "3️⃣ ПРОВЕРЯЕМ index.html:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "f/index.html" ]; then
    echo "🔍 Root div в index.html:"
    grep -n "root\|div" f/index.html
else
    echo "❌ index.html не найден"
fi

# 4. Проверяем routes в AppRouter
echo ""
echo "4️⃣ АНАЛИЗИРУЕМ ROUTES В AppRouter:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "f/src/app/AppRouter.tsx" ]; then
    echo "🔍 Все routes в файле:"
    grep -n "path=" f/src/app/AppRouter.tsx
    
    echo ""
    echo "🔍 Импорты компонентов:"
    grep -n "^import.*Page" f/src/app/AppRouter.tsx
    
    echo ""
    echo "🔍 CompanyLayout использование:"
    grep -n -A 3 -B 1 "CompanyLayout" f/src/app/AppRouter.tsx
else
    echo "❌ Не могу проанализировать - файл не найден"
fi

# 5. Проверяем существуют ли импортируемые компоненты
echo ""
echo "5️⃣ ПРОВЕРЯЕМ СУЩЕСТВОВАНИЕ КОМПОНЕНТОВ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_component() {
    local component=$1
    if [ -f "$component" ]; then
        echo "  ✅ $(basename $component) существует"
    else
        echo "  ❌ $(basename $component) НЕ НАЙДЕН: $component"
    fi
}

echo "🔍 Company Pages:"
check_component "f/src/pages/company/dashboard/DashboardPage.tsx"
check_component "f/src/pages/company/clients/ClientsPage.tsx"  
check_component "f/src/pages/company/products/ProductsPage.tsx"
check_component "f/src/pages/company/purchases/PurchasesPage.tsx"
check_component "f/src/pages/company/sales/SalesPage.tsx"
check_component "f/src/pages/company/warehouse/WarehousePage.tsx"

echo ""
echo "🔍 Components:"
check_component "f/src/components/company/CompanyLayout.tsx"
check_component "f/src/components/account/AuthGuard.tsx"
check_component "f/src/pages/auth/LoginPage.tsx"

# 6. Создаём простейший тест роутера
echo ""
echo "6️⃣ СОЗДАЁМ МИНИМАЛЬНЫЙ ТЕСТ ROUTER:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat > f/src/TestRouter.tsx << 'EOF'
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Простые тестовые компоненты
const TestDashboard = () => <div style={{padding: '20px', background: '#f0f0f0'}}>
  <h1>🏠 Test Dashboard</h1>
  <p>Если видишь это - routing работает!</p>
</div>;

const TestProducts = () => <div style={{padding: '20px', background: '#e0ffe0'}}>
  <h1>📦 Test Products</h1>
  <p>Products page загрузилась!</p>
</div>;

const TestSales = () => <div style={{padding: '20px', background: '#ffe0e0'}}>
  <h1>💰 Test Sales</h1>
  <p>Sales page работает!</p>
</div>;

const TestPurchases = () => <div style={{padding: '20px', background: '#e0e0ff'}}>
  <h1>🛒 Test Purchases</h1>
  <p>Purchases page загрузилась!</p>
</div>;

const TestNavigation = () => (
  <div style={{padding: '10px', background: '#333', color: 'white'}}>
    <a href="/dashboard" style={{color: 'white', margin: '0 10px'}}>Dashboard</a>
    <a href="/products" style={{color: 'white', margin: '0 10px'}}>Products</a>
    <a href="/sales" style={{color: 'white', margin: '0 10px'}}>Sales</a>
    <a href="/purchases" style={{color: 'white', margin: '0 10px'}}>Purchases</a>
  </div>
);

const TestRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <TestNavigation />
      <Routes>
        <Route path="/dashboard" element={<TestDashboard />} />
        <Route path="/products" element={<TestProducts />} />
        <Route path="/sales" element={<TestSales />} />
        <Route path="/purchases" element={<TestPurchases />} />
        <Route path="/" element={<TestDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default TestRouter;
EOF

echo "✅ TestRouter создан: f/src/TestRouter.tsx"

# 7. Создаём альтернативный main.tsx для тестирования
echo ""
echo "7️⃣ СОЗДАЁМ ТЕСТОВЫЙ main.tsx:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Backup текущего main.tsx
if [ -f "f/src/main.tsx" ]; then
    cp f/src/main.tsx f/src/main.tsx.backup
    echo "✅ Backup создан: main.tsx.backup"
fi

cat > f/src/main.test.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import TestRouter from './TestRouter'
import './index.css'

console.log('🧪 Test main.tsx запущен');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TestRouter />
  </React.StrictMode>,
)
EOF

echo "✅ Создан main.test.tsx для тестирования"

echo ""
echo "🎊🔥🧪 ТЕСТ РОУТИНГА ПОДГОТОВЛЕН! 🧪🔥🎊"
echo ""
echo "✅ СОЗДАНО:"
echo "   🧪 TestRouter.tsx - простейший роутер"
echo "   📄 main.test.tsx - тестовый main файл"
echo "   💾 main.tsx.backup - backup оригинала"
echo ""
echo "🎯 ВАРИАНТЫ ТЕСТИРОВАНИЯ:"
echo ""
echo "📋 ВАРИАНТ 1 - БЫСТРЫЙ ТЕСТ:"
echo "   1️⃣ mv f/src/main.tsx f/src/main.original.tsx"
echo "   2️⃣ mv f/src/main.test.tsx f/src/main.tsx"  
echo "   3️⃣ cd f && npm run dev"
echo "   4️⃣ Открой http://localhost:5173"
echo "   5️⃣ Кликай по ссылкам - если работают = проблема в настройках"
echo ""
echo "📋 ВАРИАНТ 2 - АНАЛИЗ ТЕКУЩЕГО:"
echo "   🔍 Смотри вывод выше и найди проблему в структуре"
echo "   🔧 Если все компоненты существуют - проблема в импортах"
echo ""
echo "💡 ЧТО ПОКАЖЕТ ТЕСТ:"
echo "   ✅ Если простой router работает = проблема в сложной структуре"
echo "   ❌ Если не работает = проблема в базовой настройке React Router"
echo ""
echo "🏆 ВЫБИРАЙ ВАРИАНТ ТЕСТИРОВАНИЯ!"