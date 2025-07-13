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
import SolarAssistantPage from './pages/assistant/SolarAssistantPage';
import Layout from './components/layout/Layout';
import ClientsPage from './pages/clients/ClientsPage';
import ClientDetailPage from './pages/clients/ClientDetailPage';
import NewClientPage from './pages/clients/NewClientPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AdminPage from './pages/administrator/AdminPage';
import AdminAnalyticsPage from './pages/administrator/AdminAnalyticsPage';
import PurchasesPage from './pages/purchases/PurchasesPage';
import PurchasesDetailPage from './pages/purchases/PurchasesDetailPage';
import CreatePurchasesPage from './pages/purchases/CreatePurchasesPage';
import EditPurchasesPage from './pages/purchases/EditPurchasesPage';
import VatPage from './pages/VatPage';
import VatReportPage from './pages/VatReportPage';

// Заглушки для остальных страниц
const Warehouse = () => (
  <div className="p-6">
    <h1 className="text-2xl font-semibold">Warehouse</h1>
  </div>
);
const GeneralLedger = () => (
  <div className="p-6">
    <h1 className="text-2xl font-semibold">General Ledger</h1>
  </div>
);
const Cashier = () => (
  <div className="p-6">
    <h1 className="text-2xl font-semibold">Cashier</h1>
  </div>
);
const Reports = () => (
  <div className="p-6">
    <h1 className="text-2xl font-semibold">Reports</h1>
  </div>
);
const Personnel = () => (
  <div className="p-6">
    <h1 className="text-2xl font-semibold">Personnel</h1>
  </div>
);
const Production = () => (
  <div className="p-6">
    <h1 className="text-2xl font-semibold">Production</h1>
  </div>
);
const Assets = () => (
  <div className="p-6">
    <h1 className="text-2xl font-semibold">Assets</h1>
  </div>
);
const Documents = () => (
  <div className="p-6">
    <h1 className="text-2xl font-semibold">Documents</h1>
  </div>
);
const Salary = () => (
  <div className="p-6">
    <h1 className="text-2xl font-semibold">Salary</h1>
  </div>
);
const Declaration = () => (
  <div className="p-6">
    <h1 className="text-2xl font-semibold">Declaration</h1>
  </div>
);
const Settings = () => (
  <div className="p-6">
    <h1 className="text-2xl font-semibold">Settings</h1>
  </div>
);

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
        {/* Публичные маршруты без авторизации */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/vat" />} />
          <Route path="vat" element={<VatPage />} />
          <Route path="vat-report" element={<VatReportPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="solar" element={<SolarAssistantPage />} />
        </Route>
        
        {/* Все остальные маршруты на VAT */}
        <Route path="*" element={<Navigate to="/vat" replace />} />
      </Routes>
    </QueryClientProvider>
  );
};

export default App;