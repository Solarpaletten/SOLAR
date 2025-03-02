const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('pass123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'solar@solar.de',
        password: hashedPassword,
        role: 'ADMIN', // Убедитесь, что это поле есть в вашей схеме
      },
    });
    console.log('Администратор создан:', admin);
  } catch (error) {
    console.error('Ошибка при создании администратора:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
