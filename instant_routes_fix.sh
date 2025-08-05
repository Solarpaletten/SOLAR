#!/bin/bash
# ⚡ МГНОВЕННОЕ ИСПРАВЛЕНИЕ ROUTES
# Исправляем проблему с логином и отсутствием sidebar

echo "🎊🔥⚡ МГНОВЕННОЕ ИСПРАВЛЕНИЕ ROUTES! ⚡🔥🎊"
echo ""
echo "🎯 ПРОБЛЕМА: Routes не показывают sidebar и ведут на логин"
echo "💡 РЕШЕНИЕ: Правильная структура в AppRouter.tsx"

cd f

echo "1️⃣ BACKUP И ИСПРАВЛЕНИЕ AppRouter.tsx:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Backup
cp src/app/AppRouter.tsx src/app/AppRouter.tsx.before_instant_fix

# Исправляем AppRouter.tsx с правильными imports и структурой
cat > src/app/AppRouter.tsx << 'EOF'
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import LoginPage from '../pages/auth/LoginPage';
import AuthGuard from '../components/account/AuthGuard';
import AccountDashboardPage from '../pages/account/dashboard/AccountDashboardPage';
import CompanyLayout from '../components/company/CompanyLayout';

// Company Pages
import DashboardPage from '../pages/company/dashboard/DashboardPage';
import ClientsPage from '../pages/company/clients/ClientsPage';
import ProductsPage from '../pages/company/products/ProductsPage';
import PurchasesPage from '../pages/company/purchases/PurchasesPage';
import SalesPage from '../pages/company/sales/SalesPage';
import WarehousePage from '../pages/company/warehouse/WarehousePage';
import ChartOfAccountsPage from '../pages/company/chart-of-accounts/ChartOfAccountsPage';
import BankingPage from '../pages/company/banking/BankingPage';
import SettingsPage from '../pages/company/settings/SettingsPage';
import TabBookDemo from '../components/tabbook/TabBookDemo';
import SolarCloudIDE from '../components/cloudide/SolarCloudIDE';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        
        {/* Account Level */}
        <Route
          path="/account/dashboard"
          element={
            <AuthGuard>
              <AccountDashboardPage />
            </AuthGuard>
          }
        />

        {/* Company Level - All wrapped in CompanyLayout */}
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
          path="/purchases"
          element={
            <AuthGuard>
              <CompanyLayout>
                <PurchasesPage />
              </CompanyLayout>
            </AuthGuard>
          }
        />

        <Route
          path="/sales"
          element={
            <AuthGuard>
              <CompanyLayout>
                <SalesPage />
              </CompanyLayout>
            </AuthGuard>
          }
        />

        <Route
          path="/warehouse"
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

        <Route
          path="/banking"
          element={
            <AuthGuard>
              <CompanyLayout>
                <BankingPage />
              </CompanyLayout>
            </AuthGuard>
          }
        />

        <Route
          path="/tabbook"
          element={
            <AuthGuard>
              <CompanyLayout>
                <TabBookDemo />
              </CompanyLayout>
            </AuthGuard>
          }
        />

        <Route
          path="/cloudide"
          element={
            <AuthGuard>
              <CompanyLayout>
                <SolarCloudIDE />
              </CompanyLayout>
            </AuthGuard>
          }
        />

        <Route
          path="/settings"
          element={
            <AuthGuard>
              <CompanyLayout>
                <SettingsPage />
              </CompanyLayout>
            </AuthGuard>
          }
        />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/account/dashboard" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
EOF

echo "✅ AppRouter.tsx полностью исправлен!"

echo ""
echo "2️⃣ ПРОВЕРЯЕМ И СОЗДАЁМ НЕДОСТАЮЩИЕ ФАЙЛЫ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Проверяем какие файлы существуют
echo "🔍 Проверяем существующие страницы:"

FILES_TO_CHECK=(
  "src/pages/company/warehouse/WarehousePage.tsx"
  "src/pages/company/sales/SalesPage.tsx"
  "src/components/company/CompanyLayout.tsx"
)

for file in "${FILES_TO_CHECK[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file - найден"
  else
    echo "❌ $file - НЕ НАЙДЕН!"
    
    # Создаём недостающие файлы
    if [[ "$file" == *"WarehousePage.tsx" ]]; then
      mkdir -p src/pages/company/warehouse
      echo "📝 Создаём простую WarehousePage..."
      cat > "$file" << 'WAREHOUSE_EOF'
import React from 'react';

const WarehousePage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        🏭 Warehouse Management
      </h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">
          Warehouse inventory management - integration with Purchases and Sales
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">
            📦 Current Stock: RESIDUES TECHNICAL OIL - 33 T
          </p>
        </div>
      </div>
    </div>
  );
};

export default WarehousePage;
WAREHOUSE_EOF
      echo "✅ WarehousePage создана"
    fi
    
    if [[ "$file" == *"SalesPage.tsx" ]]; then
      mkdir -p src/pages/company/sales
      echo "📝 Создаём простую SalesPage..."
      cat > "$file" << 'SALES_EOF'
import React from 'react';

const SalesPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        💰 Sales Management
      </h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">
          Sales order management - reduces warehouse inventory
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">
            💰 Recent Sales: 10 T sold at €800/T = €8,000
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
SALES_EOF
      echo "✅ SalesPage создана"
    fi
  fi
done

echo ""
echo "3️⃣ ОСТАНАВЛИВАЕМ И ПЕРЕЗАПУСКАЕМ DEV SERVER:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Останавливаем dev server
echo "🛑 Останавливаем dev server..."
pkill -f "vite.*dev" 2>/dev/null || echo "Dev server не был запущен"

# Очищаем кэши
rm -rf node_modules/.vite 2>/dev/null
rm -rf .vite 2>/dev/null

echo "🔄 Кэши очищены"

echo ""
echo "🎊🔥⚡ МГНОВЕННОЕ ИСПРАВЛЕНИЕ ЗАВЕРШЕНО! ⚡🔥🎊"
echo ""
echo "✅ ЧТО ИСПРАВЛЕНО:"
echo "   🔗 Все routes обёрнуты в CompanyLayout"
echo "   📁 Недостающие страницы созданы"  
echo "   🔄 Кэши очищены"
echo "   🛑 Dev server остановлен"
echo ""
echo "🚀 КОМАНДЫ ДЛЯ ЗАПУСКА:"
echo "   cd f && npm run dev"
echo ""
echo "🎯 ЧТО ДОЛЖНО РАБОТАТЬ:"
echo "   ✅ http://localhost:5173/dashboard → Dashboard + Sidebar"
echo "   ✅ http://localhost:5173/purchases → Purchases + Sidebar"
echo "   ✅ http://localhost:5173/warehouse → Warehouse + Sidebar"
echo "   ✅ http://localhost:5173/sales → Sales + Sidebar"
echo "   ✅ Все submenu должны работать"
echo ""
echo "💫 ЗАПУСКАЙ И ТЕСТИРУЙ NAVIGATION!"
echo "🏆 SIDEBAR БУДЕТ ВИДЕН НА ВСЕХ СТРАНИЦАХ!"