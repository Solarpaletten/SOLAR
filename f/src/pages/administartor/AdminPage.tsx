// src/pages/administrator/AdminPage.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../../api/axios';

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
    return <div>Loading database information...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isAdmin) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-red-600">Access Denied</h1>
        <p className="mt-2">You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Database Administration</h1>

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
    </div>
  );
};

export default AdminPage;
