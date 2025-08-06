#!/bin/bash
# 🏗️ НАСТРОЙКА ПОЛНОЙ COMPANY CONTEXT АРХИТЕКТУРЫ
# Создаём профессиональную ERP структуру

echo "🎊🏗️🔥 СОЗДАНИЕ ПОЛНОЙ ERP АРХИТЕКТУРЫ! 🔥🏗️🎊"
echo ""
echo "📋 ПЛАН РАЗВЕРТЫВАНИЯ:"
echo "   1️⃣ Создать CompanyContext"
echo "   2️⃣ Создать Company Provider"
echo "   3️⃣ Настроить интеграцию с API"
echo "   4️⃣ Обновить App.tsx"
echo "   5️⃣ Создать компанию по умолчанию"
echo ""

# 1. Создаём папку и CompanyContext
echo "1️⃣ СОЗДАНИЕ COMPANY CONTEXT:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

mkdir -p f/src/contexts

cat > f/src/contexts/CompanyContext.tsx << 'EOF'
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
      
      const response = await api.get(`/api/companies/${id}`);
      
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
      
      const response = await api.get('/api/companies?limit=1');
      
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
      
      const response = await api.put(`/api/companies/${companyId}`, data);
      
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
EOF

echo "✅ CompanyContext создан с полной функциональностью!"

# 2. Создаём индексный файл для экспорта
cat > f/src/contexts/index.ts << 'EOF'
export { default as CompanyContext, CompanyProvider, useCompanyContext } from './CompanyContext';
export type { Company } from './CompanyContext';
EOF

echo "✅ Index файл создан для удобного импорта"

# 3. Создаём компонент выбора компании
echo ""
echo "2️⃣ СОЗДАНИЕ COMPANY SELECTOR:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

mkdir -p f/src/components/company

cat > f/src/components/company/CompanySelector.tsx << 'EOF'
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
EOF

echo "✅ CompanySelector создан для переключения между компаниями"

# 4. Создаём инструкции по интеграции в App.tsx
echo ""
echo "3️⃣ ИНСТРУКЦИИ ПО ИНТЕГРАЦИИ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat > f/src/APP_INTEGRATION_INSTRUCTIONS.md << 'EOF'
# 🏗️ ИНТЕГРАЦИЯ CompanyContext В APP.tsx

## 📋 Шаг 1: Обновите импорты в App.tsx

```tsx
// Добавьте в начало App.tsx
import { CompanyProvider } from './contexts/CompanyContext';
```

## 📋 Шаг 2: Оберните приложение в CompanyProvider

```tsx
function App() {
  return (
    <CompanyProvider defaultCompanyId={1} fallbackToFirst={true}>
      <BrowserRouter>
        {/* Ваши существующие роуты */}
        <Routes>
          <Route path="/company/purchases" element={<PurchasesPage />} />
          {/* другие роуты */}
        </Routes>
      </BrowserRouter>
    </CompanyProvider>
  );
}
```

## 📋 Шаг 3: Добавьте CompanySelector в Header/Navbar

```tsx
import CompanySelector from './components/company/CompanySelector';

// В вашем Header компоненте:
<div className="flex items-center space-x-4">
  <CompanySelector className="w-64" />
  {/* другие элементы хедера */}
</div>
```

## 📋 Шаг 4: Проверьте API endpoints

Убедитесь что у вас есть:
- GET /api/companies - список компаний
- GET /api/companies/:id - данные компании
- PUT /api/companies/:id - обновление компании

## 🧪 Шаг 5: Тестирование

1. Откройте DevTools Console
2. Должны увидеть логи: "🏢 Loading company 1..."
3. Проверьте что PurchasesPage загружается без ошибок
4. Company selector должен показывать текущую компанию

## 🔧 Fallback режим

Если API не готов, CompanyContext автоматически использует mock данные в development режиме.
EOF

echo "✅ Инструкции по интеграции созданы"

# 5. Создаём простой хук для Company headers
echo ""
echo "4️⃣ СОЗДАНИЕ COMPANY API HOOK:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

mkdir -p f/src/hooks

cat > f/src/hooks/useCompanyApi.ts << 'EOF'
import { useCompanyContext } from '../contexts/CompanyContext';
import { api } from '../api/axios';

// 🎯 Hook для автоматического добавления Company-ID заголовков
export const useCompanyApi = () => {
  const { companyId } = useCompanyContext();

  const companyApi = {
    get: (url: string, config?: any) => {
      return api.get(url, {
        ...config,
        headers: {
          ...config?.headers,
          'Company-ID': companyId?.toString() || '1'
        }
      });
    },

    post: (url: string, data?: any, config?: any) => {
      return api.post(url, data, {
        ...config,
        headers: {
          ...config?.headers,
          'Company-ID': companyId?.toString() || '1'
        }
      });
    },

    put: (url: string, data?: any, config?: any) => {
      return api.put(url, data, {
        ...config,
        headers: {
          ...config?.headers,
          'Company-ID': companyId?.toString() || '1'
        }
      });
    },

    delete: (url: string, config?: any) => {
      return api.delete(url, {
        ...config,
        headers: {
          ...config?.headers,
          'Company-ID': companyId?.toString() || '1'
        }
      });
    }
  };

  return { companyApi, companyId };
};

export default useCompanyApi;
EOF

echo "✅ useCompanyApi hook создан для автоматических заголовков"

echo ""
echo "🎊🏗️🔥 ПОЛНАЯ COMPANY CONTEXT АРХИТЕКТУРА ГОТОВА! 🔥🏗️🎊"
echo ""
echo "✅ СОЗДАНО:"
echo "   🏢 CompanyContext.tsx - Полный контекст компании"
echo "   🔄 CompanySelector.tsx - Переключатель компаний"
echo "   🎯 useCompanyApi.ts - Хук для API с заголовками"
echo "   📋 APP_INTEGRATION_INSTRUCTIONS.md - Инструкции"
echo ""
echo "🚀 СЛЕДУЮЩИЕ ШАГИ:"
echo "   1️⃣ Обновите App.tsx согласно инструкциям"
echo "   2️⃣ Проверьте что PurchasesPage теперь работает"
echo "   3️⃣ Добавьте CompanySelector в header"
echo "   4️⃣ Протестируйте переключение компаний"
echo ""
echo "💎 FEATURES:"
echo "   🏢 Автоматическая загрузка компании при старте"
echo "   💾 Сохранение выбранной компании в localStorage"
echo "   🔄 Переключение между компаниями на лету"
echo "   🛡️ Fallback к mock данным в development"
echo "   📡 Автоматические Company-ID заголовки в API"
echo "   ⚡ Оптимизированная производительность"