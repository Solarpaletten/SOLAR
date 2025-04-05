// src/services/onboardingService.ts
import { api } from '../api/axios';
// Удалите неиспользуемый импорт axios

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
      
      // Генерируем уникальный код компании для предотвращения дублирования
      // Например, добавляем временную метку, если это production среда
      if (window.location.hostname.includes('onrender.com')) {
        data.companyCode = `${data.companyCode}_${Date.now().toString().slice(-4)}`;
      }
      
      const response = await api.post('/onboarding/setup', data);
      
      console.log('Ответ от онбординга:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Подробности ошибки:', error);
      
      // Более детальная обработка ошибок
      if (error.response) {
        if (error.response.status === 500) {
          throw new Error('Server error during company setup. Please try again later.');
        } else if (error.response.status === 409) {
          throw new Error('Company code already exists. Please try a different code.');
        }
      }
      
      throw new Error('Failed to setup company. ' + (error.message || ''));
    }
  }
};

export default onboardingService;



