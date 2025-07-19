const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clientsController');
const { logger } = require('../config/logger');

// Добавим отладку
logger.info('Clients routes initialized');

// Маршруты с проверкой аутентификации
router.get('/', clientsController.getAllClients);
router.get('/companies', clientsController.getMyCompanies);
router.get('/:id', clientsController.getClientById);
router.post('/', clientsController.createClient);
router.put('/:id', clientsController.updateClient);
router.delete('/:id', clientsController.deleteClient);


module.exports = router;
