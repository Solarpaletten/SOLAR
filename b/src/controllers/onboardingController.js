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
    res.status(500).json({ error: 'Не удалось настроить компанию' });
  }
};

// Экспортируем модуль
module.exports = {
  setupCompany: exports.setupCompany
};