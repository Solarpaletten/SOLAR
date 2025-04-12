# API для работы с компаниями

## Общая информация

API для работы с компаниями позволяет создавать, обновлять, получать и управлять компаниями в системе SOLAR. Все запросы, кроме специально указанных, требуют авторизации с использованием JWT-токена.

- Базовый URL API: `/api`
- Аутентификация: Bearer Token (JWT) в заголовке `Authorization`
- Формат данных: JSON
- Коды ответов:
  - 200 OK: Успешный запрос
  - 201 Created: Успешное создание ресурса
  - 400 Bad Request: Ошибка в запросе (неверные параметры)
  - 401 Unauthorized: Отсутствие или недействительность токена аутентификации
  - 403 Forbidden: Доступ запрещен (недостаточно прав)
  - 404 Not Found: Ресурс не найден
  - 409 Conflict: Конфликт (например, при попытке создать компанию с уже существующим кодом)
  - 500 Internal Server Error: Внутренняя ошибка сервера

## Конечные точки API

### 1. Установка компании (Онбординг)

Создает новую компанию и связывает ее с текущим пользователем. Также создает клиента с теми же данными.

**Запрос:**

```http
POST /api/onboarding/setup
Authorization: Bearer {token}
Content-Type: application/json

{
  "companyCode": "ABC123",
  "name": "My Company Name",
  "directorName": "John Doe",
  "email": "company@example.com",
  "phone": "+37012345678"
}
```

**Обязательные поля:**
- `companyCode`: Уникальный код компании (3-50 символов, буквы, цифры, дефис, подчеркивание)
- `directorName`: Имя директора (2-100 символов)

**Опциональные поля:**
- `name`: Название компании (2-100 символов)
- `email`: Email компании (валидный email)
- `phone`: Телефон компании (7-20 символов)

**Успешный ответ:**

```json
{
  "message": "Компания успешно настроена",
  "company": {
    "id": 1,
    "code": "ABC123",
    "name": "My Company Name",
    "director_name": "John Doe",
    "user_id": 123,
    "is_active": true,
    "setup_completed": true,
    "created_at": "2025-04-12T10:20:30.000Z",
    "updated_at": "2025-04-12T10:20:30.000Z"
  },
  "client": {
    "id": 1,
    "name": "My Company Name",
    "email": "company@example.com",
    "phone": "+37012345678",
    "role": "CLIENT",
    "is_active": true,
    "code": "ABC123",
    "user_id": 123,
    "created_at": "2025-04-12T10:20:30.000Z",
    "updated_at": "2025-04-12T10:20:30.000Z"
  }
}
```

**Ответ с ошибкой (дубликат кода компании):**

```json
{
  "error": "Код компании уже используется. Пожалуйста, выберите другой код.",
  "code": "DUPLICATE_CODE"
}
```

**Ответ с ошибкой (компания уже существует для пользователя):**

```json
{
  "error": "Компания уже настроена для этого пользователя"
}
```

**Ответ с ошибкой (ошибка валидации):**

```json
{
  "error": "Ошибка валидации данных",
  "details": [
    {
      "value": "",
      "msg": "Код компании обязателен",
      "param": "companyCode",
      "location": "body"
    }
  ]
}
```

### 2. Выбор активной компании пользователя

Выбирает активную компанию пользователя и обновляет информацию в токене.

**Запрос:**

```http
POST /api/auth/companies/{companyId}/select
Authorization: Bearer {token}
```

**Параметры URL:**
- `companyId`: ID компании для выбора

**Успешный ответ:**

```json
{
  "message": "Компания успешно выбрана",
  "token": "новый.jwt.токен",
  "company": {
    "id": 1,
    "code": "ABC123",
    "name": "My Company Name",
    "director_name": "John Doe"
  }
}
```

**Ответ с ошибкой (компания не найдена):**

```json
{
  "error": "Компания не найдена"
}
```

**Ответ с ошибкой (нет доступа к компании):**

```json
{
  "error": "У вас нет доступа к этой компании"
}
```

### 3. Получение списка компаний пользователя

Возвращает список компаний текущего пользователя.

**Запрос:**

```http
GET /api/clients/companies
Authorization: Bearer {token}
```

**Успешный ответ:**

```json
[
  {
    "id": 1,
    "code": "ABC123",
    "name": "My Company Name",
    "director_name": "John Doe",
    "is_active": true,
    "setup_completed": true,
    "created_at": "2025-04-12T10:20:30.000Z",
    "updated_at": "2025-04-12T10:20:30.000Z"
  },
  {
    "id": 2,
    "code": "XYZ456",
    "name": "Another Company",
    "director_name": "Jane Smith",
    "is_active": true,
    "setup_completed": true,
    "created_at": "2025-04-13T10:20:30.000Z",
    "updated_at": "2025-04-13T10:20:30.000Z"
  }
]
```

## Структура данных модели Company

| Поле           | Тип     | Описание                                       | Обязательное |
|----------------|---------|------------------------------------------------|-------------|
| id             | Integer | Уникальный идентификатор                       | Да          |
| code           | String  | Уникальный код компании                        | Да          |
| name           | String  | Название компании                              | Да          |
| director_name  | String  | Имя директора                                  | Да          |
| user_id        | Integer | ID пользователя, которому принадлежит компания | Да          |
| is_active      | Boolean | Активна ли компания                            | Да          |
| setup_completed| Boolean | Завершена ли настройка компании               | Да          |
| created_at     | DateTime| Время создания записи                          | Да          |
| updated_at     | DateTime| Время последнего обновления записи             | Да          |

## Обработка ошибок

### Коды ошибок Prisma

| Код ошибки | Описание                                           |
|------------|---------------------------------------------------|
| P2002      | Нарушение уникальности (например, код компании)   |
| P2025      | Запись не найдена                                 |
| P2003      | Нарушение ограничения внешнего ключа              |

### Общие ошибки

Ошибки валидации возвращаются с кодом 400 и содержат массив `details` с подробностями об ошибке. Структура ошибки валидации:

```json
{
  "error": "Ошибка валидации данных",
  "details": [
    {
      "value": "переданное значение",
      "msg": "сообщение об ошибке",
      "param": "имя параметра",
      "location": "body"
    }
  ]
}
```

Ошибки авторизации возвращаются с кодом 401 и имеют структуру:

```json
{
  "error": "Токен авторизации отсутствует или недействителен"
}
```

Ошибки доступа возвращаются с кодом 403 и имеют структуру:

```json
{
  "error": "Недостаточно прав для выполнения операции"
}
```

## Примеры использования

### Пример создания компании при онбординге

```javascript
// Пример использования с fetch API
const createCompany = async () => {
  try {
    const response = await fetch('/api/onboarding/setup', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        companyCode: 'MYCOMP',
        name: 'My Amazing Company',
        directorName: 'John Doe',
        email: 'info@mycompany.com',
        phone: '+37012345678'
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Неизвестная ошибка');
    }
    
    console.log('Компания создана:', data);
    return data;
  } catch (error) {
    console.error('Ошибка при создании компании:', error);
    throw error;
  }
};
```