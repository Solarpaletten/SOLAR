import React from 'react';
import { Outlet } from 'react-router-dom';
import CompanySidebar from './CompanySidebar';
import CompanyHeader from './CompanyHeader';

const CompanyLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <CompanySidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <CompanyHeader />
        <main className="flex-1 p-5 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CompanyLayout;