import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ClientsPage from './pages/clients/ClientsPage';
import ClientDetailPage from './pages/clients/ClientDetailPage';
import Layout from './components/layout/Layout';

// Создаем queryClient с настройками кэширования
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Не обновлять данные при фокусе окна
      retry: 1, // Повторить запрос только один раз в случае ошибки
      staleTime: 5 * 60 * 1000, // Данные считаются свежими в течение 5 минут
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Перенаправление с корневого пути на дашборд */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Маршрут для авторизации */}
          <Route path="/auth/login" element={<LoginPage />} />

          {/* Защищенные маршруты с общим Layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/:id" element={<ClientDetailPage />} />
          </Route>

          {/* Перенаправление для несуществующих путей */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
