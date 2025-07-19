import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const clients = [
    { id: 1, name: 'Desert Solar DMCC', status: 'Active' },
    { id: 2, name: 'Emirates Energy', status: 'Active' },
    { id: 3, name: 'Test Energy Company', status: 'Active' },
  ];

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          📊 Dashboard - Select Client
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/clients/${client.id}`)}
            >
              <h3 className="font-semibold text-lg">{client.name}</h3>
              <p className="text-green-600">{client.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
