const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const salesExportController = require('../controllers/salesExportController');
const auth = require('../middleware/auth');
const { logger } = require('../config/logger');

// Добавим отладку
logger.info('Sales routes initialized');

// Маршруты с проверкой аутентификации
router.get('/', auth, salesController.getAllSales);
router.get('/:id', auth, salesController.getSaleById);
router.post('/', auth, salesController.createSale);
router.put('/:id', auth, salesController.updateSale);
router.delete('/:id', auth, salesController.deleteSale);

// Новые маршруты для экспорта
router.get('/:id/export/pdf', auth, salesExportController.exportSaleToPdf);
router.get('/:id/export/excel', auth, salesExportController.exportSaleToExcel);
router.get('/:id/export/word', auth, salesExportController.exportSaleToWord);

module.exports = router;