import React from 'react';

const BankOperationsTestPage: React.FC = () => {
  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          🏦 Bank Operations Test Page
        </h1>

        <div className="bg-white rounded shadow p-6">
          <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
            ✅ Банковская страница работает!
          </div>

          <p className="text-gray-600">
            Это простейшая тестовая версия банковских операций.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BankOperationsTestPage;
