// src/services/companyService.ts
import { api } from '../api/axios';
import { standardizeCompanyCode } from '../utils/companyUtils';

export interface Company {
  id: number;
  code: string;
  name: string;
  director_name: string;
  user_id: number;
  is_active: boolean;
  setup_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCompanyData {
  code: string;
  name: string;
  director_name: string;
}

const companyService = {
  // Получение всех компаний пользователя
  getAllCompanies: async (): Promise<Company[]> => {
    try {
      const response = await api.get('/companies');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching companies:', error);
      throw new Error('Не удалось получить список компаний');
    }
  },

  // Получение компании по ID
  getCompanyById: async (id: number): Promise<Company> => {
    try {
      const response = await api.get(`/companies/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching company:', error);
      throw new Error('Не удалось получить информацию о компании');
    }
  },

  // Создание новой компании
  createCompany: async (data: CreateCompanyData): Promise<Company> => {
    try {
      console.log('Creating company with data:', data);
      
      // Стандартизация кода компании
      const cleanCode = standardizeCompanyCode(data.code);
      
      console.log('Using standardized company code:', cleanCode);
      
      const requestData = {
        ...data,
        code: cleanCode
      };
      
      const response = await api.post('/companies', requestData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating company:', error);
      
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 409) {
          throw new Error('Код компании уже существует. Пожалуйста, выберите другой код.');
        } else if (status === 400 && errorData?.details) {
          const validationErrors = errorData.details.map((err: any) => err.msg).join('; ');
          throw new Error(`Ошибка валидации: ${validationErrors}`);
        } else if (errorData?.error) {
          throw new Error(errorData.error);
        }
      }
      
      throw new Error('Не удалось создать компанию');
    }
  },

  // Обновление компании
  updateCompany: async (id: number, data: Partial<CreateCompanyData>): Promise<void> => {
    try {
      // Если обновляется код, стандартизируем его
      if (data.code) {
        data.code = standardizeCompanyCode(data.code);
      }
      
      await api.put(`/companies/${id}`, data);
    } catch (error: any) {
      console.error('Error updating company:', error);
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Не удалось обновить информацию о компании');
    }
  },

  // Удаление компании
  deleteCompany: async (id: number): Promise<void> => {
    try {
      await api.delete(`/companies/${id}`);
    } catch (error: any) {
      console.error('Error deleting company:', error);
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Не удалось удалить компанию');
    }
  }
};

export default companyService;