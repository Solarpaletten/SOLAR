// f/src/components/company/CompanyLayout.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface CompanyLayoutProps {
  children: React.ReactNode;
}

const CompanyLayout: React.FC<CompanyLayoutProps> = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/clients', icon: '👥', label: 'Clients' },
    { path: '/banking', icon: '🏦', label: 'Banking' },
    { path: '/warehouse', icon: '📦', label: 'Warehouse' },
    { path: '/ledger', icon: '📋', label: 'General ledger' },
    { path: '/cashier', icon: '💰', label: 'Cashier' },
    { path: '/reports', icon: '📈', label: 'Reports' },
    { path: '/personnel', icon: '👨‍💼', label: 'Personnel' },
    { path: '/production', icon: '🏭', label: 'Production' },
    { path: '/assets', icon: '📦', label: 'Assets' },
    { path: '/documents', icon: '📄', label: 'Documents' },
    { path: '/salary', icon: '💰', label: 'Salary' },
    { path: '/declaration', icon: '📋', label: 'Declaration' },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white flex-shrink-0">
        <div className="p-4">
          <h2 className="text-lg font-bold">Solar</h2>
        </div>
        
        <nav className="mt-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 text-sm hover:bg-slate-700 transition-colors ${
                location.pathname === item.path ? 'bg-slate-700 border-r-2 border-orange-500' : ''
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4">
          <Link
            to="/account/dashboard"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            🔙 Back to Companies
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="flex-1 flex flex-col">
        <header className="bg-orange-500 text-white p-4 flex justify-between items-center">
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
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CompanyLayout;
