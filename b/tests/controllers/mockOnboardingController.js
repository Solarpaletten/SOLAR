// Мок-версия контроллера onboardingController для тестов
const { logger } = require('../../src/config/logger');

// Создаем контроллер с использованием тестового Prisma клиента (usersT, companiesT)
const createMockController = (prisma) => {
  const setupCompany = async (req, res) => {
    try {
      const { companyCode, directorName } = req.body;
      const userId = req.user.id;
      
      logger.info('Настройка компании через тестовый онбординг', {
        userId,
        companyCode
      });
      
      // Проверяем уникальность кода компании
      console.log('Проверка уникальности кода компании:', companyCode);
      const existingCompanyByCode = await prisma.companiesT.findFirst({
        where: { code: companyCode }
      });
      
      if (existingCompanyByCode) {
        console.log('Найдена существующая компания с таким кодом:', existingCompanyByCode);
        return res.status(409).json({ 
          error: 'Код компании уже используется. Пожалуйста, выберите другой код.',
          code: 'DUPLICATE_CODE'
        });
      }
      
      // Проверяем, существует ли уже компания для этого пользователя
      const existingCompany = await prisma.companiesT.findFirst({
        where: { user_id: userId }
      });
      
      if (existingCompany) {
        return res.status(400).json({ 
          error: 'Компания уже настроена для этого пользователя'
        });
      }
      
      // Создаем транзакцию для одновременного создания компании и клиента
      const result = await prisma.$transaction(async (tx) => {
        // Создаем запись "собственной компании" как клиента
        const client = await tx.clientsT.create({
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
        const company = await tx.companiesT.create({
          data: {
            code: companyCode,
            name: req.body.name || 'My Company',
            director_name: directorName,
            user_id: userId,
            is_active: true,
            setup_completed: true
          }
        });
        
        // Обновляем статус пользователя
        try {
          await tx.usersT.update({
            where: { id: userId },
            data: {
              onboarding_completed: true
            }
          });
          console.log('Successfully updated user onboarding status in transaction');
        } catch (error) {
          console.error('Failed to update user onboarding status in transaction:', error);
          // Продолжаем даже если не смогли обновить статус
        }
        
        return { company, client };
      });
      
      res.status(201).json({
        message: 'Компания успешно настроена',
        company: result.company,
        client: result.client
      });
    } catch (error) {
      logger.error('Ошибка при настройке компании в тестах:', error);
      
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

  return {
    setupCompany
  };
};

module.exports = createMockController;