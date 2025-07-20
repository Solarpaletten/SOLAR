const express = require('express');
const router = express.Router();
const mockAuthController = require('../controllers/mockAuthController');

// 🧪 MOCK ROUTES для тестирования без настоящей авторизации

// Мок-вход (создает пользователя и возвращает токен)
router.post('/login', mockAuthController.mockLogin);

// Получить готовый токен для тестирования
router.get('/token', mockAuthController.getTestToken);

// Быстрый тест
router.get('/test', (req, res) => {
  res.json({
    message: '🧪 Mock API работает!',
    endpoints: {
      mockLogin: 'POST /api/mock/login',
      getToken: 'GET /api/mock/token'
    },
    instructions: 'Сначала вызови /api/mock/login чтобы создать тестового пользователя'
  });
});

module.exports = router;
