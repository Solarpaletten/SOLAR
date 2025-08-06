import React, { useState, useEffect } from 'react';
import { useCompanyContext } from '../../contexts/CompanyContext';
import { api } from '../../api/axios';

interface CompanySelectorProps {
  className?: string;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({ className = '' }) => {
  const { company, companyId, loading, switchCompany, getCompanyDisplayName } = useCompanyContext();
  const [companies, setCompanies] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const response = await api.get('/api/companies');
      if (response.data.success) {
        setCompanies(response.data.companies);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
      // Mock data for development
      setCompanies([
        { id: 1, name: 'Desert Solar DMCC', code: 'SOLAR001' },
        { id: 2, name: 'Emirates Energy LLC', code: 'ENERGY002' }
      ]);
    }
  };

  const handleCompanyChange = async (newCompanyId: number) => {
    try {
      await switchCompany(newCompanyId);
      setShowDropdown(false);
    } catch (error) {
      console.error('Error switching company:', error);
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
      >
        <span className="flex-1 truncate">{getCompanyDisplayName()}</span>
        <span className="ml-2">▼</span>
      </button>

      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          {companies.map((comp) => (
            <button
              key={comp.id}
              onClick={() => handleCompanyChange(comp.id)}
              className={`w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                comp.id === companyId ? 'bg-blue-50 text-blue-700' : ''
              }`}
            >
              <div className="font-medium">{comp.name}</div>
              {comp.code && <div className="text-sm text-gray-500">{comp.code}</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanySelector;
