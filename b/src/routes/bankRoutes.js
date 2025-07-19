 const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');
const { logger } = require('../config/logger');

// Добавим отладку
logger.info('Bank routes initialized');

// Получение всех банковских операций
router.get('/', bankController.getAllOperations);

// Получение статистики операций
router.get('/stats', bankController.getOperationsStats);

// // Загрузка банковской выписки
// router.post('/upload', bankController.upload.single('bankStatement'), bankController.uploadBankStatement);

// Получение операции по ID
router.get('/:id', bankController.getOperationById);

// Создание новой операции
router.post('/', bankController.createOperation);

// Обновление операции
router.put('/:id', bankController.updateOperation);

// Удаление операции
router.delete('/:id', bankController.deleteOperation);

module.exports = router;
