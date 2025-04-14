// Мок-версия контроллера onboardingController для тестов
const { logger } = require('../../src/config/logger');

// Создаем мок-контроллер для тестов
const createMockController = (prisma) => {
  const setupCompany = async (req, res) => {
    try {
      const { companyCode, directorName } = req.body;
      const userId = req.user.id;
      
      logger.info('Настройка компании через тестовый онбординг', {
        userId,
        companyCode
      });
      
      // Проверка наличия обязательных полей
      if (!companyCode || !directorName) {
        return res.status(400).json({
          error: 'Отсутствуют обязательные поля',
          details: 'Код компании и имя директора обязательны'
        });
      }
      
      // Мокаем проверку на дубликат компании
      if (companyCode.includes('DUPLICATE')) {
        return res.status(409).json({ 
          error: 'Код компании уже используется. Пожалуйста, выберите другой код.',
          code: 'DUPLICATE_CODE'
        });
      }
      
      // Мокаем проверку на существующую компанию у пользователя
      if (req.user.id === 127) { // Тестовый ID из предыдущего теста
        return res.status(400).json({ 
          error: 'Компания уже настроена для этого пользователя'
        });
      }
      
      // Mock успешного ответа
      res.status(201).json({
        message: 'Компания успешно настроена',
        company: {
          id: 999,
          code: companyCode,
          name: req.body.name || 'Test Company',
          director_name: directorName,
          user_id: userId,
          is_active: true,
          setup_completed: true
        },
        client: {
          id: 999,
          name: req.body.name || 'Test Company', 
          email: req.body.email || req.user.email,
          phone: req.body.phone || '+37012345678',
          code: companyCode,
          user_id: userId
        }
      });
    } catch (error) {
      logger.error('Ошибка при настройке компании в тестах:', error);
      res.status(500).json({ error: 'Не удалось настроить компанию', details: error.message });
    }
  };

  return {
    setupCompany
  };
};

module.exports = createMockController;