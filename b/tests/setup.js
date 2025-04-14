require('dotenv').config({ path: '.env.test' });

// Мокаем index.js, чтобы предотвратить запуск сервера
jest.mock('../src/index.js', () => ({
  webSocketService: () => ({}),
  getWebSocketService: () => ({})
}), { virtual: true });

// Мокаем Prisma клиент для тестов
const mockPrisma = {
  $connect: async () => Promise.resolve(),
  $disconnect: async () => Promise.resolve(),
  
  // Для совместимости со старым кодом
  usersT: {
    deleteMany: async () => Promise.resolve({ count: 0 }),
    delete: async () => Promise.resolve({ id: 999 }),
    findUnique: async () => Promise.resolve({ id: 999, email: 'test@example.com' }),
    create: async (data) => Promise.resolve({ id: 999, ...data.data }),
  },
};

// Важно: предотвращаем запуск сервера при импорте
beforeAll(async () => {
  console.log('Using mock database connection');
  // Убедимся, что мы не запускаем реальный сервер
  jest.mock('../src/index.js');
});

afterAll(async () => {
  console.log('Mock test complete');
  jest.resetModules();
});

module.exports = mockPrisma;
