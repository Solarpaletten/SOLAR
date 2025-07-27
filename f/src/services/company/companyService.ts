// f/src/services/company/companyService.ts
import api from '../../api/axios';

export interface Company {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCompanyData {
  name: string;
  code: string;
  description?: string;
  industry?: string;
  country?: string;
}

// 🏭 Company Management Service
const companyService = {
  // 📋 Получить все компании пользователя (ACCOUNT LEVEL)
  getCompanies: async (): Promise<Company[]> => {
    try {
      console.log('📋 Fetching user companies...');
      
      const response = await api.get<{success: boolean, companies: Company[]}>('/account/companies');
      
      if (response.data.success) {
        console.log('✅ Companies loaded:', response.data.companies);
        return response.data.companies;
      } else {
        throw new Error('Failed to fetch companies');
      }
    } catch (error) {
      console.error('❌ Error fetching companies:', error);
      
      // 🧪 Fallback к моковым данным для демо
      return [
        {
          id: 1,
          name: 'Desert Solar DMCC',
          code: 'DSOL',
          description: 'Solar energy solutions',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Emirates Energy Ltd',
          code: 'EEGY',
          description: 'Renewable energy trading',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }
  },

  // 🏢 Получить текущую активную компанию (COMPANY LEVEL)
  getCurrentCompany: async (): Promise<Company | null> => {
    try {
      const companyId = localStorage.getItem('selectedCompanyId') || localStorage.getItem('currentCompanyId');
      
      if (!companyId) {
        console.log('🔍 No selected company found');
        return null;
      }

      console.log('🔍 Getting current company:', companyId);
      
      const companies = await companyService.getCompanies();
      const currentCompany = companies.find(c => c.id === parseInt(companyId));
      
      if (currentCompany) {
        console.log('✅ Current company loaded:', currentCompany);
        return currentCompany;
      } else {
        console.warn('⚠️ Company not found, clearing selection');
        localStorage.removeItem('selectedCompanyId');
        localStorage.removeItem('currentCompanyId');
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting current company:', error);
      return null;
    }
  },

  // 🔄 Выбрать компанию (переключение контекста)
  selectCompany: async (companyId: number): Promise<{success: boolean, companyId: number}> => {
    try {
      console.log('🔄 Selecting company:', companyId);
      
      // 1. Сохраняем ID выбранной компании
      localStorage.setItem('selectedCompanyId', companyId.toString());
      localStorage.setItem('currentCompanyId', companyId.toString());
      
      // 2. Сохраняем имя компании для отображения
      const companies = await companyService.getCompanies();
      const selectedCompany = companies.find(c => c.id === companyId);
      if (selectedCompany) {
        localStorage.setItem('currentCompanyName', selectedCompany.name);
      }

      // 3. API вызов для переключения контекста (если нужен)
      try {
        await api.post('/account/switch-to-company', { companyId });
        console.log('✅ Company context switched on backend');
      } catch (apiError) {
        console.warn('⚠️ Backend context switch failed, using local only:', apiError);
      }

      console.log('✅ Company selected successfully:', companyId);
      return { success: true, companyId };
      
    } catch (error) {
      console.error('❌ Error selecting company:', error);
      throw new Error('Failed to select company');
    }
  },

  // ➕ Создать новую компанию (ACCOUNT LEVEL)
  createCompany: async (companyData: CreateCompanyData): Promise<Company> => {
    try {
      console.log('🏢 Creating new company:', companyData);

      const response = await api.post<{success: boolean, company: Company}>('/account/companies', companyData);
      
      if (response.data.success && response.data.company) {
        console.log('✅ Company created successfully:', response.data.company);
        return response.data.company;
      } else {
        throw new Error('Failed to create company');
      }
    } catch (error: any) {
      console.error('❌ Error creating company:', error);
      
      // 🔍 Детальная обработка ошибок
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.status === 409) {
        throw new Error('Company with this code already exists');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid company data provided');
      } else {
        throw new Error('Failed to create company. Please try again.');
      }
    }
  },

  // �� Получить статистику компании (COMPANY LEVEL)
  getCompanyStats: async (companyId?: number): Promise<any> => {
    try {
      const targetCompanyId = companyId || localStorage.getItem('currentCompanyId');
      
      if (!targetCompanyId) {
        throw new Error('No company selected');
      }

      console.log('📊 Fetching stats for company:', targetCompanyId);

      const response = await api.get('/company/dashboard/stats', {
        headers: {
          'X-Company-Id': targetCompanyId.toString()
        }
      });
      
      console.log('✅ Company stats loaded:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Error fetching company stats:', error);
      
      // 🧪 Fallback моковые данные
      return {
        success: true,
        stats: {
          clients: 5,
          products: 15,
          sales: 12500,
          orders: 8,
          revenue: '$12,500'
        }
      };
    }
  },

  // 🔧 Utility функции
  clearCompanyContext: () => {
    localStorage.removeItem('selectedCompanyId');
    localStorage.removeItem('currentCompanyId');
    localStorage.removeItem('currentCompanyName');
    console.log('🧹 Company context cleared');
  },

  // 📍 Проверить есть ли активная компания
  hasActiveCompany: (): boolean => {
    const companyId = localStorage.getItem('currentCompanyId');
    return !!companyId;
  }
};

export { companyService };
export default companyService;
