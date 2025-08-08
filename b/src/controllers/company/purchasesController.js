// f/src/controllers/company/purchasesController.js - Enhanced Version v2.0
const { PrismaClient } = require('@prisma/client');
const { prisma } = require('../../utils/prismaManager');
const { logger } = require('../../config/logger');

// 📊 GET /api/company/purchases/stats - Enhanced Statistics
const getPurchasesStats = async (req, res) => {
  try {
    const companyId = req.companyContext?.companyId;
    
    if (!companyId) {
      return res.status(400).json({
        success: false,
        error: 'Company context required'
      });
    }

    // Enhanced stats with new fields
    const [
      totalCount,
      statusCounts,
      financialStats,
      geographicStats,
      vatStats,
      lockStats
    ] = await Promise.all([
      // Total count
      prisma.purchases.count({
        where: { company_id: companyId }
      }),
      
      // Status breakdown
      prisma.purchases.groupBy({
        by: ['payment_status'],
        where: { company_id: companyId },
        _count: true,
        _sum: { total_amount: true }
      }),
      
      // Financial statistics
      prisma.purchases.aggregate({
        where: { company_id: companyId },
        _sum: {
          total_amount: true,
          vat_amount: true,
          advance_payment: true,
          discount_amount: true,
          balance_amount: true
        },
        _avg: {
          total_amount: true
        }
      }),
      
      // Geographic breakdown
      prisma.purchases.groupBy({
        by: ['country'],
        where: { 
          company_id: companyId,
          country: { not: null }
        },
        _count: true,
        _sum: { total_amount: true },
        orderBy: { _sum: { total_amount: 'desc' }},
        take: 5
      }),
      
      // VAT statistics
      prisma.purchases.groupBy({
        by: ['vat_classification'],
        where: { 
          company_id: companyId,
          vat_classification: { not: null }
        },
        _count: true,
        _sum: { vat_amount: true }
      }),
      
      // Lock statistics
      prisma.purchases.aggregate({
        where: { company_id: companyId },
        _count: {
          locked: true
        }
      })
    ]);

    // Process status counts
    const statusMap = {
      total: totalCount,
      pending: 0,
      paid: 0,
      partial: 0,
      overdue: 0,
      cancelled: 0,
      locked: lockStats._count.locked || 0
    };

    statusCounts.forEach(stat => {
      statusMap[stat.payment_status.toLowerCase()] = stat._count;
    });

    const stats = {
      ...statusMap,
      totalSpent: Number(financialStats._sum.total_amount || 0),
      averageOrderValue: Number(financialStats._avg.total_amount || 0),
      
      // Enhanced financial stats
      totalVAT: Number(financialStats._sum.vat_amount || 0),
      totalDiscounts: Number(financialStats._sum.discount_amount || 0),
      advancePayments: Number(financialStats._sum.advance_payment || 0),
      pendingAmount: Number(financialStats._sum.balance_amount || 0),
      
      // Geographic stats
      countriesCount: geographicStats.length,
      topCountries: geographicStats.map(stat => ({
        country: stat.country,
        count: stat._count,
        amount: Number(stat._sum.total_amount || 0)
      })),
      
      // VAT breakdown
      vatBreakdown: vatStats.map(stat => ({
        classification: stat.vat_classification,
        count: stat._count,
        vatAmount: Number(stat._sum.vat_amount || 0)
      }))
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
      error: 'Error fetching purchases statistics'
    });
  }
};

// 📋 GET /api/company/purchases - Enhanced List with Filtering
const getAllPurchases = async (req, res) => {
  try {
    const companyId = req.companyContext?.companyId;
    
    if (!companyId) {
      return res.status(400).json({
        success: false,
        error: 'Company context required'
      });
    }

    // Enhanced filtering parameters
    const {
      search,
      status,
      delivery_status,
      document_status,
      supplier_id,
      warehouse_id,
      country,
      city,
      currency,
      vat_classification,
      date_from,
      date_to,
      amount_from,
      amount_to,
      locked,
      sort_by = 'document_date',
      sort_order = 'desc',
      page = 1,
      limit = 50
    } = req.query;

    // Build enhanced WHERE clause
    const whereClause = {
      company_id: companyId,
      ...(search && {
        OR: [
          { document_number: { contains: search, mode: 'insensitive' } },
          { supplier: { name: { contains: search, mode: 'insensitive' } } },
          { supplier_code: { contains: search, mode: 'insensitive' } },
          { business_license_code: { contains: search, mode: 'insensitive' } },
          { comments: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(status && { payment_status: status }),
      ...(delivery_status && { delivery_status }),
      ...(document_status && { document_status }),
      ...(supplier_id && { supplier_id: parseInt(supplier_id) }),
      ...(warehouse_id && { warehouse_id: parseInt(warehouse_id) }),
      ...(country && { country: { contains: country, mode: 'insensitive' } }),
      ...(city && { city: { contains: city, mode: 'insensitive' } }),
      ...(currency && { currency }),
      ...(vat_classification && { vat_classification }),
      ...(date_from && { document_date: { gte: new Date(date_from) } }),
      ...(date_to && { document_date: { lte: new Date(date_to) } }),
      ...(amount_from && { total_amount: { gte: parseFloat(amount_from) } }),
      ...(amount_to && { total_amount: { lte: parseFloat(amount_to) } }),
      ...(locked !== undefined && { locked: locked === 'true' })
    };

    // Enhanced includes with new relations
    const include = {
      supplier: true,
      warehouse: true,
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
      locker: {
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
        }
      }
    };

    const [purchases, totalCount] = await Promise.all([
      prisma.purchases.findMany({
        where: whereClause,
        include,
        orderBy: { [sort_by]: sort_order },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit)
      }),
      prisma.purchases.count({ where: whereClause })
    ]);

    logger.info(`📋 Retrieved ${purchases.length} purchases for company: ${companyId}`);

    res.json({
      success: true,
      purchases,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit)),
        hasNext: parseInt(page) < Math.ceil(totalCount / parseInt(limit)),
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

// 🆕 POST /api/company/purchases - Enhanced Create
const createPurchase = async (req, res) => {
  try {
    const companyId = req.companyContext?.companyId;
    const userId = req.user?.id;
    
    if (!companyId || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Company context and user authentication required'
      });
    }

    const {
      document_date,
      due_date,
      operation_type,
      supplier_id,
      supplier_code,
      warehouse_id,
      purchase_manager_id,
      currency,
      foreign_currency,
      exchange_rate,
      country,
      city,
      business_license_code,
      delivery_method,
      vat_classification,
      vat_date,
      vat_comment,
      payment_status,
      delivery_status,
      document_status,
      advance_payment,
      discount_percent,
      discount_amount,
      additional_expenses,
      comments,
      items
    } = req.body;

    // Validate required fields
    if (!document_date || !supplier_id || !operation_type) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: document_date, supplier_id, operation_type'
      });
    }

    // Calculate financial totals
    let subtotal = 0;
    let vat_amount_total = 0;

    if (items && items.length > 0) {
      items.forEach(item => {
        const itemTotal = item.quantity * item.unit_price_base;
        const itemDiscount = item.discount_amount || 0;
        const itemSubtotal = itemTotal - itemDiscount;
        
        subtotal += itemSubtotal;
        vat_amount_total += (itemSubtotal * (item.vat_rate || 0)) / 100;
      });
    }

    const total_amount = subtotal + vat_amount_total;
    const total_excl_vat = subtotal;
    const balance_amount = total_amount - (advance_payment || 0);

    // Create purchase with transaction
    const purchase = await prisma.$transaction(async (tx) => {
      // Generate document number if not provided
      const documentNumber = `PUR-${Date.now()}`;

      const newPurchase = await tx.purchases.create({
        data: {
          company_id: companyId,
          document_number: documentNumber,
          document_date: new Date(document_date),
          due_date: due_date ? new Date(due_date) : null,
          operation_type: operation_type || 'PURCHASE',
          
          // Participants
          supplier_id: parseInt(supplier_id),
          supplier_code,
          warehouse_id: warehouse_id ? parseInt(warehouse_id) : null,
          purchase_manager_id: purchase_manager_id ? parseInt(purchase_manager_id) : null,
          
          // Financial totals
          subtotal,
          vat_amount: vat_amount_total,
          total_amount,
          total_excl_vat,
          advance_payment: advance_payment || 0,
          discount_percent: discount_percent || 0,
          discount_amount: discount_amount || 0,
          balance_amount,
          
          // Currency
          currency: currency || 'EUR',
          foreign_currency,
          exchange_rate: exchange_rate || 1,
          
          // Geographic
          country,
          city,
          
          // Business fields
          business_license_code,
          delivery_method,
          vat_classification,
          vat_date: vat_date ? new Date(vat_date) : null,
          vat_comment,
          
          // Status
          payment_status: payment_status || 'PENDING',
          delivery_status: delivery_status || 'PENDING',
          document_status: document_status || 'DRAFT',
          
          // Additional
          additional_expenses: additional_expenses || 0,
          comments,
          rounding_amount: 0,
          file_count: 0,
          locked: false,
          
          // Audit
          created_by: userId
        }
      });

      // Create purchase items if provided
      if (items && items.length > 0) {
        const processedItems = items.map((item, index) => {
          const itemTotal = item.quantity * item.unit_price_base;
          const itemDiscount = item.discount_amount || 0;
          const lineTotal = itemTotal - itemDiscount;
          const vatAmount = (lineTotal * (item.vat_rate || 0)) / 100;

          return {
            purchase_id: newPurchase.id,
            product_id: parseInt(item.product_id),
            line_number: index + 1,
            quantity: parseFloat(item.quantity),
            unit_price_base: parseFloat(item.unit_price_base),
            vat_rate: item.vat_rate ? parseFloat(item.vat_rate) : null,
            vat_amount: vatAmount,
            line_total: lineTotal,
            advance_payment: item.advance_payment || 0,
            discount_percent: item.discount_percent || 0,
            discount_amount: item.discount_amount || 0,
            business_license_code: item.business_license_code,
            employee_id: item.employee_id ? parseInt(item.employee_id) : null,
            notes: item.notes
          };
        });

        await tx.purchase_items.createMany({
          data: processedItems
        });
      }

      return newPurchase;
    });

    logger.info(`✅ Created purchase ${purchase.document_number} for company: ${companyId}`);

    // Fetch the complete purchase with relations
    const completePurchase = await prisma.purchases.findUnique({
      where: { id: purchase.id },
      include: {
        supplier: true,
        warehouse: true,
        purchase_manager: true,
        creator: true,
        items: {
          include: {
            product: true,
            employee: true
          }
        }
      }
    });

    res.json({
      success: true,
      purchase: completePurchase,
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

// 📝 GET /api/company/purchases/:id - Enhanced Get Single
const getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.companyContext?.companyId;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        error: 'Company context required'
      });
    }

    const purchase = await prisma.purchases.findFirst({
      where: {
        id: parseInt(id),
        company_id: companyId
      },
      include: {
        supplier: true,
        warehouse: true,
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
        locker: {
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

    logger.info(`📄 Retrieved purchase ${purchase.document_number} for company: ${companyId}`);

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

// ✏️ PUT /api/company/purchases/:id - Enhanced Update
const updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.companyContext?.companyId;
    const userId = req.user?.id;

    if (!companyId || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Company context and user authentication required'
      });
    }

    const {
      document_date,
      due_date,
      operation_type,
      supplier_id,
      supplier_code,
      warehouse_id,
      purchase_manager_id,
      currency,
      foreign_currency,
      exchange_rate,
      country,
      city,
      business_license_code,
      delivery_method,
      vat_classification,
      vat_date,
      vat_comment,
      payment_status,
      delivery_status,
      document_status,
      advance_payment,
      discount_percent,
      discount_amount,
      additional_expenses,
      comments,
      items
    } = req.body;

    // Check if purchase exists and belongs to company
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

    // Check if purchase is locked
    if (existingPurchase.locked) {
      return res.status(400).json({
        success: false,
        error: 'Cannot update locked purchase'
      });
    }

    // Calculate financial totals
    let subtotal = 0;
    let vat_amount_total = 0;

    if (items && items.length > 0) {
      items.forEach(item => {
        const itemTotal = item.quantity * item.unit_price_base;
        const itemDiscount = item.discount_amount || 0;
        const itemSubtotal = itemTotal - itemDiscount;
        
        subtotal += itemSubtotal;
        vat_amount_total += (itemSubtotal * (item.vat_rate || 0)) / 100;
      });
    }

    const total_amount = subtotal + vat_amount_total;
    const total_excl_vat = subtotal;
    const balance_amount = total_amount - (advance_payment || 0);

    // Update purchase with transaction
    const updatedPurchase = await prisma.$transaction(async (tx) => {
      const purchase = await tx.purchases.update({
        where: { id: parseInt(id) },
        data: {
          document_date: document_date ? new Date(document_date) : undefined,
          due_date: due_date ? new Date(due_date) : null,
          operation_type,
          
          // Participants
          supplier_id: supplier_id ? parseInt(supplier_id) : undefined,
          supplier_code,
          warehouse_id: warehouse_id ? parseInt(warehouse_id) : null,
          purchase_manager_id: purchase_manager_id ? parseInt(purchase_manager_id) : null,
          
          // Financial totals
          subtotal,
          vat_amount: vat_amount_total,
          total_amount,
          total_excl_vat,
          advance_payment: advance_payment || 0,
          discount_percent: discount_percent || 0,
          discount_amount: discount_amount || 0,
          balance_amount,
          
          // Currency
          currency,
          foreign_currency,
          exchange_rate: exchange_rate || 1,
          
          // Geographic
          country,
          city,
          
          // Business fields
          business_license_code,
          delivery_method,
          vat_classification,
          vat_date: vat_date ? new Date(vat_date) : null,
          vat_comment,
          
          // Status
          payment_status,
          delivery_status,
          document_status,
          
          // Additional
          additional_expenses: additional_expenses || 0,
          comments,
          
          // Audit
          updated_by: userId
        }
      });

      // Update purchase items
      if (items !== undefined) {
        // Delete existing items
        await tx.purchase_items.deleteMany({
          where: { purchase_id: parseInt(id) }
        });

        // Create new items
        if (items.length > 0) {
          const processedItems = items.map((item, index) => {
            const itemTotal = item.quantity * item.unit_price_base;
            const itemDiscount = item.discount_amount || 0;
            const lineTotal = itemTotal - itemDiscount;
            const vatAmount = (lineTotal * (item.vat_rate || 0)) / 100;

            return {
              purchase_id: parseInt(id),
              product_id: parseInt(item.product_id),
              line_number: index + 1,
              quantity: parseFloat(item.quantity),
              unit_price_base: parseFloat(item.unit_price_base),
              vat_rate: item.vat_rate ? parseFloat(item.vat_rate) : null,
              vat_amount: vatAmount,
              line_total: lineTotal,
              advance_payment: item.advance_payment || 0,
              discount_percent: item.discount_percent || 0,
              discount_amount: item.discount_amount || 0,
              business_license_code: item.business_license_code,
              employee_id: item.employee_id ? parseInt(item.employee_id) : null,
              notes: item.notes
            };
          });

          await tx.purchase_items.createMany({
            data: processedItems
          });
        }
      }

      return purchase;
    });

    logger.info(`✏️ Updated purchase ${updatedPurchase.document_number} for company: ${companyId}`);

    // Fetch the complete updated purchase
    const completePurchase = await prisma.purchases.findUnique({
      where: { id: parseInt(id) },
      include: {
        supplier: true,
        warehouse: true,
        purchase_manager: true,
        creator: true,
        modifier: true,
        items: {
          include: {
            product: true,
            employee: true
          }
        }
      }
    });

    res.json({
      success: true,
      purchase: completePurchase,
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

// 🗑️ DELETE /api/company/purchases/:id - Enhanced Delete
const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.companyContext?.companyId;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        error: 'Company context required'
      });
    }

    logger.info(`🗑️ Deleting purchase ${id} for company: ${companyId}`);

    // Check if purchase exists and belongs to company
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

    // Check if purchase is locked
    if (existingPurchase.locked) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete locked purchase'
      });
    }

    // Delete purchase (items will be deleted by CASCADE)
    await prisma.purchases.delete({
      where: { id: parseInt(id) }
    });

    logger.info(`✅ Deleted purchase ${existingPurchase.document_number} for company: ${companyId}`);

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

// 🔒 POST /api/company/purchases/:id/lock - Lock Purchase
const lockPurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.companyContext?.companyId;
    const userId = req.user?.id;

    if (!companyId || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Company context and user authentication required'
      });
    }

    const purchase = await prisma.purchases.update({
      where: {
        id: parseInt(id),
        company_id: companyId
      },
      data: {
        locked: true,
        locked_date: new Date(),
        locked_by: userId
      }
    });

    logger.info(`🔒 Locked purchase ${purchase.document_number} by user ${userId}`);

    res.json({
      success: true,
      message: 'Purchase locked successfully',
      companyId
    });
  } catch (error) {
    logger.error('Error locking purchase:', error);
    res.status(500).json({
      success: false,
      error: 'Error locking purchase'
    });
  }
};

// 🔓 POST /api/company/purchases/:id/unlock - Unlock Purchase
const unlockPurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.companyContext?.companyId;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        error: 'Company context required'
      });
    }

    const purchase = await prisma.purchases.update({
      where: {
        id: parseInt(id),
        company_id: companyId
      },
      data: {
        locked: false,
        locked_date: null,
        locked_by: null
      }
    });

    logger.info(`🔓 Unlocked purchase ${purchase.document_number}`);

    res.json({
      success: true,
      message: 'Purchase unlocked successfully',
      companyId
    });
  } catch (error) {
    logger.error('Error unlocking purchase:', error);
    res.status(500).json({
      success: false,
      error: 'Error unlocking purchase'
    });
  }
};

module.exports = {
  getPurchasesStats,
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
  lockPurchase,
  unlockPurchase
};