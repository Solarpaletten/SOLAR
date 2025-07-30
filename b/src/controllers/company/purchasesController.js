// b/src/controllers/company/purchasesController.js - ИСПРАВЛЕН И ЗАВЕРШЁН
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

    // Параллельные запросы для статистики
    const [
      totalPurchases,
      totalAmount,
      pendingCount,
      thisMonthStats
    ] = await Promise.all([
      // Общее количество покупок
      prisma.purchases.count({
        where: { company_id: companyId }
      }),
      
      // Общая сумма покупок
      prisma.purchases.aggregate({
        where: { company_id: companyId },
        _sum: { total_amount: true }
      }),
      
      // Количество ожидающих покупок
      prisma.purchases.count({
        where: {
          company_id: companyId,
          payment_status: 'PENDING'
        }
      }),
      
      // Статистика за этот месяц
      prisma.purchases.aggregate({
        where: {
          company_id: companyId,
          document_date: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        },
        _sum: { total_amount: true },
        _count: true
      })
    ]);

    const stats = {
      total_purchases: totalPurchases,
      total_amount: totalAmount._sum.total_amount || 0,
      pending_purchases: pendingCount,
      this_month_purchases: thisMonthStats._count,
      this_month_amount: thisMonthStats._sum.total_amount || 0,
      average_purchase: totalPurchases > 0 ? (totalAmount._sum.total_amount || 0) / totalPurchases : 0
    };

    res.json({
      success: true,
      stats,
      companyId
    });
  } catch (error) {
    logger.error('Error fetching purchases stats:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching purchases stats'
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
      limit = 10,
      search = '',
      payment_status,
      delivery_status,
      operation_type,
      supplier_id,
      sort_by = 'document_date',
      sort_order = 'desc'
    } = req.query;

    logger.info(`📋 Fetching purchases for company: ${companyId}`);

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

    if (payment_status) whereConditions.payment_status = payment_status;
    if (delivery_status) whereConditions.delivery_status = delivery_status;
    if (operation_type) whereConditions.operation_type = operation_type;
    if (supplier_id) whereConditions.supplier_id = parseInt(supplier_id);

    const skip = (parseInt(page) - 1) * parseInt(limit);

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
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                  unit: true
                }
              }
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

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      purchases,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
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
        warehouse: {
          select: {
            id: true,
            name: true,
            code: true,
            address: true
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

// ИСПРАВЛЕННАЯ ЧАСТЬ КОНТРОЛЛЕРА - только функция createPurchase

// ➕ POST /api/company/purchases - Создать новую покупку
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
      userId
    });

    // Валидация обязательных полей
    if (!document_number || !document_date || !supplier_id) {
      return res.status(400).json({
        success: false,
        error: 'Required fields: document_number, document_date, supplier_id'
      });
    }

    // Проверяем supplier существует
    const supplier = await prisma.clients.findFirst({
      where: { 
        id: parseInt(supplier_id), 
        company_id: companyId 
      }
    });

    if (!supplier) {
      logger.error(`❌ Supplier ${supplier_id} not found for company ${companyId}`);
      return res.status(400).json({
        success: false,
        error: `Supplier not found`
      });
    }

    logger.info(`✅ Supplier found: ${supplier.name}`);

    // Проверяем уникальность номера документа в рамках компании
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

    // Расчёт сумм
    let subtotal = 0;
    let vat_amount = 0;

    const processedItems = items.map((item, index) => {
      const quantity = parseFloat(item.quantity || 0);
      const unitPrice = parseFloat(item.unit_price_base || 0); // От frontend приходит unit_price_base
      const vatRate = parseFloat(item.vat_rate || 0);
      
      const lineTotal = quantity * unitPrice;
      const vatAmount = lineTotal * (vatRate / 100);
      
      subtotal += lineTotal;
      vat_amount += vatAmount;

      return {
        product_id: parseInt(item.product_id),
        line_number: index + 1,
        quantity,
        unit_price: unitPrice,  // ← СОХРАНЯЕМ В БД КАК unit_price
        vat_rate: vatRate,
        vat_amount: vatAmount,
        line_total: lineTotal,
        description: item.description || null,
        employee_id: item.employee_id ? parseInt(item.employee_id) : null
      };
    });

    const total_amount = subtotal + vat_amount;

    logger.info(`💰 Purchase totals: subtotal=${subtotal}, vat=${vat_amount}, total=${total_amount}`);

    // Создание покупки с элементами в транзакции
    const purchase = await prisma.$transaction(async (tx) => {
      // Создаем основную покупку
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

      // Создание элементов покупки
      if (processedItems.length > 0) {
        await tx.purchase_items.createMany({
          data: processedItems.map(item => ({
            purchase_id: newPurchase.id,
            product_id: item.product_id,
            line_number: item.line_number,
            quantity: item.quantity,
            unit_price: item.unit_price,  // ← ПРАВИЛЬНОЕ ПОЛЕ
            vat_rate: item.vat_rate,
            vat_amount: item.vat_amount,
            line_total: item.line_total,
            notes: item.description,  // ← В БД поле называется 'notes'
            employee_id: item.employee_id
          }))
        });
        
        logger.info(`✅ Created ${processedItems.length} purchase items`);
      }

      return newPurchase;
    });

    // Получение созданной покупки с связанными данными
    const createdPurchase = await prisma.purchases.findUnique({
      where: { id: purchase.id },
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

    logger.info(`🎉 Purchase created successfully: ${purchase.id}`);

    res.status(201).json({
      success: true,
      purchase: createdPurchase,
      message: 'Purchase created successfully',
      companyId
    });
  } catch (error) {
    logger.error('❌ Error creating purchase:', error);
    logger.error('Stack trace:', error.stack);
    
    // Более детальная диагностика ошибок Prisma
    if (error.code) {
      logger.error('Prisma error code:', error.code);
      logger.error('Prisma error meta:', error.meta);
    }
    
    res.status(500).json({
      success: false,
      error: 'Error creating purchase',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};


// ✏️ PUT /api/company/purchases/:id - Обновить покупку
const updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.companyContext?.companyId;
    const userId = req.user?.id || 1;
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

        // Создаем новые items
        if (items.length > 0) {
          await tx.purchase_items.createMany({
            data: items.map((item, index) => ({
              purchase_id: parseInt(id),
              product_id: parseInt(item.product_id),
              line_number: index + 1,
              quantity: parseFloat(item.quantity),
              unit_price_base: parseFloat(item.unit_price_base),
              discount_percent: parseFloat(item.discount_percent || 0),
              vat_rate: parseFloat(item.vat_rate || 0),
              vat_amount: parseFloat(item.vat_amount || 0),
              line_total: parseFloat(item.line_total || 0),
              description: item.description || null,
              warehouse_id: item.warehouse_id ? parseInt(item.warehouse_id) : null,
              employee_id: item.employee_id ? parseInt(item.employee_id) : null
            }))
          });
        }
      }

      return purchase;
    });

    // Получаем обновленную покупку с связанными данными
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

    // Удаляем покупку в транзакции
    await prisma.$transaction(async (tx) => {
      // Сначала удаляем все items
      await tx.purchase_items.deleteMany({
        where: { purchase_id: parseInt(id) }
      });

      // Затем удаляем саму покупку
      await tx.purchases.delete({
        where: { id: parseInt(id) }
      });
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