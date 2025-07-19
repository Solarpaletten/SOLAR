// src/services/onboardingService.ts
import { api } from '../api/axios';
import { standardizeCompanyCode } from '../utils/companyUtils';

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

      // Валидация данных перед отправкой
      if (!data.companyCode || !data.directorName) {
        throw new Error('Код компании и имя директора обязательны');
      }

      // Стандартизируем код компании, удаляя возможный суффикс
      const cleanCompanyCode = standardizeCompanyCode(data.companyCode);

      console.log('Стандартизация кода компании:', {
        оригинальный: data.companyCode,
        стандартизированный: cleanCompanyCode,
      });

      const requestData = {
        ...data,
        companyCode: cleanCompanyCode,
      };

      console.log('Отправляемые данные:', requestData);

      const response = await api.post('/onboarding/setup', requestData);

      console.log('Ответ от онбординга:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Подробности ошибки:', error);

      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        if (status === 500) {
          throw new Error(
            'Ошибка сервера при настройке компании. Пожалуйста, попробуйте позже.'
          );
        } else if (status === 409) {
          throw new Error(
            'Код компании уже существует. Пожалуйста, попробуйте другой код.'
          );
        } else if (status === 400 && errorData?.code?.startsWith('P')) {
          // Ошибки Prisma
          throw new Error(
            `Ошибка базы данных: ${errorData.error || 'Неизвестная ошибка'}`
          );
        } else if (errorData?.error) {
          throw new Error(errorData.error);
        }
      }

      // Если нет структурированного ответа или другая ошибка
      throw new Error(
        'Не удалось настроить компанию: ' +
          (error.message || 'Неизвестная ошибка')
      );
    }
  },
};

export default onboardingService;
