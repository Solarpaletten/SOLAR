import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/axios';

const fetchClient = async (id: string) => {
  const response = await api.get(`/clients/${id}`); // Убираем /api
  return response.data;
};

const ClientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: client,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['client', id],
    queryFn: () => fetchClient(id!),
    enabled: !!id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading client: {error.message}</div>;
  if (!client) return <div>Client not found</div>;

  return (
    <div>
      <div className="mb-4">
        <Link to="/clients" className="text-blue-500 hover:underline">
          ← Back to Clients
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-4">Client Details</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold">{client.name}</h2>
        <p className="mt-2">
          <strong>Email:</strong> {client.email}
        </p>
        <p className="mt-2">
          <strong>Code:</strong> {client.code}
        </p>
        <p className="mt-2">
          <strong>VAT Code:</strong> {client.vat_code}
        </p>
      </div>
    </div>
  );
};

export default ClientDetailPage;
