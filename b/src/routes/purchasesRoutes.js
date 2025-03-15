const express = require('express');
const router = express.Router();
const purchasesController = require('../controllers/purchasesController');
const auth = require('../middleware/auth');
const { logger } = require('../config/logger');

// Добавим отладку
logger.info('Purchases routes initialized');

// Маршруты с проверкой аутентификации
router.get('/', auth, purchasesController.getAllPurchases);
router.get('/:id', auth, purchasesController.getPurchaseById);
router.post('/', auth, purchasesController.createPurchase);
router.put('/:id', auth, purchasesController.updatePurchase);
router.delete('/:id', auth, purchasesController.deletePurchase);

module.exports = router;
