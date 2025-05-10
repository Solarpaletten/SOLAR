# Документация по синхронизации API закупок

## Выполненные изменения

### 1. Создана утилита для преобразования данных между frontend и backend

Файл: `/b/src/utils/apiUtils.js`

Добавлены функции для:
- Преобразования ID из числового формата в строковый
- Конвертации имен полей из snake_case в camelCase и обратно
- Трансформации данных из формата БД в формат API и обратно

Это обеспечивает единообразие интерфейса API и снижает необходимость трансформации данных на стороне клиента.

### 2. Обновлен контроллер закупок с добавлением новых методов

Файл: `/b/src/controllers/purchasesController.js`

Добавлены новые методы:
- `updatePurchaseStatus` - обновление статуса закупки
- `exportPurchasesToCSV` - экспорт всех закупок в CSV
- `importPurchasesFromCSV` - импорт закупок из CSV
- `getSuppliersList` - получение списка поставщиков

Улучшения в существующих методах:
- Добавлена пагинация и расширенная фильтрация в `getAllPurchases`
- Внедрено преобразование данных в API формат во всех методах
- Добавлены детальные ответы с дополнительной метаинформацией

### 3. Обновлены маршруты API для поддержки новых методов

Файл: `/b/src/routes/purchasesRoutes.js`

Добавлены маршруты:
- `PATCH /api/purchases/:id/status` - обновление статуса
- `GET /api/purchases/export` - экспорт в CSV
- `POST /api/purchases/import` - импорт из CSV
- `GET /api/purchases/suppliers` - список поставщиков

### 4. Доработан frontend сервис для управления мок-данными

Файлы:
- `/f/src/api/mockConfig.ts` (новый)
- `/f/src/services/purchasesService.ts` (обновленный)
- `/f/.env.development` (новый)

Изменения:
- Создана гибкая система управления мок-данными через переменные окружения
- Мок-данные теперь активируются только при необходимости (dev-режим и ошибки API)
- Добавлена функция `withMockFallback` для условного использования моков

## Техническая реализация

### Преобразование ID и форматов данных

Все ID преобразуются в строковый формат перед отправкой клиенту:

```javascript
// Преобразование ID в строку
const convertIdToString = (item) => {
  if (!item) return null;
  
  const result = { ...item };
  if (result.id !== undefined) {
    result.id = String(result.id);
  }
  return result;
};
```

Поля в ответах API преобразуются из snake_case в camelCase:

```javascript
// Преобразование из snake_case в camelCase
const convertToCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;

  const result = {};
  Object.entries(obj).forEach(([key, value]) => {
    let camelKey = snakeToCamel(key);
    
    // Рекурсивная обработка вложенных объектов
    if (value !== null && typeof value === 'object') {
      // ...
    } else {
      result[camelKey] = value;
    }
  });

  return result;
};
```

### Управление мок-данными на frontend

Реализован механизм контролируемого использования моков:

```typescript
// Функция определения необходимости использования моков
export const shouldUseMocks = (preferRealData: boolean = false): boolean => {
  return ENABLE_MOCKS && isDevelopment && !preferRealData;
};

// Функция с fallback на моки при ошибках API
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

## Рекомендации по использованию

### Для backend-разработчиков

1. Используйте функции `transformToApiFormat` и `transformToDbFormat` при работе с данными API:
   ```javascript
   // Преобразование в API формат перед отправкой ответа
   const apiData = transformToApiFormat(purchase);
   res.json(apiData);
   
   // Преобразование в формат БД при получении данных от клиента
   const dbData = transformToDbFormat(req.body);
   ```

2. Все новые методы API должны следовать шаблону преобразования данных.

### Для frontend-разработчиков

1. Использование мок-данных контролируется через `.env.development`:
   ```
   # Установите VITE_ENABLE_MOCKS=true для включения моков
   VITE_ENABLE_MOCKS=false
   ```

2. Для добавления условного использования моков в новые сервисы:
   ```typescript
   import { withMockFallback } from '../api/mockConfig';
   
   // Пример использования
   return withMockFallback(
     async () => {
       const response = await api.get('/some-endpoint');
       return response.data;
     },
     mockData
   );
   ```

3. Используйте моки только для разработки UI, а не для замены реального API.

## Тестирование

Рекомендуется провести тестирование следующих аспектов:

1. ID всегда приходят в строковом формате
2. Поля в ответах API используют camelCase
3. Все добавленные методы API работают корректно
4. Моки используются только при включенной опции или при ошибках API в dev-режиме
5. Пагинация и фильтрация в API возвращают корректные результаты

## Примеры использования новых методов API

### Обновление статуса закупки
```javascript
// Frontend
const result = await purchasesService.updatePurchaseStatus('123', 'completed');

// Backend (curl)
curl -X PATCH -H "Content-Type: application/json" -d '{"status":"completed"}' /api/purchases/123/status
```

### Экспорт закупок в CSV
```javascript
// Frontend
const csvBlob = await purchasesService.exportPurchasesToCSV();
const url = URL.createObjectURL(csvBlob);
const a = document.createElement('a');
a.href = url;
a.download = 'purchases.csv';
a.click();

// Backend (curl)
curl -X GET /api/purchases/export > purchases.csv
```

### Получение списка поставщиков
```javascript
// Frontend
const suppliers = await purchasesService.getSuppliersList();

// Backend (curl)
curl -X GET /api/purchases/suppliers
```