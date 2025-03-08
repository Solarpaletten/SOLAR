import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Импортируем компоненты layout
import Layout from './components/layout/Layout';

// Импортируем страницы клиентов правильно
import ClientsPage from './pages/clients/ClientsPage';
import ClientDetailPage from './pages/clients/ClientDetailPage';
import NewClientPage from './pages/clients/NewClientPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AdminPage from './pages/administartor/AdminPage';

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
const Login = () => (
  <div className="p-6">
    <h1 className="text-2xl font-semibold">Login</h1>
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
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/clients" replace />} />

          {/* Маршруты для клиентов */}
          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/new" element={<NewClientPage />} />
          <Route path="clients/:id" element={<ClientDetailPage />} />
          <Route path="admin" element={<AdminPage />} />

          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="warehouse/*" element={<Warehouse />} />
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

        <Route path="*" element={<Navigate to="/clients" replace />} />
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
