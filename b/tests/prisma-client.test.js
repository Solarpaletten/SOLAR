/**
 * Тест для проверки корректной работы Prisma-клиента в тестовой среде
 */
const prisma = require('./setup');

describe('Prisma Client Test Schema', () => {
  it('should connect to test database', async () => {
    expect(prisma).toBeDefined();
    // Проверка соединения
    const connected = await prisma.$connect();
    expect(connected).toBeUndefined(); // Успешное соединение не возвращает ошибку
  });

  it('should have usersT model', async () => {
    // Проверка доступности модели usersT
    const userCount = await prisma.usersT.count();
    expect(typeof userCount).toBe('number');
  });

  it('should have companiesT model', async () => {
    // Проверка доступности модели companiesT
    const companyCount = await prisma.companiesT.count();
    expect(typeof companyCount).toBe('number');
  });

  it('should create and delete a test user', async () => {
    // Создание тестового пользователя
    const testUser = await prisma.usersT.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        username: 'testuser',
        password_hash: 'password123',
        role: 'USER',
        email_verified: true
      }
    });

    expect(testUser).toBeDefined();
    expect(testUser.id).toBeDefined();

    // Удаление созданного пользователя
    const deleted = await prisma.usersT.delete({
      where: { id: testUser.id }
    });

    expect(deleted.id).toBe(testUser.id);
  });
});