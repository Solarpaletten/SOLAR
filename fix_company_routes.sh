#!/bin/bash
# 🔧 ИСПРАВЛЯЕМ COMPANY ROUTES - CompanyLayout для всех страниц
# Проблема: страницы не обёрнуты в CompanyLayout и не показывают sidebar

echo "🎊🔥🔧 ИСПРАВЛЯЕМ COMPANY ROUTES! 🔧🔥🎊"
echo ""
echo "🎯 ПРОБЛЕМА: Company страницы не показывают sidebar"
echo "💡 РЕШЕНИЕ: Обернуть все company routes в CompanyLayout"
echo "📁 ФАЙЛ: f/src/app/AppRouter.tsx"

# Backup
cp f/src/app/AppRouter.tsx f/src/app/AppRouter.tsx.before_company_layout_fix
echo "💾 Backup создан: AppRouter.tsx.before_company_layout_fix"

echo ""
echo "🔧 ИСПРАВЛЯЕМ ROUTES..."

# Создаём исправленную версию AppRouter.tsx
cat > f/src/app/AppRouter.tsx << 'EOF'
// f/src/app/AppRouter.tsx
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
import DashboardPage from '../pages/company/dashboard/DashboardPage';
import ClientsPage from '../pages/company/clients/ClientsPage';
import ClientDetailPage from '../pages/company/clients/ClientDetailPage';
import ProductsPage from '../pages/company/products/ProductsPage';
import BankingPage from '../pages/company/banking/BankingPage';
import SalesPage from '../pages/company/sales/SalesPage';
import PurchasesPage from '../pages/company/purchases/PurchasesPage';
import WarehousePage from '../pages/company/warehouse/WarehousePage';
import ChartOfAccountsPage from '../pages/company/chart-of-accounts/ChartOfAccountsPage';
import SettingsPage from '../pages/company/settings/SettingsPage';
import SolarCloudIDE from '../components/cloudide/SolarCloudIDE';
import CompanyLayout from '../components/company/CompanyLayout';
import TabBookDemo from '../components/tabbook/TabBookDemo';

function App() {
  console.log('🚀 Solar ERP App loaded - Multi-tenant architecture');

  return (
    <Router>
      <Routes>
        {/* ============================================= */}
        {/* 🔓 PUBLIC ROUTES - No authentication needed */}
        {/* ============================================= */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/login" element={<LoginPage />} />

        {/* ============================================= */}
        {/* 🏢 ACCOUNT LEVEL - System management        */}
        {/* ============================================= */}

        <Route
          path="/account/ide"
          element={
            <AuthGuard>
              <SolarCloudIDE />
            </AuthGuard>
          }
        />

        <Route
          path="/account/dashboard"
          element={
            <AuthGuard>
              <AccountDashboardPage />
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

        {/* ============================================= */}
        {/* 🏭 COMPANY LEVEL - Business Operations      */}
        {/* ============================================= */}

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
          path="/clients/:id"
          element={
            <AuthGuard>
              <CompanyLayout>
                <ClientDetailPage />
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
          path="/settings"
          element={
            <AuthGuard>
              <CompanyLayout>
                <SettingsPage />
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

        {/* ============================================= */}
        {/* 🔄 REDIRECTS                                */}
        {/* ============================================= */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
EOF

echo "✅ AppRouter.tsx исправлен!"

echo ""
echo "🎯 ЧТО ИСПРАВЛЕНО:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ ВСЕ COMPANY ROUTES ОБЁРНУТЫ В CompanyLayout:"
echo "   📊 /dashboard → CompanyLayout + DashboardPage"
echo "   👥 /clients → CompanyLayout + ClientsPage"
echo "   👤 /clients/:id → CompanyLayout + ClientDetailPage"
echo "   📦 /products → CompanyLayout + ProductsPage"
echo "   💰 /banking → CompanyLayout + BankingPage"
echo "   💰 /sales → CompanyLayout + SalesPage"
echo "   🛒 /purchases → CompanyLayout + PurchasesPage"
echo "   📦 /warehouse → CompanyLayout + WarehousePage"
echo "   📋 /chart-of-accounts → CompanyLayout + ChartOfAccountsPage"
echo "   ⚙️ /settings → CompanyLayout + SettingsPage"
echo "   ⚡ /tabbook → CompanyLayout + TabBookDemo"
echo "   ☁️ /cloudide → CompanyLayout + SolarCloudIDE"
echo ""
echo "🎊 РЕЗУЛЬТАТ:"
echo "   ✅ Все страницы теперь покажут sidebar"
echo "   ✅ Навигация будет работать правильно"
echo "   ✅ CompanyLayout обеспечит единый стиль"
echo ""
echo "🚀 ТЕСТИРУЙ СЕЙЧАС:"
echo "   1. Frontend перезагрузится автоматически"
echo "   2. Открой: http://localhost:5173/clients"
echo "   3. Увидишь sidebar слева!"
echo "   4. Кликай на любые пункты меню"
echo "   5. Тестируй ⚡ TAB-Бухгалтерия и ☁️ Cloud IDE"
echo ""
echo "💡 ЕСЛИ СТРАНИЦЫ ПУСТЫЕ:"
echo "   Это нормально - нужно создать mock содержимое"
echo "   Главное что sidebar теперь появится!"
echo ""
echo "🎊 COMPANY LAYOUT APPLIED TO ALL ROUTES!"