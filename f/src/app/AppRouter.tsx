// f/src/app/AppRouter.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from '../components/auth/AuthGuard';

// Account Level Pages
import AccountDashboard from '../pages/account/dashboard/AccountDashboard';
import CompaniesPage from '../pages/account/companies/CompaniesPage';
import TransitPage from '../pages/account/companies/TransitPage';

// Company Level Pages  
import DashboardPage from '../pages/company/dashboard/DashboardPage';
import ClientsPage from '../pages/company/clients/ClientsPage';
import ProductsPage from '../pages/company/products/ProductsPage';
import BankingPage from '../pages/company/banking/BankingPage';

import ChartOfAccountsPage from "../pages/company/chart-of-accounts/ChartOfAccountsPage";

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Account Level Routes */}
      <Route path="/account/dashboard" element={
        <AuthGuard><AccountDashboard /></AuthGuard>
      } />
      <Route path="/account/companies" element={
        <AuthGuard><CompaniesPage /></AuthGuard>
      } />
      <Route path="/account/companies/transit/:companyId" element={
        <AuthGuard><TransitPage /></AuthGuard>
      } />

      {/* Company Level Routes */}
      <Route path="/dashboard" element={
        <AuthGuard><DashboardPage /></AuthGuard>
      } />
      <Route path="/clients" element={
        <AuthGuard><ClientsPage /></AuthGuard>
      } />
      <Route path="/products" element={
        <AuthGuard><ProductsPage /></AuthGuard>
      } />
      <Route path="/banking" element={
        <AuthGuard><BankingPage /></AuthGuard>
      } />
      <Route path="/chart-of-accounts" element={
        <AuthGuard><ChartOfAccountsPage /></AuthGuard>
      } />
      

      {/* Default Redirects */}
      <Route path="/" element={<Navigate to="/account/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/account/dashboard" replace />} />
    </Routes>
  );
};

export default AppRouter;