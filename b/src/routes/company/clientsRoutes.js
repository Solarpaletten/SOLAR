// b/src/routes/company/clientsRoutes.js
const express = require('express');
const router = express.Router();
const clientsController = require('../../controllers/company/clientsController');
const { logger } = require('../../config/logger');

// Добавим отладку
logger.info('Clients routes initialized');

// ===========================================
// 🏭 COMPANY-LEVEL CLIENT ROUTES  
// ===========================================

// Список всех клиентов компании
router.get('/', clientsController.getAllClients);

// Создать нового клиента
router.post('/', clientsController.createClient);

// Получить клиента по ID
router.get('/:id', clientsController.getClientById);

// Обновить клиента
router.put('/:id', clientsController.updateClient);

// Удалить клиента  
router.delete('/:id', clientsController.deleteClient);

// ✅ ДОПОЛНИТЕЛЬНЫЕ ENDPOINTS для v1.7.0:

// Поиск клиентов по имени/email
router.get('/search/query', clientsController.searchClients);

// Legacy route (будет удален в v1.8.0)
router.get('/companies', clientsController.getMyCompanies);

module.exports = router;