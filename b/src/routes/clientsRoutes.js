const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clientsController');
const auth = require('../middleware/auth');
const { logger } = require('../config/logger');

// Добавим отладку
logger.info('Clients routes initialized');

// Маршруты с проверкой аутентификации
router.get('/', auth, clientsController.getAllClients);
router.get('/:id', auth, clientsController.getClientById);
router.post('/', auth, clientsController.createClient);
router.put('/:id', auth, clientsController.updateClient);
router.delete('/:id', auth, clientsController.deleteClient);

module.exports = router;