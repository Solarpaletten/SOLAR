import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OnboardingPage from './pages/auth/OnboardingPage';
import SolarAssistantPage from './pages/assistant/SolarAssistantPage';

// Импортируем компоненты layout
import Layout from './components/layout/Layout';

// Импортируем страницы клиентов правильно
import ClientsPage from './pages/clients/ClientsPage';
import ClientDetailPage from './pages/clients/ClientDetailPage';
import NewClientPage from './pages/clients/NewClientPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AdminPage from './pages/administrator/AdminPage';  

// Импортируем страницы закупок
import PurchasesPage from './pages/purchases/PurchasesPage';
import PurchasesDetailPage from './pages/purchases/PurchasesDetailPage';
import CreatePurchasesPage from './pages/purchases/CreatePurchasesPage';
import EditPurchasesPage from './pages/purchases/EditPurchasesPage';


// Заглушки для страниц, которые будут разработаны позже
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

// Создание экземпляра QueryClient для React Query
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
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Защищенные маршруты с использованием ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />

            {/* SOLAR Ассистент как часть основного приложения */}
      <Route path="solar" element={<SolarAssistantPage />} />
            
            {/* Маршруты для клиентов */}
            <Route path="clients" element={<ClientsPage />} />
            <Route path="clients/new" element={<NewClientPage />} />
            <Route path="clients/:id" element={<ClientDetailPage />} />
            
            {/* Маршруты для warehouse */}
            <Route path="warehouse">
              {/* Внутри warehouse разные подсекции, включая закупки */}
              <Route path="purchases" element={<PurchasesPage />} />
              <Route path="purchases/create" element={<CreatePurchasesPage />} />
              <Route path="purchases/edit/:id" element={<EditPurchasesPage />} />
              <Route path="purchases/:id" element={<PurchasesDetailPage />} />
              
              {/* Другие подсекции warehouse можно добавить здесь */}
              <Route path="sales" element={<Warehouse />} />
              <Route path="client-prices" element={<Warehouse />} />
              <Route path="automatic-invoicing" element={<Warehouse />} />
              <Route path="sales-returns" element={<Warehouse />} />
              <Route path="remaining-items" element={<Warehouse />} />
              <Route path="item-movement" element={<Warehouse />} />
              <Route path="consignment-balance" element={<Warehouse />} />
              <Route path="stock-taking" element={<Warehouse />} />
              <Route path="revaluation" element={<Warehouse />} />
              <Route path="internal-movement-confirmation" element={<Warehouse />} />
              <Route path="e-commerce" element={<Warehouse />} />
              <Route path="cash-register-sales" element={<Warehouse />} />
            </Route>
            
            <Route path="admin" element={<AdminPage />} />

            <Route path="general-ledger" element={<GeneralLedger />} />
            <Route path="cashier/*" element={<Cashier />} />
            <Route path="reports" element={<Reports />} />
            <Route path="personnel" element={<Personnel />} />
            <Route path="production" element={<Production />} />
            <Route path="assets" element={<Assets />} />
            <Route path="documents" element={<Documents />} />
            <Route path="salary" element={<Salary />} />
            <Route path="declaration" element={<Declaration />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </QueryClientProvider>
  );
};

export default App;