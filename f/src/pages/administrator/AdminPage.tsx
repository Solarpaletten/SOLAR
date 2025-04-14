// src/pages/administrator/AdminPage.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../../api/axios';

// Компонент для отладки определяем отдельно
const DebugInfo: React.FC = () => {
  return (
    <div className="text-sm text-gray-500 mt-2">
      Frontend URL: {window.location.origin}
      <br />
      Backend URL:{' '}
    {import.meta.env.VITE_API_URL || '/api'} {/* Используем Vite.env */}
    </div>
  );
};

const AdminPage: React.FC = () => {
  const [dbInfo, setDbInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAccess = () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setIsAdmin(user.role === 'ADMIN');
    };

    const fetchDatabaseInfo = async () => {
      setLoading(true);
      try {
        const response = await api.get('/stats/database-info');
        setDbInfo(response.data);
      } catch (err) {
        console.error('Error fetching database info:', err);
        setError('Failed to load database information');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
    fetchDatabaseInfo();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Database Administration</h1>
        <DebugInfo />
        <div>Loading database information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Database Administration</h1>
        <DebugInfo />
        <div className="bg-red-50 p-4 rounded-md text-red-600">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-red-600">Access Denied</h1>
        <DebugInfo />
        <p className="mt-2">You have permission to access this page.</p>
      </div>
    );
  }

  // Добавляем состояние для хранения статуса компаний
  const [companies, setCompanies] = useState<any[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  
  // Получаем список компаний и их статус email-подтверждения
  useEffect(() => {
    if (isAdmin) {
      const fetchCompanies = async () => {
        setLoadingCompanies(true);
        try {
          const response = await api.get('/admin/companies');
          setCompanies(response.data);
        } catch (err) {
          console.error('Error fetching companies:', err);
        } finally {
          setLoadingCompanies(false);
        }
      };
      
      fetchCompanies();
    }
  }, [isAdmin]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Database Administration</h1>

      {/* Навигация по административным функциям */}
      <div className="mb-6 flex space-x-2">
        <a 
          href="/administrator/analytics" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Session Analytics Dashboard
        </a>
      </div>

      {/* Компонент отладки */}
      <DebugInfo />
      
      {/* Секция статуса подтверждения email */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-medium mb-4">Company Email Verification Status</h2>
        
        {loadingCompanies ? (
          <div className="animate-pulse">Loading company data...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email Verification Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companies.length > 0 ? (
                companies.map((company: any) => (
                  <tr key={company.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {company.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {company.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {company.user?.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {company.is_email_confirmed ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Not Verified
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No companies found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {dbInfo && (
        <>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-medium mb-4">Database Tables</h2>

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Table Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Record Count
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dbInfo.tables.map((table: any) => (
                  <tr key={table.name}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {table.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {table.recordCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            Last updated: {new Date(dbInfo.timestamp).toLocaleString()}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPage;
