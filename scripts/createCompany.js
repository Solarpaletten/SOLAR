const { PrismaClient } = require('@prisma/client');

async function createCompany() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Создание тестовой компании...');
    
    // Находим админа
    const admin = await prisma.users.findUnique({
      where: { email: 'admin@solar.com' }
    });
    
    if (!admin) {
      console.log('❌ Админ не найден. Сначала создайте администратора.');
      return;
    }
    
    // Создаем компанию
    const company = await prisma.companies.create({
      data: {
        code: 'SOLAR',
        name: 'SOLAR Energy Ltd',
        director_name: 'Admin User',
        owner_id: admin.id,
        legal_entity_type: 'LLC',
        is_active: true,
        setup_completed: true
      }
    });
    
    console.log('✅ Компания создана успешно!');
    console.log('🏢 Название:', company.name);
    console.log('📋 Код:', company.code);
    console.log('👤 Владелец ID:', company.owner_id);
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('ℹ️ Компания уже существует');
    } else {
      console.log('❌ Ошибка:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createCompany();
