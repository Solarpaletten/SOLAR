import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/axios';

const fetchClients = async () => {
  const response = await api.get('/clients'); // Убираем /api
  return response.data;
};

const DashboardPage: React.FC = () => {
  const {
    data: clients = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading clients: {error.message}</div>;

  const totalClients = clients.length;
  const activeClients = clients.filter(
    (client: any) => client.status === 'active'
  ).length; // Предполагаем, что есть поле status

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Лучшая бухгалтерская компания LEANID SOLAR
      </p>

      {/* Карточки со статистикой */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-100 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Clients</h2>
          <p className="text-2xl">{totalClients}</p>
        </div>
        <div className="p-4 bg-green-100 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Active Clients</h2>
          <p className="text-2xl">{activeClients}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded-lg shadow">
          <h2 className="text-xl font-semibold">New Clients (This Month)</h2>
          <p className="text-2xl">
            {
              clients.filter((client: any) => {
                const createdAt = new Date(client.created_at);
                const now = new Date();
                return (
                  createdAt.getMonth() === now.getMonth() &&
                  createdAt.getFullYear() === now.getFullYear()
                );
              }).length
            }
          </p>
        </div>
      </div>

      {/* Таблица последних клиентов */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Recent Clients</h2>
        {clients.length === 0 ? (
          <p>No clients found.</p>
        ) : (
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Code</th>
                <th className="py-2 px-4 border">VAT Code</th>
              </tr>
            </thead>
            <tbody>
              {clients.slice(0, 5).map((client: any) => (
                <tr key={client.id}>
                  <td className="py-2 px-4 border">{client.name}</td>
                  <td className="py-2 px-4 border">{client.email}</td>
                  <td className="py-2 px-4 border">{client.code}</td>
                  <td className="py-2 px-4 border">{client.vat_code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;