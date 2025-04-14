const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../mockApp'); // Используем мок-приложение для тестов
const prisma = require('../setup');
const jwt = require('jsonwebtoken');

describe('Companies API', () => {
  let testUser;
  let authToken;
  let createdCompanies = [];

  beforeAll(async () => {
    // Создаем тестового пользователя для использования в тестах
    const passwordHash = await bcrypt.hash('testpassword', 10);
    testUser = await prisma.usersT.create({
      data: {
        email: 'company-test@example.com',
        username: 'companytest',
        password_hash: passwordHash,
        role: 'USER',
        email_verified: true
        // Убрано onboarding_completed, так как оно может отсутствовать в тестовой базе
      }
    });

    // Создаем токен для авторизации
    authToken = jwt.sign(
      { id: testUser.id, email: testUser.email, role: testUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    try {
      // Очищаем созданные данные
      if (testUser?.id) {
        try {
          await prisma.usersT.delete({
            where: { id: testUser.id }
          });
        } catch (error) {
          console.log('User cleanup error, may be already deleted:', error.message);
        }
      }
    } catch (error) {
      console.error('Error cleaning up test data:', error);
    }
  });

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
      // Пользователь уже имеет компанию из предыдущего теста
      const uniqueCode = 'TEST_DUPLICATE' + Date.now();
      const companyData = {
        companyCode: uniqueCode,
        name: 'Duplicate Company',
        directorName: 'Another Director',
        email: 'another@company.com',
        phone: '+37012345677'
      };

      // Делаем запрос через API для проверки ошибки
      const response = await request(app)
        .post('/api/onboarding/setup')
        .set('Authorization', `Bearer ${authToken}`)
        .send(companyData);

      // Проверяем ответ - должен быть 400, компания уже существует
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Компания уже настроена для этого пользователя');
    });

    it('should return 400 for missing required fields', async () => {
      // Создаем нового пользователя для этого теста
      const passwordHash = await bcrypt.hash('testpassword2', 10);
      const newUser = await prisma.usersT.create({
        data: {
          email: 'missing-fields@example.com',
          username: 'missingfields',
          password_hash: passwordHash,
          role: 'USER',
          email_verified: true
        }
      });

      const newToken = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Отправляем запрос с отсутствующими обязательными полями
      const response = await request(app)
        .post('/api/onboarding/setup')
        .set('Authorization', `Bearer ${newToken}`)
        .send({
          // Отсутствует companyCode и directorName
          name: 'Incomplete Company'
        });

      expect(response.status).toBe(400);
      
      // Очищаем созданные данные
      await prisma.usersT.delete({
        where: { id: newUser.id }
      });
    });

    it('should handle duplicate company code error', async () => {
      // Создаем нового пользователя для этого теста
      const passwordHash = await bcrypt.hash('testpassword3', 10);
      const newUser = await prisma.usersT.create({
        data: {
          email: 'duplicate-code@example.com',
          username: 'duplicatecode',
          password_hash: passwordHash,
          role: 'USER',
          email_verified: true
        }
      });

      const newToken = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Создаем тестовую компанию с предсказуемым кодом
      const uniqueCode = 'TESTDUP' + Date.now();
      createdCompanies.push(uniqueCode); // Сохраняем для очистки
      
      await prisma.companiesT.create({
        data: {
          code: uniqueCode,
          name: 'Test Company For Duplicate Test',
          director_name: 'Original Director',
          user_id: testUser.id,
          is_active: true,
          setup_completed: true
        }
      });

      console.log('Created test company with code:', uniqueCode);

      // Пытаемся создать компанию через mock API с тем же кодом
      const response = await request(app)
        .post('/api/onboarding/setup')
        .set('Authorization', `Bearer ${newToken}`)
        .send({
          companyCode: uniqueCode,
          directorName: 'Duplicate Director',
          name: 'Duplicate Company'
        });

      console.log('Duplicate company response:', response.status, response.body);

      // В нашем mocked onboardingController должен быть статус 409
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('code', 'DUPLICATE_CODE');
      
      try {
        // Очищаем созданные данные
        await prisma.usersT.delete({
          where: { id: newUser.id }
        });
      } catch (error) {
        console.error('Error cleaning up user:', error);
      }
    });
  });
});