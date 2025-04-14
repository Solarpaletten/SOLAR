import React from 'react';
import AdminAnalyticsPanel from '../../components/administrator/AdminAnalyticsPanel';
import PageContainer from '../../components/common/PageContainer';

const AdminAnalyticsPage: React.FC = () => {
  return (
    <PageContainer title="Session Analytics">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Session Analytics Dashboard</h1>
        <p className="text-gray-600">
          Monitor WebSocket sessions and inactive connections in real-time
        </p>
      </div>
      <AdminAnalyticsPanel />
    </PageContainer>
  );
};

export default AdminAnalyticsPage;