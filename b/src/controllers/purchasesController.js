const prismaManager = require('../utils/prismaManager');
const { logger } = require('../config/logger');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const csv = require('csv-parser');
const { transformToApiFormat, transformToDbFormat } = require('../utils/apiUtils');

// Получить список всех закупок с пагинацией и фильтрацией
const getAllPurchases = async (req, res) => {
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

    // Фильтр по поставщику
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
    const totalCount = await prismaManager.prisma.purchases.count({ where });

    // Получаем данные с пагинацией
    const purchases = await prismaManager.prisma.purchases.findMany({
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
    const apiData = transformToApiFormat(purchases);

    res.json({
      data: apiData,
      totalCount,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalCount / parseInt(limit))
    });
  } catch (error) {
    logger.error('Error fetching purchases:', error);
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
};

// Получить закупку по ID
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

    // Преобразуем данные в API формат
    const apiData = transformToApiFormat(purchase);

    res.json(apiData);
  } catch (error) {
    logger.error('Error fetching purchase:', error);
    res.status(500).json({ error: 'Failed to fetch purchase' });
  }
};

// Создать новую закупку
const createPurchase = async (req, res) => {
  try {
    // Преобразуем данные из camelCase в snake_case
    const dbData = transformToDbFormat(req.body);
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
      items // Массив позиций
    } = dbData;

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

    // Преобразуем данные в API формат
    const apiData = transformToApiFormat(purchase);

    res.status(201).json(apiData);
  } catch (error) {
    logger.error('Error creating purchase:', error);
    res.status(500).json({ error: 'Failed to create purchase' });
  }
};

// Обновить существующую закупку
const updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    // Преобразуем данные из camelCase в snake_case
    const dbData = transformToDbFormat(req.body);

    // Преобразование строковых дат в объекты Date
    if (dbData.doc_date) {
      dbData.doc_date = new Date(dbData.doc_date);
    }
    if (dbData.purchase_date) {
      dbData.purchase_date = new Date(dbData.purchase_date);
    }

    // Преобразование строковых ID в числа
    if (dbData.client_id) {
      dbData.client_id = parseInt(dbData.client_id);
    }
    if (dbData.warehouse_id) {
      dbData.warehouse_id = parseInt(dbData.warehouse_id);
    }

    // Получаем обновленные данные
    const updated = await prismaManager.prisma.purchases.updateMany({
      where: {
        id: parseInt(id),
        user_id: req.user.id,
      },
      data: dbData,
    });

    if (updated.count === 0) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    // Получаем обновленную закупку
    const purchase = await prismaManager.prisma.purchases.findUnique({
      where: { id: parseInt(id) },
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

    // Преобразуем данные в API формат
    const apiData = transformToApiFormat(purchase);

    res.json(apiData);
  } catch (error) {
    logger.error('Error updating purchase:', error);
    res.status(500).json({ error: 'Failed to update purchase' });
  }
};

// Удалить закупку
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

// Обновить статус закупки
const updatePurchaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Проверяем, что закупка существует и принадлежит пользователю
    const purchase = await prismaManager.prisma.purchases.findFirst({
      where: {
        id: parseInt(id),
        user_id: req.user.id,
      },
    });

    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    // Обновляем статус
    const updated = await prismaManager.prisma.purchases.update({
      where: { id: parseInt(id) },
      data: { status },
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

    // Преобразуем данные в API формат
    const apiData = transformToApiFormat(updated);

    res.json(apiData);
  } catch (error) {
    logger.error('Error updating purchase status:', error);
    res.status(500).json({ error: 'Failed to update purchase status' });
  }
};

// Экспорт закупок в CSV
const exportPurchasesToCSV = async (req, res) => {
  try {
    // Получаем закупки пользователя
    const purchases = await prismaManager.prisma.purchases.findMany({
      where: { user_id: req.user.id },
      include: {
        client: true,
        warehouse: true
      },
      orderBy: { doc_date: 'desc' }
    });

    if (purchases.length === 0) {
      return res.status(404).json({ error: 'No purchases found to export' });
    }

    // Преобразуем данные для экспорта
    const dataToExport = purchases.map(purchase => ({
      id: purchase.id.toString(),
      doc_number: purchase.doc_number,
      doc_date: purchase.doc_date.toISOString().split('T')[0],
      purchase_date: purchase.purchase_date ? purchase.purchase_date.toISOString().split('T')[0] : '',
      supplier: purchase.client.name,
      warehouse: purchase.warehouse.name,
      total_amount: purchase.total_amount.toString(),
      currency: purchase.currency,
      status: purchase.status,
      invoice_number: purchase.invoice_number
    }));

    // Настройка полей для CSV
    const fields = [
      { label: 'ID', value: 'id' },
      { label: 'Document Number', value: 'doc_number' },
      { label: 'Document Date', value: 'doc_date' },
      { label: 'Purchase Date', value: 'purchase_date' },
      { label: 'Supplier', value: 'supplier' },
      { label: 'Warehouse', value: 'warehouse' },
      { label: 'Total Amount', value: 'total_amount' },
      { label: 'Currency', value: 'currency' },
      { label: 'Status', value: 'status' },
      { label: 'Invoice Number', value: 'invoice_number' }
    ];

    // Опции для CSV парсера
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(dataToExport);

    // Настройка заголовков ответа
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=purchases.csv');

    // Отправка CSV в ответе
    res.send(csv);
  } catch (error) {
    logger.error('Error exporting purchases to CSV:', error);
    res.status(500).json({ error: 'Failed to export purchases to CSV' });
  }
};

// Настройка хранилища для загрузки CSV
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/csv');
    // Создаем директорию, если не существует
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `import_${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

// Импорт закупок из CSV
const importPurchasesFromCSV = async (req, res) => {
  // Используем middleware для обработки загрузки файла
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: 'Error uploading file' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const results = [];
      const errors = [];

      // Парсим CSV файл
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          // Обработка каждой строки CSV
          for (const row of results) {
            try {
              // Подготавливаем данные для создания закупки
              const purchaseData = {
                doc_number: row.doc_number,
                doc_date: row.doc_date ? new Date(row.doc_date) : new Date(),
                purchase_date: row.purchase_date ? new Date(row.purchase_date) : null,
                total_amount: parseFloat(row.total_amount),
                currency: row.currency || 'EUR',
                status: row.status || 'draft',
                invoice_number: row.invoice_number,
                user_id: req.user.id
              };

              // Находим или создаем поставщика
              let client_id;
              if (row.supplier) {
                const supplier = await prismaManager.prisma.clients.findFirst({
                  where: {
                    name: { contains: row.supplier, mode: 'insensitive' },
                    user_id: req.user.id
                  }
                });

                if (supplier) {
                  client_id = supplier.id;
                } else {
                  errors.push(`Supplier not found: ${row.supplier}`);
                  continue;
                }
              } else {
                errors.push('Supplier name is required');
                continue;
              }

              // Находим или используем дефолтный склад
              let warehouse_id;
              if (row.warehouse) {
                const warehouse = await prismaManager.prisma.warehouses.findFirst({
                  where: {
                    name: { contains: row.warehouse, mode: 'insensitive' },
                    user_id: req.user.id
                  }
                });

                if (warehouse) {
                  warehouse_id = warehouse.id;
                } else {
                  errors.push(`Warehouse not found: ${row.warehouse}`);
                  continue;
                }
              } else {
                // Используем первый доступный склад
                const defaultWarehouse = await prismaManager.prisma.warehouses.findFirst({
                  where: { user_id: req.user.id }
                });

                if (defaultWarehouse) {
                  warehouse_id = defaultWarehouse.id;
                } else {
                  errors.push('No warehouse available');
                  continue;
                }
              }

              // Создаем закупку
              await prismaManager.prisma.purchases.create({
                data: {
                  ...purchaseData,
                  client_id,
                  warehouse_id
                }
              });
            } catch (error) {
              errors.push(`Error importing row: ${error.message}`);
            }
          }

          // Удаляем временный файл
          fs.unlinkSync(req.file.path);

          // Возвращаем результат
          res.json({
            success: true,
            imported: results.length - errors.length,
            errors: errors.length > 0 ? errors : null
          });
        });
    } catch (error) {
      // Удаляем временный файл в случае ошибки
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      logger.error('Error importing purchases from CSV:', error);
      res.status(500).json({ error: 'Failed to import purchases from CSV' });
    }
  });
};

// Получить список поставщиков
const getSuppliersList = async (req, res) => {
  try {
    const suppliers = await prismaManager.prisma.clients.findMany({
      where: {
        user_id: req.user.id,
        role: 'SUPPLIER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        code: true
      },
      orderBy: { name: 'asc' }
    });

    // Преобразуем данные в API формат
    const apiData = transformToApiFormat(suppliers);

    res.json(apiData);
  } catch (error) {
    logger.error('Error fetching suppliers list:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers list' });
  }
};

module.exports = {
  getAllPurchases,
  createPurchase,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
  updatePurchaseStatus,
  exportPurchasesToCSV,
  importPurchasesFromCSV,
  getSuppliersList
};