require('dotenv').config({ path: '.env.test' });

const { PrismaClient } = require('../prisma/generated/test/default');
const prisma = new PrismaClient();

beforeAll(async () => {
  console.log('Connecting to database...');
  await prisma.$connect();
});

afterAll(async () => {
  console.log('Disconnecting from database...');
  await prisma.$disconnect();
});

module.exports = prisma;
