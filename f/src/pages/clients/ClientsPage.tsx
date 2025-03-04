import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/axios';

const fetchClients = async () => {
  const response = await api.get('/clients'); // Убираем /api
  return response.data;
};

const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Clients</h1>
      <button
        onClick={() => navigate('/clients/new')}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add Client
      </button>
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
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client: any) => (
              <tr key={client.id}>
                <td className="py-2 px-4 border">{client.name}</td>
                <td className="py-2 px-4 border">{client.email}</td>
                <td className="py-2 px-4 border">{client.code}</td>
                <td className="py-2 px-4 border">{client.vat_code}</td>
                <td className="py-2 px-4 border">
                  <Link
                    to={`/clients/${client.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClientsPage;
