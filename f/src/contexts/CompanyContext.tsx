import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../api/axios';

// 🏢 Company Interface (based on Prisma schema)
export interface Company {
  id: number;
  name: string;
  code?: string;
  registration_number?: string;
  vat_number?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  website?: string;
  logo_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // Дополнительные поля
  industry?: string;
  employee_count?: number;
  annual_revenue?: number;
  timezone?: string;
  currency?: string;
}

// 📋 Context Interface
interface CompanyContextType {
  companyId: number | null;
  company: Company | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setCompanyId: (id: number) => void;
  refreshCompany: () => Promise<void>;
  updateCompany: (data: Partial<Company>) => Promise<void>;
  switchCompany: (id: number) => Promise<void>;
  
  // Helper functions
  isCompanyActive: () => boolean;
  getCompanyDisplayName: () => string;
  getCompanyCurrency: () => string;
}

// 🎯 Context Creation
const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// 🎯 Hook for using context
export const useCompanyContext = (): CompanyContextType => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompanyContext must be used within a CompanyProvider');
  }
  return context;
};

// 📦 Provider Props
interface CompanyProviderProps {
  children: ReactNode;
  defaultCompanyId?: number;
  fallbackToFirst?: boolean;
}

// 🏗️ Company Provider Component
export const CompanyProvider: React.FC<CompanyProviderProps> = ({ 
  children, 
  defaultCompanyId,
  fallbackToFirst = true
}) => {
  const [companyId, setCompanyIdState] = useState<number | null>(defaultCompanyId || null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Load company data from API
  const loadCompany = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🏢 Loading company ${id}...`);
      
      const response = await api.get(`/api/account/companies/${id}`);
      
      if (response.data.success) {
        setCompany(response.data.company);
        console.log(`✅ Company loaded: ${response.data.company.name}`);
      } else {
        throw new Error(response.data.error || 'Failed to load company');
      }
      
    } catch (error: any) {
      console.error('❌ Error loading company:', error);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Using mock company data for development');
        const mockCompany: Company = {
          id: id,
          name: 'Desert Solar DMCC',
          code: 'SOLAR001',
          registration_number: 'REG123456789',
          vat_number: 'VAT987654321',
          email: 'info@desertsolar.ae',
          phone: '+971-4-123-4567',
          address: 'DMCC Business Centre, Level 12, Dubai, UAE',
          country: 'United Arab Emirates',
          website: 'https://desertsolar.ae',
          is_active: true,
          industry: 'Renewable Energy',
          employee_count: 50,
          annual_revenue: 5000000,
          timezone: 'Asia/Dubai',
          currency: 'AED',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setCompany(mockCompany);
      } else {
        setError(error.response?.data?.message || error.message || 'Failed to load company');
        setCompany(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🏢 Load first available company as fallback
  const loadFirstCompany = async () => {
    if (!fallbackToFirst) return;
    
    try {
      console.log('🔍 Loading first available company...');
      
      const response = await api.get('/api/account/companies?limit=1');
      
      if (response.data.success && response.data.companies.length > 0) {
        const firstCompany = response.data.companies[0];
        setCompanyIdState(firstCompany.id);
        setCompany(firstCompany);
        console.log(`✅ Fallback to first company: ${firstCompany.name}`);
      } else {
        throw new Error('No companies found');
      }
      
    } catch (error: any) {
      console.error('❌ Error loading first company:', error);
      
      // Ultimate fallback to mock data
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Using ultimate fallback mock company');
        setCompanyIdState(1);
        await loadCompany(1);
      } else {
        setError('No companies available');
      }
    }
  };

  // 🎯 Set company ID and load data
  const setCompanyId = (id: number) => {
    console.log(`🎯 Setting company ID: ${id}`);
    setCompanyIdState(id);
    loadCompany(id);
  };

  // 🔄 Refresh company data
  const refreshCompany = async () => {
    if (companyId) {
      await loadCompany(companyId);
    }
  };

  // ✏️ Update company data
  const updateCompany = async (data: Partial<Company>) => {
    if (!companyId) {
      throw new Error('No company selected');
    }

    try {
      setLoading(true);
      
      const response = await api.put(`/api/account/companies/${companyId}`, data);
      
      if (response.data.success) {
        setCompany(response.data.company);
        console.log(`✅ Company updated: ${response.data.company.name}`);
      } else {
        throw new Error(response.data.error || 'Failed to update company');
      }
    } catch (error: any) {
      console.error('❌ Error updating company:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Switch to different company
  const switchCompany = async (id: number) => {
    console.log(`🔄 Switching to company ${id}`);
    setCompanyId(id);
    
    // Store in localStorage for persistence
    localStorage.setItem('selectedCompanyId', id.toString());
  };

  // 🛡️ Helper: Check if company is active
  const isCompanyActive = (): boolean => {
    return company?.is_active || false;
  };

  // 🏷️ Helper: Get display name
  const getCompanyDisplayName = (): string => {
    if (!company) return 'No Company';
    return company.name || company.code || `Company #${company.id}`;
  };

  // 💰 Helper: Get company currency
  const getCompanyCurrency = (): string => {
    return company?.currency || 'EUR';
  };

  // 📡 Load initial company data
  useEffect(() => {
    const initializeCompany = async () => {
      // Try to restore from localStorage
      const savedCompanyId = localStorage.getItem('selectedCompanyId');
      
      if (savedCompanyId) {
        const id = parseInt(savedCompanyId);
        console.log(`🔄 Restoring company from localStorage: ${id}`);
        setCompanyIdState(id);
        await loadCompany(id);
      } else if (defaultCompanyId) {
        console.log(`🎯 Using default company: ${defaultCompanyId}`);
        setCompanyIdState(defaultCompanyId);
        await loadCompany(defaultCompanyId);
      } else {
        console.log('🔍 No company specified, loading first available...');
        await loadFirstCompany();
      }
    };

    initializeCompany();
  }, []);

  // 📦 Context value
  const contextValue: CompanyContextType = {
    companyId,
    company,
    loading,
    error,
    setCompanyId,
    refreshCompany,
    updateCompany,
    switchCompany,
    isCompanyActive,
    getCompanyDisplayName,
    getCompanyCurrency
  };

  return (
    <CompanyContext.Provider value={contextValue}>
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyContext;
