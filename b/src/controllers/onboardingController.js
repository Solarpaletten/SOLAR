// controllers/onboardingController.js
const prismaManager = require('../utils/prismaManager');
const { logger } = require('../config/logger');

exports.setupCompany = async (req, res) => {
  try {
    const { companyCode, directorName } = req.body;
    const userId = req.user.id;
    
    logger.info('Настройка компании через онбординг', {
      userId,
      companyCode
    });
    
    // Проверяем, существует ли уже компания для этого пользователя
    const existingCompany = await prismaManager.prisma.companies.findFirst({
      where: { user_id: userId }
    });
    
    if (existingCompany) {
      return res.status(400).json({ 
        error: 'Компания уже настроена для этого пользователя'
      });
    }
    
    // Создаем транзакцию для одновременного создания компании и клиента
    const result = await prismaManager.prisma.$transaction(async (prisma) => {
      // Создаем запись "собственной компании" как клиента
      const client = await prisma.clients.create({
        data: {
          name: req.body.name || 'My Company',
          email: req.body.email || req.user.email,
          phone: req.body.phone,
          role: 'CLIENT',
          code: companyCode,
          user_id: userId,
          is_active: true,
        }
      });
      
      // Создаем компанию
      const company = await prisma.companies.create({
        data: {
          code: companyCode,
          name: req.body.name || 'My Company', // Используем имя из запроса или дефолтное значение
          director_name: directorName,
          user_id: userId,
          is_active: true,
          setup_completed: true
        }
      });
      
      // Обновляем статус пользователя
      await prisma.users.update({
        where: { id: userId },
        data: {
          onboarding_completed: true
        }
      });
      
      return { company, client };
    });
    
    res.status(201).json({
      message: 'Компания успешно настроена',
      company: result.company,
      client: result.client
    });
  } catch (error) {
    logger.error('Ошибка при настройке компании:', error);
    
    // Проверяем, является ли ошибка нарушением уникальности
    if (error.code === 'P2002' && error.meta?.target?.includes('code')) {
      return res.status(409).json({ 
        error: 'Код компании уже используется. Пожалуйста, выберите другой код.',
        code: 'DUPLICATE_CODE'
      });
    }
    
    // Другие специфические ошибки Prisma
    if (error.code?.startsWith('P')) {
      return res.status(400).json({ 
        error: `Ошибка базы данных: ${error.message}`,
        code: error.code
      });
    }
    
    res.status(500).json({ error: 'Не удалось настроить компанию', details: error.message });
  }
};

// Экспортируем модуль
module.exports = {
  setupCompany: exports.setupCompany
};