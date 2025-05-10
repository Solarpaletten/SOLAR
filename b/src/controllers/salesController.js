const prismaManager = require('../utils/prismaManager');
const { logger } = require('../config/logger');
const { transformToApiFormat, transformToDbFormat } = require('../utils/apiUtils');
const { validateCreateSale, validateUpdateSale } = require('../validation/salesValidation');

const getAllSales = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      startDate,
      endDate,
      status,
      client_id,
      sortBy = 'doc_date',
      sortOrder = 'desc',
      minAmount,
      maxAmount,
      archived
    } = req.query;

    // Формируем условия фильтрации
    const where = { user_id: req.user.id };

    // Поиск по нескольким полям
    if (search) {
      where.OR = [
        { doc_number: { contains: search, mode: 'insensitive' } },
        { invoice_number: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Фильтр по диапазону дат
    if (startDate || endDate) {
      where.doc_date = {};
      if (startDate) where.doc_date.gte = new Date(startDate);
      if (endDate) where.doc_date.lte = new Date(endDate);
    }

    // Фильтр по статусу
    if (status) {
      where.status = status;
    }

    // Фильтр по клиенту
    if (client_id) {
      where.client_id = parseInt(client_id);
    }

    // Фильтр по сумме
    if (minAmount || maxAmount) {
      where.total_amount = {};
      if (minAmount) where.total_amount.gte = parseFloat(minAmount);
      if (maxAmount) where.total_amount.lte = parseFloat(maxAmount);
    }

    // Определяем сортировку
    const orderBy = { [sortBy]: sortOrder };

    // Получаем общее количество записей
    const totalCount = await prismaManager.prisma.sales.count({ where });

    // Получаем данные с пагинацией
    const sales = await prismaManager.prisma.sales.findMany({
      where,
      include: {
        client: true,
        warehouse: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy,
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit)
    });

    // Преобразуем данные в API формат (ID как строки и camelCase)
    const apiData = transformToApiFormat(sales);

    res.json({
      data: apiData,
      totalCount,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalCount / parseInt(limit))
    });
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
    // Преобразуем данные из camelCase в snake_case если нужно
    const dbData = transformToDbFormat(req.body);

    // Валидация входных данных
    const validation = validateCreateSale(dbData);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

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
      items // Массив позиций
    } = dbData;

    // Создаем продажу с позициями в одной транзакции
    const sale = await prismaManager.prisma.$transaction(async (prisma) => {
      // Создание записи о продаже
      const newSale = await prisma.sales.create({
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

      // Если есть позиции, создаем их
      if (items && items.length > 0) {
        for (const item of items) {
          await prisma.sale_items.create({
            data: {
              sale_id: newSale.id,
              product_id: parseInt(item.product_id),
              quantity: parseFloat(item.quantity),
              unit_price: parseFloat(item.unit_price),
              amount: parseFloat(item.amount),
              vat: item.vat ? parseFloat(item.vat) : null,
            }
          });
        }
      }

      // Возвращаем созданную продажу со всеми позициями
      return await prisma.sales.findUnique({
        where: { id: newSale.id },
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

    // Преобразуем данные в API формат
    const apiData = transformToApiFormat(sale);

    res.status(201).json(apiData);
  } catch (error) {
    logger.error('Error creating sale:', error);
    res.status(500).json({ error: 'Failed to create sale' });
  }
};

const updateSale = async (req, res) => {
  try {
    const { id } = req.params;

    // Преобразуем данные из camelCase в snake_case если нужно
    const dbData = transformToDbFormat(req.body);

    // Валидация входных данных
    const validation = validateUpdateSale(dbData);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const updateData = dbData;

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
