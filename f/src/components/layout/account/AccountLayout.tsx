import React from 'react';
import { Outlet } from 'react-router-dom';
import AccountSidebar from './AccountSidebar';
import AccountHeader from './AccountHeader';

const AccountLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Сайдбар аккаунта */}
      <AccountSidebar />

      {/* Основная область */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Хедер аккаунта */}
        <AccountHeader />

        {/* Контент страницы */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;
