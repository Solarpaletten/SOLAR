// 🎯 ROUTES ДЛЯ ПАРТИЙНОЙ СИСТЕМЫ
// b/src/routes/batches.js

const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');
const authMiddleware = require('../middleware/authMiddleware');
const companyMiddleware = require('../middleware/companyMiddleware');

// ===============================================
// 🔒 ПРИМЕНЯЕМ MIDDLEWARE КО ВСЕМ ROUTES
// ===============================================

// Проверка аутентификации и выбора компании
router.use(authMiddleware);
router.use(companyMiddleware);

// ===============================================
// 📦 ОСНОВНЫЕ BATCH ENDPOINTS
// ===============================================

/**
 * @route GET /api/company/batches/product/:productId/warehouse/:warehouseId
 * @desc Получить все активные партии товара на складе (для Sales)
 * @access Private (Company Level)
 */
router.get('/product/:productId/warehouse/:warehouseId', 
  batchController.getBatchesByProduct
);

/**
 * @route POST /api/company/batches/allocate
 * @desc FIFO алгоритм - автоматическое распределение партий для продажи
 * @access Private (Company Level)
 * @body { productId, warehouseId, quantity }
 */
router.post('/allocate', 
  batchController.allocateBatchesForSale
);

/**
 * @route GET /api/company/batches/:batchId/movements
 * @desc Получить историю движений конкретной партии
 * @access Private (Company Level)
 */
router.get('/:batchId/movements', 
  batchController.getBatchMovements
);

/**
 * @route POST /api/company/batches/movements
 * @desc Создать движение партии (коррекция, перемещение)
 * @access Private (Company Level)
 * @body { batchId, movementType, quantity, description, notes }
 */
router.post('/movements', 
  batchController.createBatchMovement
);

/**
 * @route GET /api/company/warehouses/:warehouseId/batches/report
 * @desc Отчёт по всем партиям на складе
 * @access Private (Company Level)
 */
router.get('/warehouses/:warehouseId/report', 
  batchController.getWarehouseBatchesReport
);

// ===============================================
// 🎯 ДОПОЛНИТЕЛЬНЫЕ ENDPOINTS ДЛЯ ENTERPRISE
// ===============================================

/**
 * @route GET /api/company/batches/expiring
 * @desc Получить список партий с истекающим сроком годности
 * @access Private (Company Level)
 * @query ?days=30 (партии истекающие в течение N дней)
 */
router.get('/expiring', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const companyId = req.user.current_company_id;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(days));

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const expiringBatches = await prisma.product_batches.findMany({
      where: {
        company_id: companyId,
        status: 'ACTIVE',
        current_quantity: { gt: 0 },
        expiry_date: {
          lte: expiryDate,
          gte: new Date() // Не показываем уже просроченные
        }
      },
      include: {
        product: { select: { name: true, code: true } },
        warehouse: { select: { name: true, code: true } },
        supplier: { select: { name: true, code: true } }
      },
      orderBy: { expiry_date: 'asc' }
    });

    res.json({
      success: true,
      data: expiringBatches,
      message: `Найдено ${expiringBatches.length} партий с истекающим сроком`
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка получения списка истекающих партий'
    });
  }
});

/**
 * @route GET /api/company/batches/supplier/:supplierId
 * @desc Получить все партии от конкретного поставщика
 * @access Private (Company Level)
 */
router.get('/supplier/:supplierId', async (req, res) => {
  try {
    const { supplierId } = req.params;
    const companyId = req.user.current_company_id;

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const supplierBatches = await prisma.product_batches.findMany({
      where: {
        company_id: companyId,
        supplier_id: parseInt(supplierId),
        current_quantity: { gt: 0 }
      },
      include: {
        product: { select: { name: true, code: true, unit: true } },
        warehouse: { select: { name: true, code: true } }
      },
      orderBy: { purchase_date: 'desc' }
    });

    // Группируем статистику
    const stats = {
      totalBatches: supplierBatches.length,
      totalValue: supplierBatches.reduce((sum, batch) => 
        sum + (parseFloat(batch.current_quantity) * parseFloat(batch.unit_cost)), 0
      ),
      totalQuantity: supplierBatches.reduce((sum, batch) => 
        sum + parseFloat(batch.current_quantity), 0
      )
    };

    res.json({
      success: true,
      data: {
        batches: supplierBatches,
        statistics: stats
      },
      message: `Партии от поставщика`
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка получения партий поставщика'
    });
  }
});

/**
 * @route GET /api/company/batches/analytics/costs
 * @desc Аналитика по себестоимости - сравнение цен покупки
 * @access Private (Company Level)
 * @query ?productId=1 (анализ по конкретному товару)
 */
router.get('/analytics/costs', async (req, res) => {
  try {
    const { productId } = req.query;
    const companyId = req.user.current_company_id;

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const whereCondition = {
      company_id: companyId,
      current_quantity: { gt: 0 }
    };

    if (productId) {
      whereCondition.product_id = parseInt(productId);
    }

    const batches = await prisma.product_batches.findMany({
      where: whereCondition,
      include: {
        product: { select: { name: true, code: true } },
        supplier: { select: { name: true, code: true } }
      },
      orderBy: { purchase_date: 'desc' }
    });

    // Анализ по товарам
    const costAnalysis = batches.reduce((acc, batch) => {
      const productId = batch.product_id;
      const unitCost = parseFloat(batch.unit_cost);

      if (!acc[productId]) {
        acc[productId] = {
          product: batch.product,
          minCost: unitCost,
          maxCost: unitCost,
          avgCost: 0,
          totalQuantity: 0,
          totalValue: 0,
          batchCount: 0,
          suppliers: new Set()
        };
      }

      const item = acc[productId];
      item.minCost = Math.min(item.minCost, unitCost);
      item.maxCost = Math.max(item.maxCost, unitCost);
      item.totalQuantity += parseFloat(batch.current_quantity);
      item.totalValue += parseFloat(batch.current_quantity) * unitCost;
      item.batchCount++;
      item.suppliers.add(batch.supplier?.name || 'Unknown');

      return acc;
    }, {});

    // Рассчитываем средние цены
    Object.keys(costAnalysis).forEach(productId => {
      const item = costAnalysis[productId];
      item.avgCost = item.totalValue / item.totalQuantity;
      item.suppliers = Array.from(item.suppliers);
      item.costVariance = ((item.maxCost - item.minCost) / item.avgCost * 100).toFixed(2);
    });

    res.json({
      success: true,
      data: costAnalysis,
      message: 'Анализ себестоимости выполнен'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка анализа себестоимости'
    });
  }
});

module.exports = router;