const prismaManager = require('../utils/prismaManager');
const { logger } = require('../config/logger');

const getAllSales = async (req, res) => {
  try {
    const sales = await prismaManager.prisma.sales.findMany({
      where: { user_id: req.user.id },
      include: {
        client: true,
        warehouse: true,
      },
      orderBy: { doc_date: 'desc' },
    });
    res.json(sales);
  } catch (error) {
    logger.error('Error fetching sales:', error);
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
};

const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await prismaManager.prisma.sales.findFirst({
      where: {
        id: parseInt(id),
        user_id: req.user.id,
      },
      include: {
        client: true,
        warehouse: true,
      },
    });

    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    res.json(sale);
  } catch (error) {
    logger.error('Error fetching sale:', error);
    res.status(500).json({ error: 'Failed to fetch sale' });
  }
};

const createSale = async (req, res) => {
  try {
    const {
      doc_number,
      doc_date,
      sale_date,
      client_id,
      warehouse_id,
      total_amount,
      currency,
      status,
      invoice_type,
      invoice_number,
      vat_rate,
    } = req.body;

    const sale = await prismaManager.prisma.sales.create({
      data: {
        doc_number,
        doc_date: new Date(doc_date),
        sale_date: sale_date ? new Date(sale_date) : null,
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

    res.status(201).json(sale);
  } catch (error) {
    logger.error('Error creating sale:', error);
    res.status(500).json({ error: 'Failed to create sale' });
  }
};

const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Преобразование строковых дат в объекты Date
    if (updateData.doc_date) {
      updateData.doc_date = new Date(updateData.doc_date);
    }
    if (updateData.sale_date) {
      updateData.sale_date = new Date(updateData.sale_date);
    }

    // Преобразование строковых ID в числа
    if (updateData.client_id) {
      updateData.client_id = parseInt(updateData.client_id);
    }
    if (updateData.warehouse_id) {
      updateData.warehouse_id = parseInt(updateData.warehouse_id);
    }

    const sale = await prismaManager.prisma.sales.updateMany({
      where: {
        id: parseInt(id),
        user_id: req.user.id,
      },
      data: updateData,
    });

    if (sale.count === 0) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    res.json({ message: 'Sale updated successfully' });
  } catch (error) {
    logger.error('Error updating sale:', error);
    res.status(500).json({ error: 'Failed to update sale' });
  }
};

const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await prismaManager.prisma.sales.deleteMany({
      where: {
        id: parseInt(id),
        user_id: req.user.id,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting sale:', error);
    res.status(500).json({ error: 'Failed to delete sale' });
  }
};

module.exports = {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
};
