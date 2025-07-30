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
          path="/account/dashboard"
          element={
            <AuthGuard>
              <AccountDashboardPage />
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
              <DashboardPage />
            </AuthGuard>
          }
        />

        <Route
          path="/clients"
          element={
            <AuthGuard>
              <ClientsPage />
            </AuthGuard>
          }
        />

        <Route
          path="/clients/:id"
          element={
            <AuthGuard>
              <ClientDetailPage />
            </AuthGuard>
          }
        />

        <Route
          path="/products"
          element={
            <AuthGuard>
              <ProductsPage />
            </AuthGuard>
          }
        />

        <Route
          path="/banking"
          element={
            <AuthGuard>
              <BankingPage />
            </AuthGuard>
          }
        />

        <Route
          path="/sales"
          element={
            <AuthGuard>
              <SalesPage />
            </AuthGuard>
          }
        />

        <Route
          path="/purchases"
          element={
            <AuthGuard>
              <PurchasesPage />
            </AuthGuard>
          }
        />

        <Route
          path="/warehouse"
          element={
            <AuthGuard>
              <div className="p-6">
                <h1 className="text-2xl font-bold">Warehouse Management</h1>
                <p>This page will be implemented in future versions</p>
              </div>
            </AuthGuard>
          }
        />

        <Route
          path="/chart-of-accounts"
          element={
            <AuthGuard>
              <ChartOfAccountsPage />
            </AuthGuard>
          }
        />

        <Route
          path="/settings"
          element={
            <AuthGuard>
              <div className="p-6">
                <h1 className="text-2xl font-bold">Company Settings</h1>
                <p>This page will be implemented in future versions</p>
              </div>
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
