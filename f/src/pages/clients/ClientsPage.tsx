import React from 'react';
import { useNavigate } from 'react-router-dom';

const ClientsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Clients</h1>
      <button onClick={() => navigate('/clients/new')}>Add Client</button>
      <p>No clients yet.</p>
    </div>
  );
};

export default ClientsPage;
