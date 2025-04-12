const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../../src/app');
const prisma = require('../setup');
const jwt = require('jsonwebtoken');

describe('Companies API', () => {
  let testUser;
  let authToken;

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
    // Очищаем созданные данные
    await prisma.companiesT.deleteMany({
      where: { user_id: testUser.id }
    });
    await prisma.clientsT.deleteMany({
      where: { user_id: testUser.id }
    });
    await prisma.usersT.delete({
      where: { id: testUser.id }
    });
  });

  describe('POST /api/onboarding/setup', () => {
    it('should create a new company during onboarding', async () => {
      const companyData = {
        companyCode: 'TEST' + Date.now(),
        name: 'Test Company',
        directorName: 'Test Director',
        email: 'test@company.com',
        phone: '+37012345678'
      };

      const response = await request(app)
        .post('/api/onboarding/setup')
        .set('Authorization', `Bearer ${authToken}`)
        .send(companyData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Компания успешно настроена');
      expect(response.body).toHaveProperty('company');
      expect(response.body).toHaveProperty('client');
      
      // Проверяем данные созданной компании
      expect(response.body.company).toHaveProperty('code', companyData.companyCode);
      expect(response.body.company).toHaveProperty('name', companyData.name);
      expect(response.body.company).toHaveProperty('director_name', companyData.directorName);
      expect(response.body.company).toHaveProperty('user_id', testUser.id);
      
      // Проверяем, что статус пользователя обновлен
      const updatedUser = await prisma.usersT.findUnique({
        where: { id: testUser.id }
      });
      expect(updatedUser.onboarding_completed).toBe(true);
    });

    it('should not allow creating second company for the same user', async () => {
      const companyData = {
        companyCode: 'TEST_DUPLICATE' + Date.now(),
        name: 'Duplicate Company',
        directorName: 'Another Director',
        email: 'another@company.com',
        phone: '+37012345677'
      };

      const response = await request(app)
        .post('/api/onboarding/setup')
        .set('Authorization', `Bearer ${authToken}`)
        .send(companyData);

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

      // Получаем код существующей компании
      const existingCompany = await prisma.companiesT.findFirst({
        where: { user_id: testUser.id }
      });

      // Пытаемся создать компанию с тем же кодом
      const response = await request(app)
        .post('/api/onboarding/setup')
        .set('Authorization', `Bearer ${newToken}`)
        .send({
          companyCode: existingCompany.code,
          directorName: 'Duplicate Director',
          name: 'Duplicate Company'
        });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('code', 'DUPLICATE_CODE');
      
      // Очищаем созданные данные
      await prisma.usersT.delete({
        where: { id: newUser.id }
      });
    });
  });
});