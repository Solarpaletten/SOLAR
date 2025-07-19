/**
 * Конфигурация использования мок-данных в приложении
 * Позволяет гибко управлять, когда использовать моки, а когда - реальные данные
 */

// Определяем, находимся ли в режиме разработки
export const isDevelopment = import.meta.env.DEV;

// Получаем настройку из переменных окружения (если есть)
export const ENABLE_MOCKS = import.meta.env.VITE_ENABLE_MOCKS === 'true';

/**
 * Функция определяет, нужно ли использовать мок-данные
 * @param {boolean} preferRealData - Предпочитать ли реальные данные, даже если моки включены
 * @returns {boolean} - Возвращает true, если нужно использовать моки
 */
export const shouldUseMocks = (preferRealData: boolean = false): boolean => {
  // Использовать моки, если они явно включены И мы в режиме разработки
  // И при этом не указано, что предпочитаем реальные данные
  return ENABLE_MOCKS && isDevelopment && !preferRealData;
};

/**
 * Функция для условного выполнения функции с fallback на моки
 * @param {Function} apiCall - Функция вызова API
 * @param {any} mockData - Данные-заглушки
 * @param {boolean} preferRealData - Предпочитать ли реальные данные
 * @returns {Promise<any>} - Результат выполнения API вызова или мок-данные
 */
export const withMockFallback = async <T>(
  apiCall: () => Promise<T>,
  mockData: T,
  preferRealData: boolean = false
): Promise<T> => {
  // Если моки отключены или предпочитаем реальные данные - пытаемся выполнить API вызов
  if (!shouldUseMocks(preferRealData)) {
    try {
      return await apiCall();
    } catch (error) {
      console.error('API call failed:', error);

      // В случае ошибки, используем моки только в режиме разработки
      if (isDevelopment) {
        console.warn('Falling back to mock data due to API error');
        return mockData;
      }

      // Иначе пробрасываем ошибку дальше
      throw error;
    }
  }

  // Если моки включены - возвращаем мок-данные
  console.info('Using mock data');
  return mockData;
};
