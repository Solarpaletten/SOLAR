// src/services/onboardingService.ts
import { api } from '../api/axios';
import axios from 'axios'; // Добавьте этот импорт

interface OnboardingData {
  companyCode: string;
  directorName: string;
  name?: string;
  email?: string;
  phone?: string;
}

const onboardingService = {
  // Установка компании при онбординге
  setupCompany: async (data: OnboardingData) => {
    try {
      console.log('Отправка запроса на онбординг:', data);
      console.log('Токен:', localStorage.getItem('token'));
      
      // Используйте api, а не axios напрямую
      const response = await api.post('/onboarding/setup', data);
      
      console.log('Ответ от онбординга:', response.data);
      return response.data;
    } catch (error) {
      console.error('Подробности ошибки:', error);
      throw new Error('Failed to setup company');
    }
  }
};

export default onboardingService;