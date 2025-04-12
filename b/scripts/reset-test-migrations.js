/**
 * Скрипт для очистки проблемных миграций в тестовой базе данных
 * Используется в CI для обеспечения успешного запуска тестов
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.test' });

// Определяем имя миграции, которую нужно сбросить
const FAILED_MIGRATION = '20250412112641_add_onboarding_completed_to_users_t';

async function resetFailedMigration() {
  console.log('Начинаем сброс проблемной миграции:', FAILED_MIGRATION);

  try {
    // Подключаемся к тестовой базе данных напрямую
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL_TEST_VERCEL,
        },
      },
    });

    await prisma.$connect();
    console.log('Подключение к тестовой базе данных успешно');

    // Проверяем наличие таблицы _prisma_migrations
    const hasTable = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = '_prisma_migrations'
      );
    `;

    if (!hasTable[0].exists) {
      console.log('Таблица _prisma_migrations не найдена, пропускаем');
      await prisma.$disconnect();
      return;
    }

    // Проверяем наличие проблемной миграции
    const migrations = await prisma.$queryRaw`
      SELECT * FROM _prisma_migrations 
      WHERE migration_name = ${FAILED_MIGRATION};
    `;

    if (migrations.length === 0) {
      console.log('Проблемная миграция не найдена в базе данных, пропускаем');
      await prisma.$disconnect();
      return;
    }

    // Удаляем проблемную миграцию из таблицы _prisma_migrations
    await prisma.$executeRaw`
      DELETE FROM _prisma_migrations 
      WHERE migration_name = ${FAILED_MIGRATION};
    `;

    console.log('Проблемная миграция успешно удалена из истории миграций');
    await prisma.$disconnect();

  } catch (error) {
    console.error('Ошибка при сбросе миграции:', error);
    process.exit(1);
  }
}

resetFailedMigration()
  .then(() => {
    console.log('Сброс миграции завершен успешно');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Непредвиденная ошибка:', error);
    process.exit(1);
  });