const express = require('express');
const router = express.Router();
const purchasesController = require('../controllers/purchasesController');
const purchasesExportController = require('../controllers/purchasesExportController');
const auth = require('../middleware/auth');
const { logger } = require('../config/logger');

// Добавим отладку
logger.info('Purchases routes initialized');

// Базовые маршруты с проверкой аутентификации
router.get('/', auth, purchasesController.getAllPurchases);
router.get('/:id', auth, purchasesController.getPurchaseById);
router.post('/', auth, purchasesController.createPurchase);
router.put('/:id', auth, purchasesController.updatePurchase);
router.delete('/:id', auth, purchasesController.deletePurchase);

// Маршрут для обновления статуса закупки
router.patch('/:id/status', auth, purchasesController.updatePurchaseStatus);

// Маршруты для экспорта отдельных закупок в разные форматы
router.get('/:id/export/pdf', auth, purchasesExportController.exportPurchaseToPdf);
router.get('/:id/export/excel', auth, purchasesExportController.exportPurchaseToExcel);
router.get('/:id/export/word', auth, purchasesExportController.exportPurchaseToWord);

// Маршруты для экспорта/импорта всех закупок
router.get('/export', auth, purchasesController.exportPurchasesToCSV);
router.post('/import', auth, purchasesController.importPurchasesFromCSV);

// Маршрут для получения списка поставщиков
router.get('/suppliers', auth, purchasesController.getSuppliersList);

module.exports = router;