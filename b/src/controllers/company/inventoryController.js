// b/src/controllers/company/inventoryController.js
const { prisma } = require('../../utils/prismaManager');
const { logger } = require('../../config/logger');

// 📈 GET /api/company/inventory/movements/:productId - История движений товара
const getProductMovements = async (req, res) => {
  try {
    const { productId } = req.params;
    const companyId = req.companyContext?.companyId;
    const { page = 1, limit = 50, date_from, date_to } = req.query;

    logger.info(`📈 Fetching movements for product ${productId}, company: ${companyId}`);

    // Проверяем что продукт принадлежит компании
    const product = await prisma.products.findFirst({
      where: { id: parseInt(productId), company_id: companyId }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Создаём условия фильтрации по датам
    const dateFilter = {};
    if (date_from) dateFilter.gte = new Date(date_from);
    if (date_to) dateFilter.lte = new Date(date_to);

    // Получаем движения из покупок (приход)
    const purchaseMovements = await prisma.purchase_items.findMany({
      where: {
        product_id: parseInt(productId),
        purchase: {
          company_id: companyId,
          ...(Object.keys(dateFilter).length ? { document_date: dateFilter } : {})
        }
      },
      include: {
        purchase: {
          select: {
            id: true,
            document_number: true,
            document_date: true,
            supplier: { select: { name: true } },
            warehouse: { select: { name: true } }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      skip,
      take: parseInt(limit)
    });

    // Получаем движения из продаж (расход)
    const saleMovements = await prisma.sale_items.findMany({
      where: {
        product_id: parseInt(productId),
        sale: {
          company_id: companyId,
          ...(Object.keys(dateFilter).length ? { document_date: dateFilter } : {})
        }
      },
      include: {
        sale: {
          select: {
            id: true,
            document_number: true,
            document_date: true,
            client: { select: { name: true } },
            warehouse: { select: { name: true } }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      skip,
      take: parseInt(limit)
    });

    // Объединяем и форматируем движения
    const movements = [
      ...purchaseMovements.map(item => ({
        id: `purchase_${item.id}`,
        type: 'PURCHASE',
        document_number: item.purchase.document_number,
        document_date: item.purchase.document_date,
        quantity: parseFloat(item.quantity),
        unit_price: parseFloat(item.unit_price),
        amount: parseFloat(item.line_total),
        partner: item.purchase.supplier.name,
        warehouse: item.purchase.warehouse?.name || 'No warehouse',
        movement: 'IN', // приход
        movement_type: '📥 Приход',
        created_at: item.created_at
      })),
      ...saleMovements.map(item => ({
        id: `sale_${item.id}`,
        type: 'SALE',
        document_number: item.sale.document_number,
        document_date: item.sale.document_date,
        quantity: parseFloat(item.quantity),
        unit_price: parseFloat(item.unit_price_base),
        amount: parseFloat(item.line_total),
        partner: item.sale.client.name,
        warehouse: item.sale.warehouse?.name || 'No warehouse',
        movement: 'OUT', // расход
        movement_type: '📤 Расход',
        created_at: item.created_at
      }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Рассчитываем итоги
    const totalIn = movements.filter(m => m.movement === 'IN').reduce((sum, m) => sum + m.quantity, 0);
    const totalOut = movements.filter(m => m.movement === 'OUT').reduce((sum, m) => sum + m.quantity, 0);
    const balance = totalIn - totalOut;

    res.json({
      success: true,
      product: {
        id: product.id,
        code: product.code,
        name: product.name,
        current_stock: parseFloat(product.current_stock || 0),
        unit: product.unit
      },
      movements,
      summary: {
        total_movements: movements.length,
        total_in: totalIn,
        total_out: totalOut,
        calculated_balance: balance,
        current_stock: parseFloat(product.current_stock || 0)
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: movements.length,
        pages: Math.ceil(movements.length / parseInt(limit))
      },
      companyId  
    });
  } catch (error) {
    logger.error('Error fetching product movements:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching product movements'
    });
  }
};

// 📊 GET /api/company/inventory/warehouse/:warehouseId - Текущие остатки по складу
const getWarehouseInventory = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const companyId = req.companyContext?.companyId;
    const { search = '', low_stock_only = false, page = 1, limit = 100 } = req.query;

    logger.info(`📊 Fetching inventory for warehouse ${warehouseId}, company: ${companyId}`);

    // Проверяем что склад принадлежит компании
    const warehouse = await prisma.warehouses.findFirst({
      where: { id: parseInt(warehouseId), company_id: companyId }
    });

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        error: 'Warehouse not found'
      });
    }

    // Получаем все товары с остатками
    const whereConditions = {
      company_id: companyId,
      is_active: true
    };

    if (search) {
      whereConditions.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await prisma.products.findMany({
      where: whereConditions,
      select: {
        id: true,
        code: true,
        name: true,
        unit: true,
        current_stock: true,
        min_stock: true,
        price: true,
        cost_price: true,
        currency: true,
        category: true,
        updated_at: true
      },
      orderBy: {
        name: 'asc'
      },
      skip,
      take: parseInt(limit)
    });

    // Обогащаем данные вычисляемыми полями
    let enrichedProducts = products.map(product => {
      const currentStock = parseFloat(product.current_stock || 0);
      const minStock = parseFloat(product.min_stock || 0);
      const price = parseFloat(product.cost_price || product.price || 0);
      
      let stockStatus = 'OK';
      let stockStatusIcon = '✅';
      let stockStatusText = 'В наличии';
      
      if (currentStock <= 0) {
        stockStatus = 'OUT';
        stockStatusIcon = '🚨';
        stockStatusText = 'Нет в наличии';
      } else if (currentStock <= minStock) {
        stockStatus = 'LOW';
        stockStatusIcon = '⚠️';
        stockStatusText = 'Низкий остаток';
      }
      
      return {
        ...product,
        current_stock: currentStock,
        min_stock: minStock,
        stock_status: stockStatus,
        stock_status_icon: stockStatusIcon,
        stock_status_text: stockStatusText,
        stock_value: currentStock * price
      };
    });

    // Фильтр низких остатков
    if (low_stock_only === 'true') {
      enrichedProducts = enrichedProducts.filter(p => p.stock_status === 'LOW' || p.stock_status === 'OUT');
    }

    const totalValue = enrichedProducts.reduce((sum, product) => sum + product.stock_value, 0);
    const lowStockCount = enrichedProducts.filter(p => p.stock_status === 'LOW' || p.stock_status === 'OUT').length;
    const outOfStockCount = enrichedProducts.filter(p => p.stock_status === 'OUT').length;

    res.json({
      success: true,
      warehouse: {
        id: warehouse.id,
        name: warehouse.name,
        code: warehouse.code,
        address: warehouse.address
      },
      products: enrichedProducts,
      summary: {
        total_products: enrichedProducts.length,
        total_value: totalValue,
        low_stock_count: lowStockCount,
        out_of_stock_count: outOfStockCount,
        currency: 'EUR'
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: enrichedProducts.length,
        pages: Math.ceil(enrichedProducts.length / parseInt(limit))
      },
      companyId
    });
  } catch (error) {
    logger.error('Error fetching warehouse inventory:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching warehouse inventory'
    });
  }
};

// 📊 GET /api/company/inventory/stats - Общая статистика остатков
const getInventoryStats = async (req, res) => {
  try {
    const companyId = req.companyContext?.companyId;
    
    if (!companyId) {
      return res.status(400).json({ error: 'Company context required' });
    }

    logger.info(`📊 Fetching inventory stats for company: ${companyId}`);

    // Получаем все товары
    const products = await prisma.products.findMany({
      where: { 
        company_id: companyId, 
        is_active: true 
      },
      select: {
        current_stock: true,
        min_stock: true,
        price: true,
        cost_price: true
      }
    });

    // Рассчитываем статистику
    const totalProducts = products.length;
    let lowStockProducts = 0;
    let outOfStockProducts = 0;
    let totalStockValue = 0;

    products.forEach(product => {
      const currentStock = parseFloat(product.current_stock || 0);
      const minStock = parseFloat(product.min_stock || 0);
      const price = parseFloat(product.cost_price || product.price || 0);
      
      if (currentStock <= 0) {
        outOfStockProducts++;
      } else if (currentStock <= minStock) {
        lowStockProducts++;
      }
      
      totalStockValue += currentStock * price;
    });

    // Получаем статистику складов
    const warehouses = await prisma.warehouses.count({
      where: { company_id: companyId, status: 'ACTIVE' }
    });

    const stats = {
      total_products: totalProducts,
      low_stock_products: lowStockProducts,
      out_of_stock_products: outOfStockProducts,
      ok_stock_products: totalProducts - lowStockProducts - outOfStockProducts,
      total_warehouses: warehouses,
      total_stock_value: totalStockValue,
      currency: 'EUR'
    };

    res.json({
      success: true,
      stats,
      companyId
    });
  } catch (error) {
    logger.error('Error fetching inventory stats:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching inventory stats'
    });
  }
};

// 📋 GET /api/company/inventory/products - Список товаров с остатками
const getProductInventory = async (req, res) => {
  try {
    const companyId = req.companyContext?.companyId;
    const { 
      search = '',
      low_stock_only = false,
      page = 1,
      limit = 50,
      sort_by = 'name',
      sort_order = 'asc'
    } = req.query;

    logger.info(`📋 Fetching product inventory for company: ${companyId}`);

    const whereConditions = {
      company_id: companyId,
      is_active: true
    };

    if (search) {
      whereConditions.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, totalCount] = await Promise.all([
      prisma.products.findMany({
        where: whereConditions,
        select: {
          id: true,
          code: true,
          name: true,
          unit: true,
          current_stock: true,
          min_stock: true,
          price: true,
          cost_price: true,
          currency: true,
          category: true,
          updated_at: true
        },
        orderBy: {
          [sort_by]: sort_order
        },
        skip,
        take: parseInt(limit)
      }),
      
      prisma.products.count({ where: whereConditions })
    ]);

    // Добавляем вычисляемые поля
    let enrichedProducts = products.map(product => {
      const currentStock = parseFloat(product.current_stock || 0);
      const minStock = parseFloat(product.min_stock || 0);
      const price = parseFloat(product.cost_price || product.price || 0);
      
      let stockStatus = 'OK';
      if (currentStock <= 0) stockStatus = 'OUT';
      else if (currentStock <= minStock) stockStatus = 'LOW';
      
      return {
        ...product,
        current_stock: currentStock,
        min_stock: minStock,
        stock_status: stockStatus,
        stock_value: currentStock * price
      };
    });

    // Фильтр низких остатков
    if (low_stock_only === 'true') {
      enrichedProducts = enrichedProducts.filter(p => p.stock_status === 'LOW' || p.stock_status === 'OUT');
    }

    res.json({
      success: true,
      products: enrichedProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      },
      companyId
    });
  } catch (error) {
    logger.error('Error fetching product inventory:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching product inventory'
    });
  }
};

module.exports = {
  getProductMovements,
  getWarehouseInventory,
  getInventoryStats,
  getProductInventory
};