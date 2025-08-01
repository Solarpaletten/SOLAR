// b/src/controllers/company/purchasesController.js
const { prisma } = require('../../utils/prismaManager');
const { logger } = require('../../config/logger');

// 📊 GET /api/company/purchases/stats - Статистика покупок
const getPurchasesStats = async (req, res) => {
  try {
    const companyId = req.companyContext?.companyId;
    
    if (!companyId) {
      return res.status(400).json({ error: 'Company context required' });
    }

    logger.info(`📊 Fetching purchases stats for company: ${companyId}`);

    const [
      totalPurchases,
      totalSpent,
      avgOrderValue,
      statusStats,
      deliveryStats,
      topSuppliers,
      monthlyStats
    ] = await Promise.all([
      // Общее количество покупок
      prisma.purchases.count({
        where: { company_id: companyId }
      }),
      
      // Общие расходы
      prisma.purchases.aggregate({
        where: { company_id: companyId },
        _sum: { total_amount: true }
      }),
      
      // Средний чек
      prisma.purchases.aggregate({
        where: { company_id: companyId },
        _avg: { total_amount: true }
      }),
      
      // Статистика по статусам платежей
      prisma.purchases.groupBy({
        by: ['payment_status'],
        where: { company_id: companyId },
        _count: true
      }),
      
      // Статистика по доставке
      prisma.purchases.groupBy({
        by: ['delivery_status'],
        where: { company_id: companyId },
        _count: true
      }),
      
      // Топ поставщики
      prisma.purchases.groupBy({
        by: ['supplier_id'],
        where: { company_id: companyId },
        _count: true,
        _sum: { total_amount: true },
        orderBy: { _sum: { total_amount: 'desc' } },
        take: 5
      }),
      
      // Покупки по месяцам (последние 12 месяцев)
      prisma.purchases.groupBy({
        by: ['document_date'],
        where: {
          company_id: companyId,
          document_date: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1)
          }
        },
        _sum: { total_amount: true },
        _count: true
      })
    ]);

    const stats = {
      total: totalPurchases,
      pending: statusStats.find(s => s.payment_status === 'PENDING')?._count || 0,
      paid: statusStats.find(s => s.payment_status === 'PAID')?._count || 0,
      overdue: statusStats.find(s => s.payment_status === 'OVERDUE')?._count || 0,
      cancelled: statusStats.find(s => s.payment_status === 'CANCELLED')?._count || 0,
      delivered: deliveryStats.find(s => s.delivery_status === 'DELIVERED')?._count || 0,
      pending_delivery: deliveryStats.find(s => s.delivery_status === 'PENDING')?._count || 0,
      total_amount: totalSpent._sum.total_amount || 0,
      average_order_value: avgOrderValue._avg.total_amount || 0,
      top_suppliers: topSuppliers.length,
      monthly_spending: monthlyStats
    };

    res.json({
      success: true,
      stats,
      companyId
    });
  } catch (error) {
    logger.error('Error fetching purchases statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching purchases statistics'
    });
  }
};

// 📋 GET /api/company/purchases - Получить все покупки
const getAllPurchases = async (req, res) => {
  try {
    const companyId = req.companyContext?.companyId;
    
    if (!companyId) {
      return res.status(400).json({ error: 'Company context required' });
    }

    const { 
      page = 1, 
      limit = 50, 
      search, 
      payment_status, 
      delivery_status,
      supplier_id,
      date_from,
      date_to,
      sort_by = 'document_date',
      sort_order = 'desc'
    } = req.query;

    logger.info(`📋 Fetching purchases for company: ${companyId}`);

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Построение условий фильтрации
    const whereConditions = {
      company_id: companyId
    };

    if (search) {
      whereConditions.OR = [
        { document_number: { contains: search, mode: 'insensitive' } },
        { supplier: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    if (payment_status) {
      whereConditions.payment_status = payment_status;
    }

    if (delivery_status) {
      whereConditions.delivery_status = delivery_status;
    }

    if (supplier_id) {
      whereConditions.supplier_id = parseInt(supplier_id);
    }

    if (date_from || date_to) {
      whereConditions.document_date = {};
      if (date_from) whereConditions.document_date.gte = new Date(date_from);
      if (date_to) whereConditions.document_date.lte = new Date(date_to);
    }

    const [purchases, totalCount] = await Promise.all([
      prisma.purchases.findMany({
        where: whereConditions,
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          warehouse: {
            select: {
              id: true,
              name: true,
              code: true
            }
          },
          purchase_manager: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true
            }
          },
          _count: {
            select: {
              items: true
            }
          }
        },
        orderBy: {
          [sort_by]: sort_order
        },
        skip,
        take: parseInt(limit)
      }),
      
      prisma.purchases.count({ where: whereConditions })
    ]);

    res.json({
      success: true,
      purchases,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      },
      companyId
    });
  } catch (error) {
    logger.error('Error fetching purchases:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching purchases'
    });
  }
};

// 📄 GET /api/company/purchases/:id - Получить покупку по ID
const getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.companyContext?.companyId;

    logger.info(`📄 Fetching purchase ${id} for company: ${companyId}`);

    const purchase = await prisma.purchases.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId
      },
      include: {
        supplier: true,
        warehouse: true,
        purchase_manager: true,
        creator: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true
          }
        },
        modifier: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true
          }
        },
        items: {
          include: {
            product: true,
            employee: {
              select: {
                id: true,
                first_name: true,
                last_name: true
              }
            }
          },
          orderBy: {
            line_number: 'asc'
          }
        }
      }
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        error: 'Purchase not found'
      });
    }

    res.json({
      success: true,
      purchase,
      companyId
    });
  } catch (error) {
    logger.error('Error fetching purchase:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching purchase'
    });
  }
};

// ➕ POST /api/company/purchases - Создать новую покупку С АВТООБНОВЛЕНИЕМ СКЛАДА
const createPurchase = async (req, res) => {
  try {
    const companyId = req.companyContext?.companyId;
    const userId = req.user?.id || 1;
    
    const {
      document_number,
      document_date,
      operation_type = 'PURCHASE',
      supplier_id,
      warehouse_id,
      purchase_manager_id,
      currency = 'EUR',
      payment_status = 'PENDING',
      delivery_status = 'PENDING',
      document_status = 'DRAFT',
      items = []
    } = req.body;

    if (!companyId) {
      return res.status(400).json({ 
        error: 'Company context required'
      });
    }

    logger.info(`➕ Creating purchase for company: ${companyId}`);
    logger.info(`📝 Purchase data:`, {
      document_number,
      supplier_id,
      warehouse_id,
      items: items.length,
      companyId,
      userId
    });

    // Валидация
    if (!document_number || !document_date || !supplier_id) {
      return res.status(400).json({
        success: false,
        error: 'Required fields: document_number, document_date, supplier_id'
      });
    }

    // Проверяем уникальность номера документа
    const existingPurchase = await prisma.purchases.findFirst({
      where: {
        company_id: companyId,
        document_number
      }
    });

    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        error: 'Purchase with this document number already exists'
      });
    }

    // Проверяем что поставщик существует
    const supplier = await prisma.clients.findFirst({
      where: { id: parseInt(supplier_id), company_id: companyId }
    });

    if (!supplier) {
      logger.error('❌ Supplier not found:', supplier_id);
      return res.status(400).json({
        success: false,
        error: `Supplier ${supplier_id} not found`
      });
    }

    logger.info(`✅ Supplier found: ${supplier.name}`);

    // Расчёт сумм
    let subtotal = 0;
    let vat_amount = 0;

    const processedItems = items.map((item, index) => {
      const quantity = parseFloat(item.quantity);
      const unit_price = parseFloat(item.unit_price);
      const vat_rate = parseFloat(item.vat_rate || 0);
      
      const line_subtotal = quantity * unit_price;
      const line_vat = line_subtotal * (vat_rate / 100);
      const line_total = line_subtotal + line_vat;
      
      subtotal += line_subtotal;
      vat_amount += line_vat;

      return {
        product_id: parseInt(item.product_id),
        line_number: index + 1,
        quantity: quantity,
        unit_price: unit_price,
        vat_rate: vat_rate,
        vat_amount: line_vat,
        line_total: line_total,
        description: item.description || '',
        employee_id: item.employee_id ? parseInt(item.employee_id) : null
      };
    });

    const total_amount = subtotal + vat_amount;

    logger.info(`💰 Calculated amounts:`, {
      subtotal,
      vat_amount,
      total_amount,
      items: processedItems.length
    });

    // 🔥 СОЗДАНИЕ ПОКУПКИ С АВТОМАТИЧЕСКИМ ОБНОВЛЕНИЕМ ОСТАТКОВ НА СКЛАДЕ
    const purchase = await prisma.$transaction(async (tx) => {
      // 1. Создаём покупку
      const newPurchase = await tx.purchases.create({
        data: {
          company_id: companyId,
          document_number,
          document_date: new Date(document_date),
          operation_type,
          supplier_id: parseInt(supplier_id),
          warehouse_id: warehouse_id ? parseInt(warehouse_id) : null,
          purchase_manager_id: purchase_manager_id ? parseInt(purchase_manager_id) : null,
          subtotal,
          vat_amount,
          total_amount,
          currency,
          payment_status,
          delivery_status,
          document_status,
          created_by: userId,
          created_at: new Date()
        }
      });

      logger.info(`✅ Created purchase: ${newPurchase.id}`);

      // 2. Создаём элементы покупки
      if (processedItems.length > 0) {
        await tx.purchase_items.createMany({
          data: processedItems.map(item => ({
            purchase_id: newPurchase.id,
            product_id: item.product_id,
            line_number: item.line_number,
            quantity: item.quantity,
            unit_price: item.unit_price,
            vat_rate: item.vat_rate,
            vat_amount: item.vat_amount,
            line_total: item.line_total,
            notes: item.description,
            employee_id: item.employee_id
          }))
        });
        
        logger.info(`✅ Created ${processedItems.length} purchase items`);

        // 🔥 3. АВТОМАТИЧЕСКОЕ ОБНОВЛЕНИЕ ОСТАТКОВ НА СКЛАДЕ
        logger.info(`📦 Starting automatic stock update for ${processedItems.length} items...`);
        
        for (const item of processedItems) {
          // Получаем текущий товар
          const currentProduct = await tx.products.findUnique({
            where: { id: item.product_id },
            select: { 
              id: true,
              code: true, 
              name: true, 
              current_stock: true,
              unit: true 
            }
          });

          if (currentProduct) {
            const currentStock = parseFloat(currentProduct.current_stock || 0);
            const newStock = currentStock + item.quantity; // ПРИХОД = УВЕЛИЧЕНИЕ

            // Обновляем остаток товара
            await tx.products.update({
              where: { id: item.product_id },
              data: { 
                current_stock: newStock,
                updated_at: new Date()
              }
            });

            logger.info(`📦 STOCK UPDATE: ${currentProduct.name} (${currentProduct.code})`);
            logger.info(`   Current: ${currentStock} ${currentProduct.unit || 'pcs'}`);
            logger.info(`   + Purchase: ${item.quantity} ${currentProduct.unit || 'pcs'}`);
            logger.info(`   = New Stock: ${newStock} ${currentProduct.unit || 'pcs'}`);
          } else {
            logger.warn(`⚠️ Product ${item.product_id} not found for stock update`);
          }
        }

        logger.info(`🎉 All stock quantities updated automatically!`);
      }

      return newPurchase;
    });

    // Получение созданной покупки с обновлёнными остатками
    const createdPurchase = await prisma.purchases.findUnique({
      where: { id: purchase.id },
      include: {
        supplier: true,
        warehouse: true,
        purchase_manager: true,
        items: {
          include: {
            product: {
              select: {
                id: true,
                code: true,
                name: true,
                current_stock: true, // 🔥 ОБНОВЛЕННЫЙ ОСТАТОК
                unit: true,
                min_stock: true
              }
            }
          }
        }
      }
    });

    logger.info(`🎉 Purchase created successfully: ${purchase.id}`);

    // 🔥 ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ О ДВИЖЕНИИ ТОВАРОВ
    const stockUpdates = processedItems.map(item => {
      const productItem = createdPurchase.items.find(i => i.product_id === item.product_id);
      return {
        product_id: item.product_id,
        product_name: productItem?.product?.name || 'Unknown',
        product_code: productItem?.product?.code || '',
        quantity_added: item.quantity,
        new_stock: parseFloat(productItem?.product?.current_stock || '0'),
        unit: productItem?.product?.unit || 'pcs',
        operation: 'STOCK_INCREASE',
        warehouse_id: warehouse_id || null
      };
    });

    res.status(201).json({
      success: true,
      purchase: createdPurchase,
      message: 'Purchase created successfully and stock updated automatically',
      stock_updates: stockUpdates,
      summary: {
        total_items: processedItems.length,
        total_amount: total_amount,
        currency: currency,
        warehouse: warehouse_id ? `Warehouse ID: ${warehouse_id}` : 'No specific warehouse',
        stock_updated: true
      },
      companyId
    });
  } catch (error) {
    logger.error('❌ Error creating purchase:', error);
    logger.error('Stack trace:', error.stack);
    
    if (error.code) {
      logger.error('Prisma error code:', error.code);
      logger.error('Prisma error meta:', error.meta);
    }
    
    res.status(500).json({
      success: false,
      error: 'Error creating purchase',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ✏️ PUT /api/company/purchases/:id - Обновить покупку
const updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.companyContext?.companyId;
    const userId = req.user.id;
    const updateData = req.body;

    logger.info(`✏️ Updating purchase ${id} for company: ${companyId}`);

    // Проверяем существование покупки
    const existingPurchase = await prisma.purchases.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId
      }
    });

    if (!existingPurchase) {
      return res.status(404).json({
        success: false,
        error: 'Purchase not found'
      });
    }

    // Подготовка данных для обновления
    const {
      items,
      ...purchaseFields
    } = updateData;

    // Обновляем покупку
    const updatedPurchase = await prisma.$transaction(async (tx) => {
      // Обновляем основные поля покупки
      const purchase = await tx.purchases.update({
        where: { id: parseInt(id) },
        data: {
          ...purchaseFields,
          updated_by: userId,
          updated_at: new Date()
        }
      });

      // Если есть items, обновляем их
      if (items && Array.isArray(items)) {
        // Удаляем старые items
        await tx.purchase_items.deleteMany({
          where: { purchase_id: parseInt(id) }
        });

        // Создаём новые items
        if (items.length > 0) {
          let subtotal = 0;
          let vat_amount = 0;

          const processedItems = items.map((item, index) => {
            const quantity = parseFloat(item.quantity);
            const unit_price = parseFloat(item.unit_price);
            const vat_rate = parseFloat(item.vat_rate || 0);
            
            const line_subtotal = quantity * unit_price;
            const line_vat = line_subtotal * (vat_rate / 100);
            const line_total = line_subtotal + line_vat;
            
            subtotal += line_subtotal;
            vat_amount += line_vat;

            return {
              purchase_id: parseInt(id),
              product_id: parseInt(item.product_id),
              line_number: index + 1,
              quantity: quantity,
              unit_price: unit_price,
              vat_rate: vat_rate,
              vat_amount: line_vat,
              line_total: line_total,
              notes: item.description || '',
              employee_id: item.employee_id ? parseInt(item.employee_id) : null
            };
          });

          const total_amount = subtotal + vat_amount;

          await tx.purchase_items.createMany({
            data: processedItems
          });

          // Обновляем итоговые суммы
          await tx.purchases.update({
            where: { id: parseInt(id) },
            data: {
              subtotal,
              vat_amount,
              total_amount
            }
          });
        }
      }

      return purchase;
    });

    // Получаем обновлённую покупку
    const purchase = await prisma.purchases.findUnique({
      where: { id: parseInt(id) },
      include: {
        supplier: true,
        warehouse: true,
        purchase_manager: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.json({
      success: true,
      purchase,
      message: 'Purchase updated successfully',
      companyId
    });
  } catch (error) {
    logger.error('Error updating purchase:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating purchase'
    });
  }
};

// 🗑️ DELETE /api/company/purchases/:id - Удалить покупку
const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.companyContext?.companyId;

    logger.info(`🗑️ Deleting purchase ${id} for company: ${companyId}`);

    // Проверяем существование покупки
    const existingPurchase = await prisma.purchases.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId
      }
    });

    if (!existingPurchase) {
      return res.status(404).json({
        success: false,
        error: 'Purchase not found'
      });
    }

    // Удаляем покупку (items удалятся автоматически по CASCADE)
    await prisma.purchases.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Purchase deleted successfully',
      companyId
    });
  } catch (error) {
    logger.error('Error deleting purchase:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting purchase'
    });
  }
};

module.exports = {
  getPurchasesStats,
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase
};