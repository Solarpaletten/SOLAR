const express = require('express');
const router = express.Router();
const purchasesController = require('../controllers/purchasesController');
const purchasesExportController = require('../controllers/purchasesExportController');
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

// Новые маршруты для экспорта
router.get('/:id/export/pdf', auth, purchasesExportController.exportPurchaseToPdf);
router.get('/:id/export/excel', auth, purchasesExportController.exportPurchaseToExcel);
router.get('/:id/export/word', auth, purchasesExportController.exportPurchaseToWord);

module.exports = router;