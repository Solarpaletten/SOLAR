const { PrismaClient } = require('@prisma/client');
const prismaManager = require('./create/prismaManager');

async function createUser() {
  try {
    const newUser = await prismaManager.prisma.users.create({
      data: {
        email: 'sl@sl.de',
        password_hash:
          '$2a$10$TaMAp53.tUaXDilnIYO6SOXhTXqI2lkZfJUMvhkhX08HrJLkQQJXe',
        username: 'solar',
        role: 'ADMIN',
        email_verified: true,
        status: 'ACTIVE',
      },
    });

    console.log('Создан новый пользователь:', newUser);
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
  } finally {
    await prismaManager.prisma.$disconnect(); // исправлено с prisma на prismaManager.prisma
  }
}

createUser();
