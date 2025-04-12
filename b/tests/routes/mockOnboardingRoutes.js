// Мок-версия маршрутов onboardingRoutes для тестов
const express = require('express');
const createMockController = require('../controllers/mockOnboardingController');
const { logger } = require('../../src/config/logger');
const auth = require('../../src/middleware/auth');
const { companyValidators } = require('../../src/middleware/validators');

// Создаем мок-маршруты с использованием тестового Prisma клиента
const createMockRoutes = (prisma) => {
  const router = express.Router();
  const mockController = createMockController(prisma);
  
  // Добавляем маршрут setup с таким же middleware как в основном приложении
  router.post('/setup', 
    auth, 
    (req, res, next) => {
      logger.info('Получен запрос на тестовый онбординг:', {
        body: req.body,
        headers: {
          authorization: req.headers.authorization ? 'Bearer ***' : 'отсутствует'
        }
      });
      next();
    },
    companyValidators.setupCompany,
    mockController.setupCompany
  );
  
  return router;
};

module.exports = createMockRoutes;