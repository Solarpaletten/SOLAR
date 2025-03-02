require('dotenv').config({ path: '.env.test' });

const { PrismaClient } = require('../prisma/generated/test');
const prisma = new PrismaClient();

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
