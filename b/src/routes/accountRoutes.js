// b/src/routes/accountRoutes.js
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const accountContextController = require('../controllers/accountContextController');
const auth = require('../middleware/auth');
const { logger } = require('../config/logger');

// Добавим отладку
logger.info('Account routes initialized');

// ===========================================
// 🏢 ACCOUNT LEVEL ROUTES (Управление компаниями)
// ===========================================

// Получить все компании пользователя
router.get('/companies', auth, accountController.getAllCompanies);

// Создать новую компанию
router.post('/companies', auth, accountController.createCompany);

// Получить системную аналитику
router.get('/analytics', auth, accountController.getSystemAnalytics);

// ===========================================
// 🔄 CONTEXT SWITCHING ROUTES (Переключение уровней)
// ===========================================

// Переключиться на компанию (Account → Company Level)
router.post('/switch-to-company', auth, accountContextController.switchToCompany);

// Получить доступные компании
router.get('/available-companies', auth, accountContextController.getAvailableCompanies);

// ===========================================
// 🧪 TEST ROUTES (Тестирование)
// ===========================================

// Тестовый роут для проверки Account Level
router.get('/test', auth, (req, res) => {
  res.json({
    message: 'Account Level API working!',
    level: 'account',
    user: {
      id: req.user.id,
      email: req.user.email
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
