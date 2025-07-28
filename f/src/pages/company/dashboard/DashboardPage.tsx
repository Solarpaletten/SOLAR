// f/src/pages/company/dashboard/DashboardPage.tsx
import React from 'react';
import CompanyLayout from '../../../components/company/CompanyLayout';

const DashboardPage: React.FC = () => {
  return (
    <CompanyLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to Company Dashboard</h1>
        <p>This is the main content area where relevant information will be displayed based on your selections in the sidebar.</p>
      </div>
    </CompanyLayout>
  );
};

export default DashboardPage;