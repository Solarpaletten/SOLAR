// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OnboardingPage from './pages/auth/OnboardingPage';
import EmailConfirmPage from './pages/auth/EmailConfirmPage';
// import SolarAssistantPage from './pages/assistant/SolarAssistantPage';
import Layout from './components/layout/Layout';
import ClientsPage from './pages/clients/ClientsPage';
import ClientDetailPage from './pages/clients/ClientDetailPage';
// import WarehousePage from './pages/warehouse/WarehousePage';
import BankPage from './pages/bank/BankPage';
// import NewClientPage from './pages/clients/NewClientPage';
import DashboardPage from './pages/dashboard/DashboardPage';
// import AdminPage from './pages/administrator/AdminPage';
// import AdminAnalyticsPage from './pages/administrator/AdminAnalyticsPage';
// import PurchasesPage from './pages/purchases/PurchasesPage';
// import PurchasesDetailPage from './pages/purchases/PurchasesDetailPage';
// import CreatePurchasesPage from './pages/purchases/CreatePurchasesPage';
// import EditPurchasesPage from './pages/purchases/EditPurchasesPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 минут
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Публичные маршруты */}
        {/* <Route path="/landing" element={<LandingPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/confirm" element={<EmailConfirmPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} /> */}

        {/* Защищенные маршруты с использованием ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            {/* ПЕРЕНАПРАВЛЯЕМ НА DASHBOARD ПО УМОЛЧАНИЮ */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* ОСНОВНЫЕ СТРАНИЦЫ */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="clients/:id" element={<ClientDetailPage />} />
            <Route path="bank" element={<BankPage />} />

            {/*
            <Route path="clients/new" element={<NewClientPage />} />
            
            <Route path="warehouse">
              <Route path="purchases" element={<PurchasesPage />} />
              <Route path="purchases/create" element={<CreatePurchasesPage />} />
              <Route path="purchases/edit/:id" element={<EditPurchasesPage />} />
              <Route path="purchases/:id" element={<PurchasesDetailPage />} />
              <Route path="sales" element={<WarehousePage />} />
              <Route path="client-prices" element={<WarehousePage />} />
              <Route path="automatic-invoicing" element={<WarehousePage />} />
              <Route path="sales-returns" element={<WarehousePage />} />
              <Route path="remaining-items" element={<WarehousePage />} />
              <Route path="item-movement" element={<WarehousePage />} />
              <Route path="consignment-balance" element={<WarehousePage />} />
              <Route path="stock-taking" element={<WarehousePage />} />
            </Route>
            
            <Route path="general-ledger" element={<div>General Ledger - Coming Soon</div>} />
            <Route path="cashier" element={<div>Cashier - Coming Soon</div>} />
            <Route path="reports" element={<div>Reports - Coming Soon</div>} />
            <Route path="personnel" element={<div>Personnel - Coming Soon</div>} />
            <Route path="production" element={<div>Production - Coming Soon</div>} />
            <Route path="assets" element={<div>Assets - Coming Soon</div>} />
            <Route path="documents" element={<div>Documents - Coming Soon</div>} />
            <Route path="salary" element={<div>Salary - Coming Soon</div>} />
            <Route path="declaration" element={<div>Declaration - Coming Soon</div>} />
            <Route path="settings" element={<div>Settings - Coming Soon</div>} />
            <Route path="administrator" element={<AdminPage />} />
            <Route path="administrator/analytics" element={<AdminAnalyticsPage />} />
            */}
          </Route>
        </Route>

        {/* Обработка неизвестных маршрутов */}
        <Route path="*" element={<Navigate to="/ " replace />} />
      </Routes>
    </QueryClientProvider>
  );
};

export default App;