// b/src/controllers/company/purchasesController.js
const { PrismaClient } = require('@prisma/client');
const { logger } = require('../../config/logger');

const prisma = new PrismaClient();

// 📊 GET /api/company/purchases/stats - Статистика покупок
const getPurchasesStats = async (req, res) => {
  try {
    const companyId = req.companyContext?.companyId;
    
    logger.info(`📊 Fetching purchases stats for company: ${companyId}`);

    // Получаем статистику покупок
    const totalCount = await prisma.purchases.count({
      where: { company_id: companyId }
    });

    const statusStats = await prisma.purchases.groupBy({
      by: ['payment_status'],
      where: { company_id: companyId },
      _count: true
    });

    const totalSpent = await prisma.purchases.aggregate({
      where: { company_id: companyId },
      _sum: { total_amount: true }
    });

    const avgOrderValue = await prisma.purchases.aggregate({
      where: { 
        company_id: companyId,
        total_amount: { gt: 0 }
      },
      _avg: { total_amount: true }
    });

    // Статистика по поставщикам
    const topSuppliers = await prisma.purchases.groupBy({
      by: ['supplier_id'],
      where: { company_id: companyId },
      _count: true,
      _sum: { total_amount: true },
      orderBy: { _sum: { total_amount: 'desc' } },
      take: 5
    });

    const stats = {
      total: totalCount,
      pending: statusStats.find(s => s.payment_status === 'PENDING')?._count || 0,
      paid: statusStats.find(s => s.payment_status === 'PAID')?._count || 0,
      overdue: statusStats.find(s => s.payment_status === 'OVERDUE')?._count || 0,
      cancelled: statusStats.find(s => s.payment_status === 'CANCELLED')?._count || 0,
      totalSpent: totalSpent._sum.total_amount || 0,
      averageOrderValue: avgOrderValue._avg.total_amount || 0,
      topSuppliers: topSuppliers.length
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
    const { 
      page = 1, 
      limit = 50, 
      search, 
      status, 
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

    if (status) {
      whereConditions.payment_status = status;
    }

    if (supplier_id) {
      whereConditions.supplier_id = parseInt(supplier_id);
    }

    if (date_from || date_to) {
      whereConditions.document_date = {};
      if (date_from) whereConditions.document_date.gte = new Date(date_from);
      if (date_to) whereConditions.document_date.lte = new Date(date_to);
    }

    // Получение данных
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

// ➕ POST /api/company/purchases - Создать новую покупку
const createPurchase = async (req, res) => {
  try {
    const companyId = req.companyContext?.companyId;
    const userId = req.user.id;
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

    logger.info(`➕ Creating purchase for company: ${companyId}`);

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

    // Расчёт сумм
    let subtotal = 0;
    let vat_amount = 0;

    const processedItems = items.map((item, index) => {
      const lineTotal = parseFloat(item.quantity) * parseFloat(item.unit_price_base);
      const vatAmount = lineTotal * (parseFloat(item.vat_rate || 0) / 100);
      
      subtotal += lineTotal;
      vat_amount += vatAmount;

      return {
        ...item,
        line_number: index + 1,
        line_total: lineTotal,
        vat_amount: vatAmount
      };
    });

    const total_amount = subtotal + vat_amount;

    // Создание покупки с элементами в транзакции
    const purchase = await prisma.$transaction(async (tx) => {
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
          created_by: userId
        }
      });

      // Создание элементов покупки
      if (processedItems.length > 0) {
        await tx.purchase_items.createMany({
          data: processedItems.map(item => ({
            purchase_id: newPurchase.id,
            product_id: parseInt(item.product_id),
            line_number: item.line_number,
            quantity: parseFloat(item.quantity),
            unit_price_base: parseFloat(item.unit_price_base),
            discount_percent: parseFloat(item.discount_percent || 0),
            vat_rate: parseFloat(item.vat_rate || 0),
            vat_amount: item.vat_amount,
            line_total: item.line_total,
            description: item.description || null,
            warehouse_id: item.warehouse_id ? parseInt(item.warehouse_id) : null,
            employee_id: item.employee_id ? parseInt(item.employee_id) : null
          }))
        });
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

    res.status(201).json({
      success: true,
      purchase: createdPurchase,
      message: 'Purchase created successfully',
      companyId
    });
  } catch (error) {
    logger.error('Error creating purchase:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating purchase'
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
            const lineTotal = parseFloat(item.quantity) * parseFloat(item.unit_price_base);
            const vatAmount = lineTotal * (parseFloat(item.vat_rate || 0) / 100);
            
            subtotal += lineTotal;
            vat_amount += vatAmount;

            return {
              purchase_id: parseInt(id),
              product_id: parseInt(item.product_id),
              line_number: index + 1,
              quantity: parseFloat(item.quantity),
              unit_price_base: parseFloat(item.unit_price_base),
              discount_percent: parseFloat(item.discount_percent || 0),
              vat_rate: parseFloat(item.vat_rate || 0),
              vat_amount: vatAmount,
              line_total: lineTotal,
              description: item.description || null,
              warehouse_id: item.warehouse_id ? parseInt(item.warehouse_id) : null,
              employee_id: item.employee_id ? parseInt(item.employee_id) : null
            };
          });

          await tx.purchase_items.createMany({
            data: processedItems
          });

          // Обновляем суммы в покупке
          await tx.purchases.update({
            where: { id: parseInt(id) },
            data: {
              subtotal,
              vat_amount,
              total_amount: subtotal + vat_amount
            }
          });
        }
      }

      return purchase;
    });

    // Получаем обновлённую покупку с связанными данными
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