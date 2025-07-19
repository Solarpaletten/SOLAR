// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Account Layout и компоненты
import AccountLayout from './components/layout/account/AccountLayout';
import AccountDashboardPage from './pages/account/dashboard/AccountDashboardPage';

// Company Layout и компоненты
import CompanyLayout from './components/layout/company/CompanyLayout';
import DashboardPage from './pages/company/dashboard/DashboardPage';
import ClientsPage from './pages/company/clients/ClientsPage';
import ClientDetailPage from './pages/company/clients/ClientDetailPage';
import BankPage from './pages/company/bank/BankPage';

// Транзитная страница
import CompanyTransitPage from './pages/company/CompanyTransitPage';

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
        <Route element={<ProtectedRoute />}>
          {/* УРОВЕНЬ 1: АККАУНТ - Управление системой */}
          <Route path="/account" element={<AccountLayout />}>
            <Route path="dashboard" element={<AccountDashboardPage />} />
            <Route
              path="companies"
              element={<div>Companies Management Page</div>}
            />
            <Route path="users" element={<div>Users Management Page</div>} />
            <Route path="settings" element={<div>Account Settings Page</div>} />
            <Route
              path="employee/*"
              element={<div>Employee Account Pages</div>}
            />
            <Route path="data/*" element={<div>My Data Pages</div>} />
            <Route
              path="affiliate"
              element={<div>Affiliate Program Page</div>}
            />
            <Route path="invites" element={<div>Invites Page</div>} />
            <Route path="reminders" element={<div>Reminders Page</div>} />
            <Route path="support" element={<div>Support Page</div>} />
            <Route path="statistics" element={<div>Statistics Page</div>} />
          </Route>

          {/* ТРАНЗИТНАЯ СТРАНИЦА - Выбор компании */}
          <Route
            path="/account/companies/select"
            element={<CompanyTransitPage />}
          />

          {/* УРОВЕНЬ 2: КОМПАНИЯ - Работа внутри выбранной компании */}
          <Route path="/" element={<CompanyLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="clients/:id" element={<ClientDetailPage />} />
            <Route path="warehouse" element={<div>Warehouse Page</div>} />
            <Route path="bank" element={<BankPage />} />
            <Route
              path="general-ledger"
              element={<div>General Ledger Page</div>}
            />
            <Route path="cashier" element={<div>Cashier Page</div>} />
            <Route path="reports" element={<div>Reports Page</div>} />
            <Route path="personnel" element={<div>Personnel Page</div>} />
            <Route
              path="reference-book"
              element={<div>Reference Book Page</div>}
            />
            <Route path="production" element={<div>Production Page</div>} />
            <Route path="assets" element={<div>Assets Page</div>} />
            <Route path="documents" element={<div>Documents Page</div>} />
            <Route path="salary" element={<div>Salary Page</div>} />
            <Route path="declaration" element={<div>Declaration Page</div>} />
            <Route path="analytics" element={<div>Analytics Page</div>} />
            <Route path="settings" element={<div>Company Settings Page</div>} />
          </Route>
        </Route>

        {/* Главная страница - редирект в систему аккаунта */}
        <Route
          path="/"
          element={<Navigate to="/account/dashboard" replace />}
        />

        {/* Все неизвестные пути - редирект в систему аккаунта */}
        <Route
          path="*"
          element={<Navigate to="/account/dashboard" replace />}
        />
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
