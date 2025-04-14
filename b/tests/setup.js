require('dotenv').config({ path: '.env.test' });

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

beforeAll(async () => {
  console.log('Using mock database connection');
});

afterAll(async () => {
  console.log('Mock test complete');
});

module.exports = mockPrisma;
