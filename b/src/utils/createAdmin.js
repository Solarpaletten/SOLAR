// Создайте новый файл create-admin.js в директории b
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Используем готовый хеш пароля, который вы уже сгенерировали
    const passwordHash =
      '$2a$10$TaMAp53.tUaXDilnIYO6SOXhTXqI2lkZfJUMvhkhX08HrJLkQQJXe';

    const admin = await prisma.users.create({
      data: {
        email: 'sl@sl.de',
        password_hash: passwordHash,
        username: 'solar',
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
