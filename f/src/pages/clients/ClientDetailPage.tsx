import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ClientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <div>
        <Link to="/clients">Back to Clients</Link>
      </div>
      <h1>Client Details</h1>
      <p>Client ID: {id}</p>
    </div>
  );
};

export default ClientDetailPage;
