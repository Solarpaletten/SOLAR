// routes/onboardingRoutes.js
const express = require('express');
const router = express.Router();
const onboardingController = require('../controllers/onboardingController');
const auth = require('../middleware/auth');
const { companyValidators } = require('../middleware/validators');
const { logger } = require('../config/logger');

// Добавим отладку
logger.info('Onboarding routes initialized');

// Добавить дополнительное логирование для отладки и валидацию данных
router.post('/setup', 
  auth, 
  (req, res, next) => {
    logger.info('Получен запрос на онбординг:', {
      body: req.body,
      headers: {
        authorization: req.headers.authorization ? 'Bearer ***' : 'отсутствует'
      }
    });
    next();
  },
  companyValidators.setupCompany,
  onboardingController.setupCompany
);

module.exports = router;