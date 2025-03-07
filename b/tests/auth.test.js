const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('../prisma/generated/test');
const prisma = new PrismaClient();

jest.setTimeout(30000);

describe('Auth Endpoints', () => {
  beforeEach(async () => {
    // Очищаем таблицы в правильном порядке, чтобы учесть зависимости
    await prisma.$transaction([
      prisma.doc_settlementT.deleteMany({}),
      prisma.bank_operationsT.deleteMany({}),
      prisma.purchasesT.deleteMany({}),
      prisma.salesT.deleteMany({}),
      prisma.warehousesT.deleteMany({}),
      prisma.clientsT.deleteMany({}),
      prisma.productsT.deleteMany({}),
      prisma.chart_of_accountsT.deleteMany({}),
      prisma.usersT.deleteMany({}),
    ]);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should create a new user', async () => {
    const uniqueEmail = `test${Date.now()}@example.com`;
    const userData = {
      email: uniqueEmail,
      password: 'password123',
      username: 'testuser',
    };

    console.log('Registering user with:', userData);
    const res = await request(app).post('/api/auth/register').send(userData);
    console.log('Registration response:', res.status, res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', uniqueEmail);
    expect(res.body.user.role).toBe('USER');
  });

  it('should not create user with existing email', async () => {
    const uniqueEmail = `test${Date.now()}@example.com`;
    await request(app).post('/api/auth/register').send({
      email: uniqueEmail,
      password: 'password123',
      username: 'testuser',
    });

    const res = await request(app).post('/api/auth/register').send({
      email: uniqueEmail,
      password: 'password123',
      username: 'testuser2',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Email already registered');
  });

  describe('POST /api/auth/login', () => {
    let user;
    let testEmail;

    beforeEach(async () => {
      testEmail = `test${Date.now()}@example.com`;
      const registerRes = await request(app).post('/api/auth/register').send({
        email: testEmail,
        password: 'password123',
        username: 'testuser',
      });

      user = registerRes.body.user;
    });

    it('should login with correct credentials', async () => {
      const loginRes = await request(app).post('/api/auth/login').send({
        email: testEmail,
        password: 'password123',
      });

      expect(loginRes.statusCode).toBe(200);
      expect(loginRes.body).toHaveProperty('token');
    });

    it('should not login with wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testEmail,
        password: 'wrongpassword',
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Неверный пароль');
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    let forgotPasswordEmail;

    beforeEach(async () => {
      forgotPasswordEmail = `test${Date.now()}@example.com`;
      await request(app).post('/api/auth/register').send({
        email: forgotPasswordEmail,
        password: 'password123',
        username: 'testuser',
      });
    });

    it('should send reset password instructions', async () => {
      const res = await request(app).post('/api/auth/forgot-password').send({
        email: forgotPasswordEmail,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('should fail with invalid email', async () => {
      const res = await request(app).post('/api/auth/forgot-password').send({
        email: 'nonexistent@example.com',
      });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/reset-password', () => {
    let resetToken;
    let resetPasswordEmail;

    beforeEach(async () => {
      resetPasswordEmail = `test${Date.now()}@example.com`;
      // Создаем тестового пользователя
      await request(app).post('/api/auth/register').send({
        email: resetPasswordEmail,
        username: 'testuser',
        password: 'password123',
      });

      // Запрашиваем сброс пароля
      await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: resetPasswordEmail });

      // Получаем токен из базы
      const user = await prisma.usersT.findUnique({
        where: { email: resetPasswordEmail },
      });
      resetToken = user.reset_token;
    });

    it('should reset password with valid token', async () => {
      const res = await request(app).post('/api/auth/reset-password').send({
        token: resetToken,
        password: 'newpassword123',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Password reset successful');

      // Проверяем, что можем войти с новым паролем
      const loginRes = await request(app).post('/api/auth/login').send({
        email: resetPasswordEmail, // Используем динамический email
        password: 'newpassword123',
      });

      expect(loginRes.statusCode).toBe(200);
      expect(loginRes.body).toHaveProperty('token');
    });

    it('should fail with invalid token', async () => {
      const res = await request(app).post('/api/auth/reset-password').send({
        token: 'invalid-token',
        password: 'newpassword123',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid or expired reset token');
    });
  });
});
