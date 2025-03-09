const { PrismaClient } = require('@prisma/client');
const prismaManager = require('./create/prismaManager');

async function createUser() {
  try {
    const newUser = await prismaManager.prisma.users.create({
      data: {
        email: 'dk@dk.de',
        password_hash:
          '$2a$10$E/uQLngYlJuzwXECSnNNbOH1HZqhMOqHs5f9Rj6dlBhD6NAPiq8Zm',
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
