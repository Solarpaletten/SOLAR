// f/src/pages/company/dashboard/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import CompanyLayout from '../../../components/company/CompanyLayout';

const DashboardPage: React.FC = () => {
  const [companyId, setCompanyId] = useState('');
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    // Получаем данные из localStorage для диагностики
    const id = localStorage.getItem('currentCompanyId') || 'NOT_SET';
    const name = localStorage.getItem('currentCompanyName') || 'NOT_SET';
    
    setCompanyId(id);
    setCompanyName(name);
    
    console.log('📊 DashboardPage Context:', { id, name });
  }, []);

  return (
    <CompanyLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to Company Dashboard</h1>
        
        {/* 🎯 ДИАГНОСТИЧЕСКАЯ ИНФОРМАЦИЯ */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-800 mb-3">🔍 Company Context Diagnostics</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-700">Company ID:</span>
              <span className="ml-2 font-mono bg-blue-100 px-2 py-1 rounded text-blue-900">
                {companyId}
              </span>
            </div>
            <div>
              <span className="font-medium text-blue-700">Company Name:</span>
              <span className="ml-2 font-mono bg-blue-100 px-2 py-1 rounded text-blue-900">
                {companyName}
              </span>
            </div>
          </div>
          
          {/* 🎯 СТАТУС ПЕРЕКЛЮЧЕНИЯ */}
          <div className="mt-4 p-3 bg-white rounded border">
            <h3 className="font-medium text-gray-800 mb-2">Context Switching Status:</h3>
            <div className="text-sm space-y-1">
              <div className={`flex items-center ${companyId !== 'NOT_SET' ? 'text-green-600' : 'text-red-600'}`}>
                <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                Company ID: {companyId !== 'NOT_SET' ? 'SET ✅' : 'NOT SET ❌'}
              </div>
              <div className={`flex items-center ${companyName !== 'NOT_SET' ? 'text-green-600' : 'text-red-600'}`}>
                <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                Company Name: {companyName !== 'NOT_SET' ? 'SET ✅' : 'NOT SET ❌'}
              </div>
            </div>
          </div>
        </div>

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Dashboard Content</h2>
          <p className="text-gray-600 mb-4">
            This is the main content area where relevant information will be displayed based on your selections in the sidebar.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
              <h3 className="text-lg font-medium">Clients</h3>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm opacity-90">Total clients</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
              <h3 className="text-lg font-medium">Sales</h3>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm opacity-90">This month</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
              <h3 className="text-lg font-medium">Revenue</h3>
              <p className="text-2xl font-bold">€0</p>
              <p className="text-sm opacity-90">Total revenue</p>
            </div>
          </div>
        </div>

        {/* 🎯 КНОПКА ДЛЯ ТЕСТИРОВАНИЯ */}
        <div className="mt-6 text-center">
          <button 
            onClick={() => {
              const currentId = localStorage.getItem('currentCompanyId');
              const currentName = localStorage.getItem('currentCompanyName');
              alert(`Current Context:\nCompany ID: ${currentId}\nCompany Name: ${currentName}`);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            🔍 Check Current Context
          </button>
        </div>
      </div>
    </CompanyLayout>
  );
};

export default DashboardPage;