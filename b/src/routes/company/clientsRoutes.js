const express = require('express');
const router = express.Router();
const clientsController = require('../../controllers/company/clientsController');
// Подключаем логгер
const { logger } = require('../../config/logger');

// Добавим отладку
logger.info('Clients routes initialized');

// Маршруты для клиентов (только те, что реально есть в контроллере)
router.get('/', clientsController.getAllClients);
router.post('/', clientsController.createClient);

// 🔥 ДОБАВИТЬ ЭТУ СТРОКУ:
router.get('/:id', clientsController.getClientById);

module.exports = router;
