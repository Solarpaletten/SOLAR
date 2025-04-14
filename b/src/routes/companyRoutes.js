const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const auth = require('../middleware/auth');
const { companyValidators } = require('../middleware/validators');
const { standardizeCompanyCodeMiddleware } = require('../utils/companyUtils');
const { logger } = require('../config/logger');

// Добавим отладку
logger.info('Company routes initialized');

// Маршруты с проверкой аутентификации
router.get('/', auth, companyController.getAllCompanies);
router.get('/:id', auth, companyController.getCompanyById);

// При создании компании применяем middleware для стандартизации кода
router.post('/', 
  auth, 
  (req, res, next) => {
    // Добавляем детальное логирование для отладки
    logger.info('Получен запрос на создание компании:', {
      body: req.body,
      userId: req.user?.id
    });
    next();
  },
  standardizeCompanyCodeMiddleware,
  companyValidators.createCompany,
  companyController.createCompany
);

router.put('/:id', auth, standardizeCompanyCodeMiddleware, companyController.updateCompany);
router.delete('/:id', auth, companyController.deleteCompany);

module.exports = router;