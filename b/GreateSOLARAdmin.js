// Загружаем .env из backend-папки
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

(async function createAdmin() {
  try {
    const email = 'solar@solar.de';
    const username = 'SOLAR';
    const passwordHash = await bcrypt.hash('pass123', 10);

    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) {
      console.log('Admin already exists:', existing.id);
      return;
    }

    const admin = await prisma.users.create({
      data: {
        username,
        email,
        password_hash: passwordHash,
        role: 'ADMIN',
        email_verified: true,
      },
    });

    console.log('Admin created:', admin);
  } catch (e) {
    console.error('Error creating admin:', e?.message);
  } finally {
    await prisma.$disconnect();
  }
})();
