// Создайте файл scripts/createTestClient.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestClient() {
  try {
    const testClient = await prisma.clients.create({
      data: {
        name: 'Test Client',
        email: 'test@example.com',
        code: 'TEST001',
        vat_code: 'VAT001',
        phone: '+1234567890',
        user_id: 1, // Убедитесь, что у вас есть пользователь с таким ID
        is_active: true,
      },
    });

    console.log('Test client created:', testClient);
  } catch (error) {
    console.error('Error creating test client:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestClient();
