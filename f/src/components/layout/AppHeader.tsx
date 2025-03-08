// src/components/layout/AppHeader.tsx
import React, { useState, useEffect } from 'react';
import { checkDatabaseConnection } from '../../api/axios';

const AppHeader: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>(
    'checking'
  );

  useEffect(() => {
    const checkDb = async () => {
      try {
        await api.get('/health');
        setDbStatus('connected');
      } catch {
        setDbStatus('error');
      }
    };

    checkDb();
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-900">ERP System</h1>
        <div className="flex items-center">
          <div
            className={`h-3 w-3 rounded-full mr-2 ${
              dbStatus === 'checking'
                ? 'bg-yellow-500'
                : dbStatus === 'connected'
                  ? 'bg-green-500'
                  : 'bg-red-500'
            }`}
          ></div>
          <span className="text-sm text-gray-600">
            Database:{' '}
            {dbStatus === 'checking'
              ? 'Checking...'
              : dbStatus === 'connected'
                ? 'Connected'
                : 'Disconnected'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
