// Создайте новый файл create-admin.js в директории b
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Используем готовый хеш пароля, который вы уже сгенерировали
    const passwordHash =
      '$2a$10$bS1MonzuJMwJy5UyD3wYs..0ofq/olEU8r7TUA.ncTImXUSq4iClG';

    const admin = await prisma.users.create({
      data: {
        email: 'dk@dk.de',
        password_hash: passwordHash,
        username: 'DASCHA',
        role: 'ADMIN',
        email_verified: true,
        status: 'ACTIVE',
      },
    });

    console.log('Администратор успешно создан:', admin.email);
  } catch (error) {
    console.error('Ошибка при создании администратора:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
