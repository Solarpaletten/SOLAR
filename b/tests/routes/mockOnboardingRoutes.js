// Мок-версия маршрутов onboardingRoutes для тестов
const express = require('express');
const { logger } = require('../../src/config/logger');
const auth = require('../../src/middleware/auth');

// Создаем мок-маршруты без зависимости от базы данных
const createMockRoutes = () => {
  const router = express.Router();
  
  // Упрощенная версия auth middleware для тестов
  const simpleAuth = (req, res, next) => {
    // Извлекаем токен из заголовка
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Добавляем фиктивного пользователя в req
    req.user = {
      id: 999,
      email: 'test@example.com',
      role: 'USER'
    };
    
    next();
  };
  
  // Мок-контроллер для создания компании
  const setupCompany = (req, res) => {
    const { companyCode, directorName, name } = req.body;
    
    // Проверка обязательных полей
    if (!companyCode || !directorName) {
      return res.status(400).json({
        error: 'Отсутствуют обязательные поля'
      });
    }
    
    // Проверка на дубликат компании (по имени)
    if (companyCode.includes('DUPLICATE')) {
      return res.status(409).json({
        error: 'Код компании уже используется. Пожалуйста, выберите другой код.',
        code: 'DUPLICATE_CODE'
      });
    }
    
    // Проверка на существующую компанию у пользователя
    if (req.body.checkExisting) {
      return res.status(400).json({
        error: 'Компания уже настроена для этого пользователя'
      });
    }
    
    // Успешный ответ
    res.status(201).json({
      message: 'Компания успешно настроена',
      company: {
        id: 999,
        code: companyCode,
        name: name || 'Test Company',
        director_name: directorName,
        user_id: req.user.id,
        is_active: true,
        setup_completed: true
      },
      client: {
        id: 999,
        name: name || 'Test Company',
        email: req.body.email || req.user.email,
        phone: req.body.phone || '+37012345678',
        code: companyCode,
        user_id: req.user.id
      }
    });
  };
  
  // Добавляем маршрут с упрощенным middleware
  router.post('/setup', 
    simpleAuth,
    (req, res, next) => {
      logger.info('Получен запрос на тестовый онбординг:', {
        body: req.body,
        headers: {
          authorization: req.headers.authorization ? '***' : 'отсутствует'
        }
      });
      next();
    },
    setupCompany
  );
  
  return router;
};

module.exports = createMockRoutes;