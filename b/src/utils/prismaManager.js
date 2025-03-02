const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  prisma,
  connect: async () => {
    // Для более новых версий Prisma
    await prisma.$connect();
    return prisma;
  },
};
