#!/bin/bash
# 🔧 ДИАГНОСТИКА И ИСПРАВЛЕНИЕ ROUTING ПРОБЛЕМЫ
# Проблема: URL меняется, но компоненты не загружаются
# Решение: Проверяем AppRouter, Dashboard, кэш браузера

echo "🎊🔥🔧 ДИАГНОСТИКА ROUTING ПРОБЛЕМЫ! 🔧🔥🎊"
echo ""
echo "🎯 СИМПТОМЫ: URL меняется, но страницы не загружаются"
echo "💡 ДИАГНОСТИКА: Проверяем все возможные причины"
echo ""

# 1. Проверяем структуру файлов
echo "1️⃣ ПРОВЕРЯЕМ СТРУКТУРУ ROUTING FILES:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🔍 Проверяем основные файлы:"
if [ -f "f/src/AppRouter.tsx" ]; then
    echo "  ✅ AppRouter.tsx найден"
    echo "  📄 Размер: $(wc -c < f/src/AppRouter.tsx) байт"
else
    echo "  ❌ AppRouter.tsx НЕ НАЙДЕН!"
fi

if [ -f "f/src/pages/company/dashboard/DashboardPage.tsx" ]; then
    echo "  ✅ DashboardPage.tsx найден"
else
    echo "  ❌ DashboardPage.tsx НЕ НАЙДЕН!"
fi

if [ -f "f/src/components/company/CompanyLayout.tsx" ]; then
    echo "  ✅ CompanyLayout.tsx найден"
else
    echo "  ❌ CompanyLayout.tsx НЕ НАЙДЕН!"
fi

echo ""
echo "2️⃣ ПРОВЕРЯЕМ ROUTES КОНФИГУРАЦИЮ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "f/src/AppRouter.tsx" ]; then
    echo "🔍 Routes в AppRouter.tsx:"
    grep -n "path=" f/src/AppRouter.tsx | head -10
    
    echo ""
    echo "🔍 Импорты компонентов:"
    grep -n "import.*Page" f/src/AppRouter.tsx
else
    echo "❌ Невозможно проверить - AppRouter.tsx отсутствует"
fi

echo ""
echo "3️⃣ СОЗДАЁМ МИНИМАЛЬНЫЙ ТЕСТОВЫЙ ROUTER:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Создаем backup
if [ -f "f/src/AppRouter.tsx" ]; then
    cp f/src/AppRouter.tsx f/src/AppRouter.tsx.before_debug
    echo "✅ Backup создан: AppRouter.tsx.before_debug"
fi

# Создаем простой тестовый router
cat > f/src/AppRouter.tsx << 'EOF'
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import AccountDashboard from './pages/account/AccountDashboard';
import CompanyLayout from './components/company/CompanyLayout';
import AuthGuard from './components/auth/AuthGuard';

// Company Pages - ПРОСТЫЕ ИМПОРТЫ
import DashboardPage from './pages/company/dashboard/DashboardPage';
import ProductsPage from './pages/company/products/ProductsPage';
import ClientsPage from './pages/company/clients/ClientsPage';
import PurchasesPage from './pages/company/purchases/PurchasesPage';
import SalesPage from './pages/company/sales/SalesPage';
import WarehousePage from './pages/company/warehouse/WarehousePage';
import ChartOfAccountsPage from './pages/company/accounting/ChartOfAccountsPage';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Account Routes */}
        <Route
          path="/account/dashboard"
          element={
            <AuthGuard>
              <AccountDashboard />
            </AuthGuard>
          }
        />

        {/* Company Routes - ВСЕ ОБЁРНУТЫ В COMPANYLAYOUT */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <CompanyLayout>
                <DashboardPage />
              </CompanyLayout>
            </AuthGuard>
          }
        />
        
        <Route
          path="/products"
          element={
            <AuthGuard>
              <CompanyLayout>
                <ProductsPage />
              </CompanyLayout>
            </AuthGuard>
          }
        />
        
        <Route
          path="/clients"
          element={
            <AuthGuard>
              <CompanyLayout>
                <ClientsPage />
              </CompanyLayout>
            </AuthGuard>
          }
        />
        
        <Route
          path="/purchases/*"
          element={
            <AuthGuard>
              <CompanyLayout>
                <PurchasesPage />
              </CompanyLayout>
            </AuthGuard>
          }
        />
        
        <Route
          path="/sales/*"
          element={
            <AuthGuard>
              <CompanyLayout>
                <SalesPage />
              </CompanyLayout>
            </AuthGuard>
          }
        />
        
        <Route
          path="/warehouse/*"
          element={
            <AuthGuard>
              <CompanyLayout>
                <WarehousePage />
              </CompanyLayout>
            </AuthGuard>
          }
        />
        
        <Route
          path="/chart-of-accounts"
          element={
            <AuthGuard>
              <CompanyLayout>
                <ChartOfAccountsPage />
              </CompanyLayout>
            </AuthGuard>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
EOF

echo "✅ Создан простой тестовый AppRouter"

echo ""
echo "4️⃣ ПРОВЕРЯЕМ DASHBOARD QUICK ACTIONS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "f/src/pages/company/dashboard/DashboardPage.tsx" ]; then
    echo "🔍 Quick Actions в Dashboard:"
    grep -A 5 -B 5 "Quick Actions\|NavLink\|Link" f/src/pages/company/dashboard/DashboardPage.tsx | head -20
else
    echo "❌ DashboardPage.tsx не найден для проверки"
fi

echo ""
echo "5️⃣ ОЧИСТКА ПОЛНОГО КЭША:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Остановка dev server
echo "🛑 Остановка dev server..."
pkill -f "vite\|npm.*dev" 2>/dev/null || true

# Очистка всех кэшей
if [ -d "f/node_modules/.vite" ]; then
    rm -rf f/node_modules/.vite
    echo "🔄 Vite кэш очищен"
fi

if [ -d "f/node_modules/.cache" ]; then
    rm -rf f/node_modules/.cache
    echo "🔄 Node кэш очищен"
fi

if [ -d "f/dist" ]; then
    rm -rf f/dist
    echo "🔄 Build кэш очищен"
fi

# Очистка localStorage
cat > f/clear_browser_cache.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Clear Browser Cache</title>
</head>
<body>
    <h1>🧹 Очистка Browser Cache</h1>
    <button onclick="clearAll()">Очистить всё</button>
    <div id="result"></div>
    
    <script>
        function clearAll() {
            localStorage.clear();
            sessionStorage.clear();
            
            // Очистка кэша если поддерживается
            if ('caches' in window) {
                caches.keys().then(names => {
                    names.forEach(name => {
                        caches.delete(name);
                    });
                });
            }
            
            document.getElementById('result').innerHTML = '✅ Кэш очищен!';
        }
        
        // Автоматическая очистка
        setTimeout(clearAll, 1000);
    </script>
</body>
</html>
EOF

echo "✅ Создан helper для очистки browser cache: f/clear_browser_cache.html"

echo ""
echo "6️⃣ СОЗДАЁМ DEBUG КОМПОНЕНТ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Создаем debug компонент
cat > f/src/components/debug/RouteDebugger.tsx << 'EOF'
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RouteDebugger: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div>🔍 ROUTE DEBUG</div>
      <div>Path: {location.pathname}</div>
      <div>Search: {location.search}</div>
      <div>Hash: {location.hash}</div>
      <div>
        <button onClick={() => navigate('/products')} style={{margin: '2px'}}>Products</button>
        <button onClick={() => navigate('/sales')} style={{margin: '2px'}}>Sales</button>
        <button onClick={() => navigate('/purchases')} style={{margin: '2px'}}>Purchases</button>
      </div>
    </div>
  );
};

export default RouteDebugger;
EOF

echo "✅ Создан RouteDebugger компонент"

echo ""
echo "7️⃣ ДОБАВЛЯЕМ DEBUG В APP:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Добавляем debugger в App
if [ -f "f/src/App.tsx" ]; then
    # Создаем backup
    cp f/src/App.tsx f/src/App.tsx.before_debug
    
    # Добавляем RouteDebugger import и использование
    sed -i '' '1i\
import RouteDebugger from "./components/debug/RouteDebugger";
' f/src/App.tsx

    # Добавляем компонент в return
    sed -i '' 's/<AppRouter \/>/<><AppRouter \/><RouteDebugger \/><\/>/g' f/src/App.tsx
    
    echo "✅ RouteDebugger добавлен в App.tsx"
else
    echo "❌ App.tsx не найден"
fi

echo ""
echo "🎊🔥🔧 ДИАГНОСТИКА ЗАВЕРШЕНА! 🔧🔥🎊"
echo ""
echo "✅ ВЫПОЛНЕНО:"
echo "   🔧 Создан простой тестовый AppRouter"
echo "   🧹 Очищены все кэши"
echo "   🔍 Добавлен RouteDebugger"
echo "   💾 Созданы backups всех файлов"
echo ""
echo "🎯 СЛЕДУЮЩИЕ ШАГИ:"
echo "   1️⃣ Запусти: cd f && npm run dev"
echo "   2️⃣ Открой: http://localhost:5173/clear_browser_cache.html"
echo "   3️⃣ Очисти browser кэш кнопкой"
echo "   4️⃣ Открой: http://localhost:5173/dashboard"
echo "   5️⃣ Смотри debug info в правом верхнем углу"
echo "   6️⃣ Тестируй навигацию через sidebar"
echo ""
echo "💡 DEBUG КНОПКИ:"
echo "   🔍 RouteDebugger показывает текущий path"
echo "   🎯 Кнопки Products/Sales/Purchases для прямого тестирования"
echo ""
echo "🏆 ТЕПЕРЬ НАЙДЁМ ПРОБЛЕМУ И ИСПРАВИМ ROUTING!"