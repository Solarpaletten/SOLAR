# Управление мок-данными в frontend-части

## Обзор задачи

Реализована система управления мок-данными для frontend-компонентов с возможностью их включения/отключения через переменные окружения. Мок-данные теперь используются только в режиме разработки и в случае ошибок API.

## Созданные файлы

1. **Конфигурация мок-данных**:
   - `/f/src/api/mockConfig.ts` - основная утилита для управления моками
   - `/f/.env.development` - переменные окружения для разработки

2. **Обновленные сервисы**:
   - `/f/src/services/purchasesService.ts` - обновлен для использования новой системы моков

## Детали реализации

### Конфигурация мок-данных (`mockConfig.ts`)

```typescript
// Определение режима работы
export const isDevelopment = import.meta.env.DEV;
export const ENABLE_MOCKS = import.meta.env.VITE_ENABLE_MOCKS === 'true';

// Функция определения необходимости использования моков
export const shouldUseMocks = (preferRealData: boolean = false): boolean => {
  return ENABLE_MOCKS && isDevelopment && !preferRealData;
};

// Функция для условного выполнения API вызова с fallback на моки
export const withMockFallback = async <T>(
  apiCall: () => Promise<T>,
  mockData: T,
  preferRealData: boolean = false
): Promise<T> => {
  if (!shouldUseMocks(preferRealData)) {
    try {
      return await apiCall();
    } catch (error) {
      // Используем моки только в dev-режиме при ошибках
      if (isDevelopment) {
        console.warn('Falling back to mock data due to API error');
        return mockData;
      }
      throw error;
    }
  }
  
  return mockData;
};
```

### Переменные окружения (`.env.development`)

```
# Режим разработки
NODE_ENV=development

# URL API
VITE_API_URL=http://localhost:4000

# Включение/отключение мок-данных
# Установите в 'true' для включения моков, в 'false' для отключения
VITE_ENABLE_MOCKS=false
```

### Обновление сервиса закупок (`purchasesService.ts`)

Сервис закупок был обновлен для использования новой системы моков:

```typescript
import { withMockFallback } from '../api/mockConfig';
import { api } from '../api/axios';

// Пример использования с withMockFallback
getPurchases: async (filters: PurchaseFilter = {}) => {
  const queryParams = new URLSearchParams();
  
  // Добавляем параметры фильтрации...
  
  return withMockFallback(
    async () => {
      const response = await api.get<PurchasesResponse>(`${API_URL}?${queryParams.toString()}`);
      return response;
    },
    {
      data: {
        data: createMockPurchases(5),
        totalCount: 5,
        page: filters.page || 1,
        limit: filters.limit || 10,
        totalPages: 1
      }
    }
  );
}
```

## Преимущества нового подхода

1. **Контролируемое использование моков**:
   - Моки включаются/отключаются через переменную окружения
   - Моки используются только в режиме разработки (DEV)
   - Моки могут служить fallback при ошибках API

2. **Улучшенная разработка UI**:
   - Разработчики могут тестировать UI без зависимости от состояния API
   - Можно быстро переключаться между реальными и мок-данными

3. **Единообразие в коде**:
   - Единый подход к использованию моков во всем приложении
   - Четкое разделение режимов работы с данными

## Рекомендации по использованию

1. **Для разработки UI**:
   - Установите `VITE_ENABLE_MOCKS=true` в `.env.development`
   - Используйте моки только для первоначальной разработки UI

2. **Для тестирования интеграции**:
   - Установите `VITE_ENABLE_MOCKS=false` в `.env.development`
   - Убедитесь, что API доступно и работает корректно

3. **Для создания новых моков**:
   - Создайте функцию генерации моков в соответствующем сервисе
   - Используйте `withMockFallback` для условного вызова API

4. **Для продакшена**:
   - Моки никогда не используются в продакшен-режиме
   - В продакшене всегда используется только реальное API