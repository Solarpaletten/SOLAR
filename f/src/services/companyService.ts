// f/src/services/companyService.ts
// ===============================================
// 🏗️ COMPANY SERVICE ДЛЯ ДВУХУРОВНЕВОЙ АРХИТЕКТУРЫ
// ===============================================

import { api } from '../api/axios';
import { withMockFallback, shouldUseMocks } from '../api/mockConfig';

export interface Company {
  id: number;
  code: string;
  name: string;
  short_name?: string;
  description?: string;
  status: string;
  created: string;
  employees?: number;
  is_active?: boolean;
  owner?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface CompaniesResponse {
  success: boolean;
  companies: Company[];
  count: number;
}

// Мок-данные для fallback
const mockCompanies: Company[] = [
  {
    id: 1,
    code: 'SOLAR',
    name: 'SOLAR Energy Ltd',
    description: 'Main solar energy company',
    status: 'Active',
    created: '2023-10-03',
    employees: 15,
    is_active: true
  }
];

export const companyService = {
  // ===============================================
  // 📋 Получить список компаний (Account Level)
  // ===============================================
  getCompanies: async (): Promise<CompaniesResponse> => {
    console.log('🏢 Getting companies...');
    
    return withMockFallback(
      async () => {
        const response = await api.get<CompaniesResponse>('/api/account/companies');
        console.log('✅ Companies loaded from API:', response.data.companies?.length || 0);
        return response.data;
      },
      {
        success: true,
        companies: mockCompanies,
        count: mockCompanies.length
      }
    );
  },

  // ===============================================
  // 🎯 Выбрать компанию и установить контекст
  // ===============================================
  selectCompany: async (companyId: number): Promise<{ success: boolean; companyId: number }> => {
    console.log(`🎯 Selecting company ID: ${companyId}`);
    
    try {
      // ✅ ИСПРАВЛЕНО: Используем те же ключи что в CompanyTransitPage.tsx и axios.ts
      localStorage.setItem('currentCompanyId', companyId.toString()); // ✅ camelCase
      localStorage.setItem('companySelectedAt', new Date().toISOString());
      
      console.log(`✅ Company ${companyId} saved to localStorage with key: currentCompanyId`);
      
      // 2. Обновляем axios headers для всех будущих запросов
      api.defaults.headers['x-company-id'] = companyId.toString(); // ✅ lowercase как в axios.ts
      
      console.log(`✅ x-company-id header set to: ${companyId}`);
      
      // 3. Опционально уведомляем backend о выборе компании
      if (!shouldUseMocks()) {
        try {
          await api.post('/api/account/companies/select', {
            company_id: companyId
          });
          console.log('✅ Backend notified about company selection');
        } catch (error) {
          console.warn('⚠️ Failed to notify backend, but continuing...', error);
          // Не блокируем процесс если backend не отвечает
        }
      }
      
      return { success: true, companyId };
      
    } catch (error) {
      console.error('❌ Error selecting company:', error);
      throw error;
    }
  },

  // ===============================================
  // 📋 Получить текущую выбранную компанию
  // ===============================================
  getCurrentCompany: (): { id: number; selectedAt: Date } | null => {
    // ✅ ИСПРАВЛЕНО: Используем те же ключи что в axios.ts
    const companyId = localStorage.getItem('currentCompanyId'); // ✅ camelCase
    const selectedAt = localStorage.getItem('companySelectedAt');
    
    if (companyId) {
      console.log(`📋 Current company: ${companyId} (selected at ${selectedAt})`);
      return {
        id: parseInt(companyId),
        selectedAt: selectedAt ? new Date(selectedAt) : new Date()
      };
    }
    
    console.log('📋 No company currently selected');
    return null;
  },

  // ===============================================
  // 🧹 Очистить выбор компании (переход на Account Level)
  // ===============================================
  clearCompanySelection: (): void => {
    console.log('🧹 Clearing company selection');
    
    // ✅ ИСПРАВЛЕНО: Используем те же ключи что в CompanyTransitPage.tsx
    localStorage.removeItem('currentCompanyId'); // ✅ camelCase
    localStorage.removeItem('currentCompanyName');
    localStorage.removeItem('companySelectedAt');
    
    // Убираем header из axios
    if (api.defaults.headers['x-company-id']) { // ✅ lowercase
      delete api.defaults.headers['x-company-id'];
    }
    
    console.log('✅ Company selection cleared');
  },

  // ===============================================
  // 🔄 Проверить доступность контекста компании  
  // ===============================================
  checkAvailable: async (): Promise<{ available: boolean }> => {
    console.log('🔍 Checking company context availability...');
    
    if (shouldUseMocks()) {
      return { available: true };
    }
    
    try {
      const response = await api.get('/api/company-context/available');
      return { available: response.data.available || true };
    } catch (error) {
      console.warn('❌ Company context check failed:', error);
      return { available: false };
    }
  },

  // ===============================================
  // 🆕 Создать новую компанию
  // ===============================================
  createCompany: async (companyData: Partial<Company>): Promise<Company> => {
    console.log('🆕 Creating new company...', companyData);
    
    const response = await api.post<Company>('/api/account/companies', companyData);
    console.log('✅ Company created:', response.data);
    return response.data;
  },

  // ===============================================
  // 🔧 Автоматическое восстановление контекста при загрузке
  // ===============================================
  restoreCompanyContext: (): boolean => {
    const currentCompany = companyService.getCurrentCompany();
    
    if (currentCompany) {
      // ✅ ИСПРАВЛЕНО: Используем правильный заголовок (lowercase)
      api.defaults.headers['x-company-id'] = currentCompany.id.toString(); // ✅ lowercase
      
      console.log(`🔄 Company context restored: ${currentCompany.id}`);
      return true;
    }
    
    console.log('🔄 No company context to restore');
    return false;
  }
};

// ===============================================
// 🚀 АВТОМАТИЧЕСКОЕ ВОССТАНОВЛЕНИЕ КОНТЕКСТА ПРИ ИМПОРТЕ
// ===============================================
// Автоматически восстанавливаем контекст компании при загрузке модуля
companyService.restoreCompanyContext();

export default companyService;
