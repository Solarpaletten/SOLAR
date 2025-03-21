const prismaManager = require('../utils/prismaManager');
const { logger } = require('../config/logger');

const getAllPurchases = async (req, res) => {
  try {
    const purchases = await prismaManager.prisma.purchases.findMany({
      where: { user_id: req.user.id },
      include: {
        client: true,
        warehouse: true,
      },
      orderBy: { doc_date: 'desc' },
    });
    res.json(purchases);
  } catch (error) {
    logger.error('Error fetching purchases:', error);
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
};

// Обновление функции создания закупки
const createPurchase = async (req, res) => {
  try {
    const {
      doc_number,
      doc_date,
      purchase_date,
      client_id,
      warehouse_id,
      total_amount,
      currency,
      status,
      invoice_type,
      invoice_number,
      vat_rate,
      items // Новое поле: массив позиций
    } = req.body;

    // Создаем закупку с позициями в одной транзакции
    const purchase = await prismaManager.prisma.$transaction(async (prisma) => {
      // Создание записи о закупке
      const newPurchase = await prisma.purchases.create({
        data: {
          doc_number,
          doc_date: new Date(doc_date),
          purchase_date: purchase_date ? new Date(purchase_date) : null,
          client_id: parseInt(client_id),
          warehouse_id: parseInt(warehouse_id),
          total_amount,
          currency,
          status: status || 'draft',
          invoice_type,
          invoice_number,
          vat_rate,
          user_id: req.user.id,
        },
      });
      
      // Если есть позиции, создаем их
      if (items && items.length > 0) {
        for (const item of items) {
          await prisma.purchase_items.create({
            data: {
              purchase_id: newPurchase.id,
              product_id: parseInt(item.product_id),
              quantity: parseFloat(item.quantity),
              unit_price: parseFloat(item.unit_price),
              amount: parseFloat(item.amount),
            }
          });
        }
      }
      
      // Возвращаем созданную закупку со всеми позициями
      return await prisma.purchases.findUnique({
        where: { id: newPurchase.id },
        include: {
          client: true,
          warehouse: true,
          items: {
            include: {
              product: true
            }
          }
        }
      });
    });

    res.status(201).json(purchase);
  } catch (error) {
    logger.error('Error creating purchase:', error);
    res.status(500).json({ error: 'Failed to create purchase' });
  }
};

// Обновление функции получения деталей закупки
const getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const purchase = await prismaManager.prisma.purchases.findFirst({
      where: {
        id: parseInt(id),
        user_id: req.user.id,
      },
      include: {
        client: true,
        warehouse: true,
        items: {
          include: {
            product: true
          }
        }
      },
    });

    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    res.json(purchase);
  } catch (error) {
    logger.error('Error fetching purchase:', error);
    res.status(500).json({ error: 'Failed to fetch purchase' });
  }
};

const updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Преобразование строковых дат в объекты Date
    if (updateData.doc_date) {
      updateData.doc_date = new Date(updateData.doc_date);
    }
    if (updateData.purchase_date) {
      updateData.purchase_date = new Date(updateData.purchase_date);
    }

    // Преобразование строковых ID в числа
    if (updateData.client_id) {
      updateData.client_id = parseInt(updateData.client_id);
    }
    if (updateData.warehouse_id) {
      updateData.warehouse_id = parseInt(updateData.warehouse_id);
    }

    const purchase = await prismaManager.prisma.purchases.updateMany({
      where: {
        id: parseInt(id),
        user_id: req.user.id,
      },
      data: updateData,
    });

    if (purchase.count === 0) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    res.json({ message: 'Purchase updated successfully' });
  } catch (error) {
    logger.error('Error updating purchase:', error);
    res.status(500).json({ error: 'Failed to update purchase' });
  }
};

const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await prismaManager.prisma.purchases.deleteMany({
      where: {
        id: parseInt(id),
        user_id: req.user.id,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting purchase:', error);
    res.status(500).json({ error: 'Failed to delete purchase' });
  }
};

module.exports = {
  getAllPurchases,
  createPurchase,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
};
