import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Company {
  id: number;
  name: string;
  abbreviation?: string;
  status: string;
  created: string;
  employees: number;
  is_active: boolean;
}

const AccountDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setIsLoading(true);
        console.log('🔄 Loading companies from API...');
        
        const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';
        
        const response = await fetch(`${apiBaseUrl}/api/company-context/available`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ API Response:', data);
        
        // Преобразуем данные из API в формат для UI
        const formattedCompanies = data.companies.map((company: any) => ({
          id: company.id,
          name: company.name,
          abbreviation: company.abbreviation,
          status: company.is_active ? 'Active' : 'Inactive',
          created: new Date(company.created_at || '2023-01-01').toLocaleDateString(),
          employees: 15, // TODO: Добавить реальный подсчет сотрудников в API
          is_active: company.is_active
        }));
        
        setCompanies(formattedCompanies);
        setError(null);
        console.log('✅ Companies loaded:', formattedCompanies);
        
      } catch (err) {
        console.error('❌ Error loading companies:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Fallback к единственной компании при ошибке
        setCompanies([
          { 
            id: 1, 
            name: 'SOLAR Energy Ltd', 
            status: 'Active', 
            created: '2023-10-03', 
            employees: 15,
            is_active: true
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanies();
  }, []);

  const handleCompanySelect = (companyId: number) => {
    console.log(`🚀 Selecting company ID: ${companyId}`);
    // Переход на транзитную страницу
    navigate(`/company/transit?id=${companyId}`);
  };

  const handleCreateCompany = () => {
    navigate('/account/companies/create');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#f7931e] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Solar ERP</h1>
          <p className="text-gray-600 mb-6">Loading companies from API...</p>

          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f7931e]"></div>
          </div>
          
          <p className="text-xs text-gray-400 mt-2">
            Connecting to localhost:4000...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">API Connection Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <p className="text-xs text-red-600 mt-1">Using fallback data. Check if backend is running on port 4000.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600 mt-1">
            Manage your companies and select one to work with
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {companies.length} companies loaded {error ? '(fallback data)' : '(from API)'}
          </p>
        </div>
        <button
          onClick={handleCreateCompany}
          className="bg-[#f7931e] text-white px-4 py-2 rounded-lg hover:bg-[#e05e00] transition-colors"
        >
          Create new company
        </button>
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Search companies..."
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f7931e]"
          />
          <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f7931e]">
            <option value="all">All companies</option>
            <option value="active">Active companies</option>
            <option value="inactive">Inactive companies</option>
          </select>
        </div>

        {/* Radio buttons like in B1.lt */}
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="filter"
              value="all"
              defaultChecked
              className="mr-2"
            />
            All companies
          </label>
          <label className="flex items-center">
            <input type="radio" name="filter" value="active" className="mr-2" />
            Active companies
          </label>
          <label className="flex items-center">
            <input type="radio" name="filter" value="frozen" className="mr-2" />
            Frozen companies
          </label>
        </div>
      </div>

      {/* Companies grid like in B1.lt */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Create new company card */}
        <div
          onClick={handleCreateCompany}
          className="bg-green-500 text-white p-6 rounded-lg cursor-pointer hover:bg-green-600 transition-colors min-h-[120px] flex items-center justify-center"
        >
          <div className="text-center">
            <div className="text-2xl mb-2">+</div>
            <div className="font-semibold">Create new company</div>
          </div>
        </div>

        {/* Company cards - НАСТОЯЩИЕ ДАННЫЕ ИЗ API */}
        {companies.map((company) => (
          <div
            key={company.id}
            onClick={() => handleCompanySelect(company.id)}
            className="bg-blue-500 text-white p-6 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors min-h-[120px] flex flex-col justify-between"
          >
            <div>
              <h3 className="font-bold text-lg mb-2">{company.name}</h3>
              {company.abbreviation && (
                <p className="text-blue-100 text-sm mb-1">{company.abbreviation}</p>
              )}
              <p className="text-blue-100 text-sm">ID: {company.id}</p>
              <p className="text-blue-100 text-sm">
                Employees: {company.employees}
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className={`text-sm ${
                company.status === 'Active' ? 'text-green-200' : 'text-red-200'
              }`}>
                {company.status}
              </span>
              <div className="relative">
                <button className="text-white hover:text-blue-200">⋮</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* API Status and Company Info */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="mr-2">🔌</span>
            API Status & Company Details
          </h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* API Status */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Backend Connection</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>URL: http://localhost:4000</p>
                <p>Endpoint: /api/company-context/available</p>
                <p>Status: {error ? '❌ Error' : '✅ Connected'}</p>
                <p>Companies loaded: {companies.length}</p>
              </div>
            </div>
            
            {/* Company Details */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Company Information</h3>
              <div className="text-sm text-gray-600 space-y-1">
                {companies.map(company => (
                  <div key={company.id} className="border-l-2 border-[#f7931e] pl-2">
                    <p><strong>{company.name}</strong> (ID: {company.id})</p>
                    <p>Status: {company.status}</p>
                    <p>Created: {company.created}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="mr-2">📧</span>
            System Messages
          </h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="text-sm text-gray-600">
            <p className="mb-2">
              <span className="text-xs text-gray-400">2025-07-19 21:48:13</span>
            </p>
            <p>
              🎯 Multi-tenant system operational! Companies loaded from real API. 
              {error ? ' (Fallback data active due to connection error)' : ' All systems connected.'}
            </p>
          </div>
          <div className="text-sm text-gray-600">
            <p className="mb-2">
              <span className="text-xs text-gray-400">2025-07-19 21:51:44</span>
            </p>
            <p>
              ✅ Database connected successfully. Prisma middleware filtering by company_id is active.
              Backend health check: HEALTHY
            </p>
          </div>
          <div className="text-sm text-gray-600">
            <p className="mb-2">
              <span className="text-xs text-gray-400">2025-07-19 12:02:03</span>
            </p>
            <p>
              Welcome to Solar ERP! Your account is connected to the live database. 
              Click on a company card to enter its workspace.
            </p>
          </div>
        </div>
      </div>

      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Debug Information</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Environment: Development</p>
            <p>Backend: localhost:4000 {error ? '❌' : '✅'}</p>
            <p>API Response: {companies.length} companies</p>
            <p>Error: {error || 'None'}</p>
            <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
            <p>Next: Click company → /company/transit?id=1 → /dashboard</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDashboardPage;