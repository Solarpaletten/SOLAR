// f/src/pages/account/dashboard/AccountDashboardPage.tsx
// ===============================================
// 🏢 ИСПРАВЛЕННЫЙ ACCOUNT DASHBOARD БЕЗ БЕСКОНЕЧНОГО ЦИКЛА
// ===============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import companyService from '../../../services/companyService';

interface Company {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
  created_at: string;
}

const AccountDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // 🔧 ИСПРАВЛЕНО: useEffect с правильными зависимостями
  useEffect(() => {
    let mounted = true; // Prevent state updates if component unmounted

    const loadCompanies = async () => {
      try {
        console.log('🔄 Loading companies for Account Dashboard...');
        setLoading(true);
        setError(null);

        // 🎯 ИСПОЛЬЗУЕМ WORKING ENDPOINT
        const response = await fetch('/api/company-context/available');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ API Response:', data);

        if (mounted && data.success && data.companies) {
          setCompanies(data.companies);
          setIsConnected(true);
          console.log(`✅ Loaded ${data.companies.length} companies from API`);
        } else {
          throw new Error('Invalid API response format');
        }

      } catch (error: any) {
        console.error('❌ Error loading companies:', error);
        
        if (mounted) {
          setError(error.message || 'Failed to load companies');
          setIsConnected(false);
          
          // 🛡️ FALLBACK - показываем хотя бы что-то
          setCompanies([
            { id: 1, name: 'SOLAR Energy Ltd', code: 'SOLAR', is_active: true, created_at: new Date().toISOString() },
            { id: 2, name: 'Emirates Energy', code: 'EMIRATES', is_active: true, created_at: new Date().toISOString() }
          ]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCompanies();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, []); // 🔧 ИСПРАВЛЕНО: Пустой массив зависимостей - загружаем только один раз!

  // 🎯 ОБРАБОТЧИК КЛИКА НА КОМПАНИЮ
  const handleCompanySelect = async (companyId: number) => {
    try {
      console.log('🚀 User clicked on company ID:', companyId);
      
      // Устанавливаем контекст компании
      const result = await companyService.selectCompany(companyId);
      
      if (result.success) {
        console.log('✅ Company context established successfully');
        console.log('🔄 Navigating to Company Level...');
        navigate('/dashboard');
      } else {
        console.error('❌ Failed to set company context:', result.error);
        alert('Failed to select company. Please try again.');
      }
    } catch (error: any) {
      console.error('❌ Error selecting company:', error);
      alert('Error selecting company: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Solar ERP</h2>
          <p className="text-gray-600">Loading companies from API...</p>
          <p className="text-sm text-gray-500 mt-2">Multi-tenant architecture loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ☀️ Solar ERP - Account Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Two-Level Multi-Tenant Architecture
          </p>
          
          {/* Connection Status */}
          <div className="mt-4 inline-flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`font-medium ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
              {isConnected ? '✅ Connected' : '❌ Connection Error'}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p className="font-medium">⚠️ API Issue:</p>
            <p className="text-sm">{error}</p>
            <p className="text-sm mt-1">Using fallback data for demonstration.</p>
          </div>
        )}

        {/* Stats */}
        <div className="mb-8 text-center">
          <div className="inline-flex bg-white rounded-lg shadow-md px-6 py-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{companies.length}</div>
              <div className="text-sm text-gray-600">
                companies loaded {isConnected ? '(from API)' : '(fallback)'}
              </div>
            </div>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {companies.map((company) => (
            <div
              key={company.id}
              onClick={() => handleCompanySelect(company.id)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {company.code.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-800">{company.name}</h3>
                  <p className="text-gray-500 text-sm">Code: {company.code}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Employees:</span>
                  <span className="font-medium">15</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-medium ${company.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {company.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
                  Enter Company →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create New Company */}
        <div className="text-center">
          <button 
            onClick={() => console.log('Create company clicked')}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium"
          >
            + Create New Company
          </button>
        </div>

        {/* Debug Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <div className="bg-white rounded-lg shadow-sm p-4 max-w-2xl mx-auto">
            <h4 className="font-medium text-gray-700 mb-2">🔧 Debug Information</h4>
            <div className="space-y-1 text-left">
              <p>• Backend Connection: {isConnected ? 'Connected ✅' : 'Error ❌'}</p>
              <p>• Endpoint: <code>/api/company-context/available</code></p>
              <p>• Companies loaded: <strong>{companies.length}</strong></p>
              <p>• Data source: {isConnected ? 'Real API' : 'Fallback mock'}</p>
            </div>
          </div>
        </div>

        {/* System Message */}
        <div className="mt-6 text-center">
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm ${
            isConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            <span className="w-2 h-2 bg-current rounded-full"></span>
            <span>
              {isConnected 
                ? 'Multi-tenant system operational! Companies loaded from real API. All systems connected.' 
                : 'System running in fallback mode. Check API connection for full functionality.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboardPage;
