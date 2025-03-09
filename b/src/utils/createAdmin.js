// Создайте новый файл create-admin.js в директории b
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Используем готовый хеш пароля, который вы уже сгенерировали
    const passwordHash =
      '$2a$10$tMioLI7bQcKFHPVxLi2la.p6AcJcgz8bIbImpxz6DiZ3GiE7opH82';

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
