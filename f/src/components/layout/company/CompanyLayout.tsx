import React from 'react';
import { Outlet } from 'react-router-dom';
import CompanySidebar from './CompanySidebar';
import CompanyHeader from './CompanyHeader';

const CompanyLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Сайдбар компании */}
      <CompanySidebar />

      {/* Основная область */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Хедер компании */}
        <CompanyHeader />

        {/* Контент страницы */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CompanyLayout;
