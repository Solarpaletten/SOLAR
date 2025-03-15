const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
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

module.exports = router;
