// f/src/components/company/CompanyLayout.tsx
import React from 'react';
import CompanySidebar from './CompanySidebar';
import CompanyHeader from './CompanyHeader';

interface CompanyLayoutProps {
  children: React.ReactNode;
}

const CompanyLayout: React.FC<CompanyLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* НОВЫЙ iPhone Sidebar */}
      <CompanySidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        < CompanyHeader className="bg-orange-500 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>Invite users</span>
            <span>Minimal</span>
            <span>Balance 0.00 €</span>
            <span>Partnership points 0.00 €</span>
          </div>
          <div className="bg-orange-600 px-3 py-1 rounded">
            <span className="text-sm">
              {localStorage.getItem('currentCompanyName') || 'COMPANY'}
            </span>
            <br />
            <span className="text-xs">
              Company ID: {localStorage.getItem('currentCompanyId') || '0'}
            </span>
          </div>
        </ CompanyHeader >
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default CompanyLayout;