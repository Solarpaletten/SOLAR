require('dotenv').config({ path: '.env.test' });

// Важно: используем клиент, сгенерированный из schema_t.prisma
const { PrismaClient } = require('../prisma/generated/test');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TEST_VERCEL,
    },
  },
});

beforeAll(async () => {
  console.log('Connecting to database...');
  await prisma.$connect();

  // Очищаем тестовую базу данных перед тестами
  await prisma.usersT.deleteMany();
});

afterAll(async () => {
  console.log('Disconnecting from database...');
  await prisma.$disconnect();
});

module.exports = prisma;
