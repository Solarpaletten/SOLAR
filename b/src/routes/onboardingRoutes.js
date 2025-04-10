// routes/onboardingRoutes.js
const express = require('express');
const router = express.Router();
const onboardingController = require('../controllers/onboardingController');
const auth = require('../middleware/auth');
const { logger } = require('../config/logger');

// Добавим отладку
logger.info('Onboarding routes initialized');

// Добавить дополнительное логирование для отладки
router.post('/setup', auth, (req, res, next) => {
  logger.info('Получен запрос на онбординг:', {
    body: req.body,
    headers: {
      authorization: req.headers.authorization ? 'Bearer ***' : 'отсутствует'
    }
  });
  next();
}, onboardingController.setupCompany);

module.exports = router;