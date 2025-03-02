const { PrismaClient } = require('./prisma/generated/test');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = 'sl@sl.de';
    const password = 'admin123';
    const username = 'solarde';

    // Проверяем, существует ли пользователь с таким email
    const existingUser = await prisma.usersT.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('Admin already exists:', existingUser);
      return;
    }

    // Хешируем пароль
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Создаём администратора
    const admin = await prisma.usersT.create({
      data: {
        email,
        username,
        password_hash: passwordHash,
        role: 'ADMIN',
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    console.log('Admin created successfully:', admin);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
