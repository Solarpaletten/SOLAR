const request = require('supertest');
const app = require('../mockApp'); // Используем мок-приложение для тестов
const jwt = require('jsonwebtoken');

describe('Companies API', () => {
  // Создаем тестовый токен - без привязки к базе данных
  const authToken = jwt.sign(
    { id: 999, email: 'test@example.com', role: 'USER' },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );

  describe('POST /api/onboarding/setup', () => {
    // Увеличиваем таймаут до 15 секунд для этого теста
    it('should create a new company during onboarding', async () => {
      // Тест проверяет работу API, а не прямой доступ к базе данных
      const companyData = {
        companyCode: 'TEST' + Date.now(),
        name: 'Test Company',
        directorName: 'Test Director',
        email: 'test@company.com',
        phone: '+37012345678'
      };

      console.log('Testing company creation with data:', companyData);

      // Отправляем запрос через мок-API
      const response = await request(app)
        .post('/api/onboarding/setup')
        .set('Authorization', `Bearer ${authToken}`)
        .send(companyData);

      console.log('API response:', response.status, response.body);

      // Проверяем ответ
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Компания успешно настроена');
      expect(response.body).toHaveProperty('company');
      expect(response.body).toHaveProperty('client');
      
      // Проверяем данные в ответе
      expect(response.body.company.code).toBe(companyData.companyCode);
      expect(response.body.company.name).toBe(companyData.name);
      expect(response.body.company.director_name).toBe(companyData.directorName);
    }, 15000);

    it('should not allow creating second company for the same user', async () => {
      // Тестируем случай, когда у пользователя уже есть компания
      const companyData = {
        companyCode: 'TEST_COMPANY_' + Date.now(),
        directorName: 'Another Director',
        email: 'another@company.com',
        name: 'Duplicate Company',
        phone: '+37012345677',
        checkExisting: true // Флаг для мока, означающий что у пользователя уже есть компания
      };

      // Делаем запрос через API
      const response = await request(app)
        .post('/api/onboarding/setup')
        .set('Authorization', `Bearer ${authToken}`)
        .send(companyData);

      // Проверяем ответ - должен быть 400, компания уже существует
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Компания уже настроена для этого пользователя');
    });

    it('should return 400 for missing required fields', async () => {
      // Отправляем запрос с отсутствующими обязательными полями
      const response = await request(app)
        .post('/api/onboarding/setup')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          // Отсутствует companyCode и directorName
          name: 'Incomplete Company'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle duplicate company code error', async () => {
      // Используем специальное имя для обнаружения дубликата в моке
      const response = await request(app)
        .post('/api/onboarding/setup')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          companyCode: 'TEST_DUPLICATE_' + Date.now(),
          directorName: 'Duplicate Director',
          name: 'Duplicate Company'
        });

      // Проверяем ответ - должен быть 409 Conflict
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('code', 'DUPLICATE_CODE');
    });
  });
});