const prismaManager = require('../utils/prismaManager');
const { logger } = require('../config/logger');
// const multer = require('multer');
// const Papa = require('papaparse');
// const XLSX = require('xlsx');
// const path = require('path');

// // Настройка multer для загрузки файлов
// const storage = multer.memoryStorage();
// const upload = multer({ 
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024 // 10MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ['.csv', '.xlsx', '.xls'];
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (allowedTypes.includes(ext)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Неподдерживаемый формат файла. Разрешены только CSV и Excel файлы.'), false);
//     }
//   }
// });

// Получение всех банковских операций
const getAllOperations = async (req, res) => {
  try {
    const company_id = 1; // ВРЕМЕННО
    const limit = parseInt(req.query.limit) || 100; // Лимит из параметров или 100
    const offset = parseInt(req.query.offset) || 0;  // Пагинация
    
    logger.info(`Getting bank operations for company ${company_id}, limit: ${limit}, offset: ${offset}`);
    
    const operations = await prismaManager.prisma.bank_operations.findMany({
      where: {
        company_id: company_id
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      },
      take: Math.min(limit, 500), // Максимум 500 записей за раз
      skip: offset
    });
    
    // Получаем общее количество для пагинации
    const totalCount = await prismaManager.prisma.bank_operations.count({
      where: { company_id: company_id }
    });
    
    logger.info(`Found ${operations.length} operations out of ${totalCount} total`);
    
    res.json({
      operations,
      pagination: {
        total: totalCount,
        limit: limit,
        offset: offset,
        hasMore: (offset + operations.length) < totalCount
      }
    });
    
  } catch (error) {
    logger.error('Error getting bank operations:', error);
    
    // В продакшене не показываем детали ошибки
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    res.status(500).json({ 
      error: 'Failed to fetch bank operations',
      ...(isDevelopment && { details: error.message })
    });
  }
};

// Получение операции по ID
const getOperationById = async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = 1; // ВРЕМЕННО
    
    const operation = await prismaManager.prisma.bank_operations.findFirst({
      where: {
        id: parseInt(id),
        company_id: company_id
      },
      include: {
        client: true,
        users: {
          select: {
            id: true,
            email: true,
            username: true
          }
        }
      }
    });
    
    if (!operation) {
      return res.status(404).json({ error: 'Operation not found' });
    }
    
    res.json(operation);
  } catch (error) {
    logger.error('Error fetching operation:', error);
    res.status(500).json({ error: 'Failed to fetch operation' });
  }
};

// Создание банковской операции
const createOperation = async (req, res) => {
  try {
    const {
      date, description, amount, type, account_id, client_id
    } = req.body;
    
    const company_id = 1; // ВРЕМЕННО
    const user_id = 1;    // ВРЕМЕННО
    
    const operation = await prismaManager.prisma.bank_operations.create({
      data: {
        date: new Date(date),
        description,
        amount: parseFloat(amount),
        type, // 'debit' или 'credit'
        account_id: account_id ? parseInt(account_id) : 1,
        company_id: company_id,
        user_id: user_id,
        client_id: client_id ? parseInt(client_id) : null,
      },
      include: {
        client: true
      }
    });
    
    res.status(201).json(operation);
  } catch (error) {
    logger.error('Error creating operation:', error);
    res.status(500).json({ error: 'Failed to create operation' });
  }
};

// Обновление банковской операции
const updateOperation = async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = 1; // ВРЕМЕННО
    const updateData = { ...req.body };
    
    // Преобразуем дату если она есть
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }
    
    // Преобразуем числовые поля
    if (updateData.amount) {
      updateData.amount = parseFloat(updateData.amount);
    }
    if (updateData.account_id) {
      updateData.account_id = parseInt(updateData.account_id);
    }
    if (updateData.client_id) {
      updateData.client_id = parseInt(updateData.client_id);
    }
    
    const operation = await prismaManager.prisma.bank_operations.updateMany({
      where: {
        id: parseInt(id),
        company_id: company_id
      },
      data: updateData,
    });
    
    if (operation.count === 0) {
      return res.status(404).json({ error: 'Operation not found' });
    }
    
    // Возвращаем обновленную операцию
    const updatedOperation = await prismaManager.prisma.bank_operations.findFirst({
      where: {
        id: parseInt(id),
        company_id: company_id
      },
      include: {
        client: true
      }
    });
    
    res.json(updatedOperation);
  } catch (error) {
    logger.error('Error updating operation:', error);
    res.status(500).json({ error: 'Failed to update operation' });
  }
};

// Удаление банковской операции
const deleteOperation = async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = 1; // ВРЕМЕННО
    
    const result = await prismaManager.prisma.bank_operations.deleteMany({
      where: {
        id: parseInt(id),
        company_id: company_id
      },
    });
    
    if (result.count === 0) {
      return res.status(404).json({ error: 'Operation not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting operation:', error);
    res.status(500).json({ error: 'Failed to delete operation' });
  }
};

// Функция для парсинга CSV файла
const parseCSV = (buffer) => {
  const csvText = buffer.toString('utf8');
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

// Функция для парсинга Excel файла
const parseExcel = (buffer) => {
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    return data;
  } catch (error) {
    throw new Error('Ошибка при чтении Excel файла: ' + error.message);
  }
};

// Функция для нормализации данных из файла
const normalizeOperationData = (row) => {
  // Пытаемся найти нужные поля в разных форматах
  const possibleDateFields = ['date', 'Date', 'Дата', 'дата', 'VALUE DATE', 'Transaction Date'];
  const possibleDescriptionFields = ['description', 'Description', 'Описание', 'описание', 'DESCRIPTION', 'Назначение платежа'];
  const possibleAmountFields = ['amount', 'Amount', 'Сумма', 'сумма', 'AMOUNT', 'Debit', 'Credit'];
  const possibleTypeFields = ['type', 'Type', 'Тип', 'тип', 'TYPE'];
  
  let date = null;
  let description = '';
  let amount = 0;
  let type = 'debit';
  
  // Ищем дату
  for (const field of possibleDateFields) {
    if (row[field]) {
      date = new Date(row[field]);
      break;
    }
  }
  
  // Ищем описание
  for (const field of possibleDescriptionFields) {
    if (row[field]) {
      description = row[field].toString();
      break;
    }
  }
  
  // Ищем сумму
  for (const field of possibleAmountFields) {
    if (row[field] && row[field] !== '') {
      const rawAmount = row[field].toString().replace(/[^\d.-]/g, '');
      amount = parseFloat(rawAmount) || 0;
      
      // Определяем тип операции по знаку или названию поля
      if (field.toLowerCase().includes('credit') || amount > 0) {
        type = 'credit';
      } else if (field.toLowerCase().includes('debit') || amount < 0) {
        type = 'debit';
        amount = Math.abs(amount);
      }
      break;
    }
  }
  
  // Ищем тип операции отдельно
  for (const field of possibleTypeFields) {
    if (row[field]) {
      const typeValue = row[field].toString().toLowerCase();
      if (typeValue.includes('credit') || typeValue.includes('поступление')) {
        type = 'credit';
      } else if (typeValue.includes('debit') || typeValue.includes('расход')) {
        type = 'debit';
      }
      break;
    }
  }
  
  return {
    date,
    description,
    amount,
    type
  };
};

// Функция для автоматического сопоставления с клиентами
const matchClient = async (description, company_id) => {
  try {
    // Получаем всех клиентов компании
    const clients = await prismaManager.prisma.clients.findMany({
      where: { company_id: company_id },
      select: { id: true, name: true, code: true, vat_code: true }
    });
    
    const descLower = description.toLowerCase();
    
    // Ищем по точному совпадению названия
    let match = clients.find(client => 
      client.name && descLower.includes(client.name.toLowerCase())
    );
    
    // Ищем по коду клиента
    if (!match) {
      match = clients.find(client => 
        client.code && descLower.includes(client.code.toLowerCase())
      );
    }
    
    // Ищем по НДС номеру
    if (!match) {
      match = clients.find(client => 
        client.vat_code && descLower.includes(client.vat_code.toLowerCase())
      );
    }
    
    return match ? match.id : null;
  } catch (error) {
    logger.error('Error matching client:', error);
    return null;
  }
};

// Загрузка и обработка банковской выписки
const uploadBankStatement = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }
    
    const company_id = 1; // ВРЕМЕННО
    const user_id = 1;    // ВРЕМЕННО
    const file = req.file;
    
    logger.info(`Processing bank statement file: ${file.originalname}`);
    
    let parsedData = [];
    
    // Парсим файл в зависимости от типа
    if (file.originalname.endsWith('.csv')) {
      parsedData = await parseCSV(file.buffer);
    } else if (file.originalname.endsWith('.xlsx') || file.originalname.endsWith('.xls')) {
      parsedData = parseExcel(file.buffer);
    } else {
      return res.status(400).json({ error: 'Неподдерживаемый формат файла' });
    }
    
    if (!parsedData || parsedData.length === 0) {
      return res.status(400).json({ error: 'Файл не содержит данных или имеет неправильный формат' });
    }
    
    logger.info(`Parsed ${parsedData.length} rows from file`);
    
    // Обрабатываем и сохраняем операции
    const operations = [];
    let processedCount = 0;
    let errorCount = 0;
    
    for (const row of parsedData) {
      try {
        const normalized = normalizeOperationData(row);
        
        // Пропускаем строки без даты или суммы
        if (!normalized.date || isNaN(normalized.date.getTime()) || normalized.amount === 0) {
          continue;
        }
        
        // Ищем соответствующего клиента
        const clientId = await matchClient(normalized.description, company_id);
        
        const operation = {
          date: normalized.date,
          description: normalized.description || 'Банковская операция',
          amount: Math.abs(normalized.amount),
          type: normalized.type,
          account_id: 1, // Временно используем account_id = 1
          company_id: company_id,
          user_id: user_id,
          client_id: clientId,
        };
        
        operations.push(operation);
        processedCount++;
        
      } catch (error) {
        logger.error('Error processing row:', error);
        errorCount++;
      }
    }
    
    // Массовое создание операций
    if (operations.length > 0) {
      await prismaManager.prisma.bank_operations.createMany({
        data: operations,
        skipDuplicates: true
      });
    }
    
    res.json({
      success: true,
      processed: processedCount,
      errors: errorCount,
      total: parsedData.length,
      message: `Обработано ${processedCount} операций из ${parsedData.length} строк`
    });
    
  } catch (error) {
    logger.error('Error uploading bank statement:', error);
    res.status(500).json({ 
      error: 'Ошибка при обработке файла',
      details: error.message 
    });
  }
};

// Статистика банковских операций
const getOperationsStats = async (req, res) => {
  try {
    const company_id = 1; // ВРЕМЕННО
    
    logger.info('Getting bank operations stats for company:', company_id);
    
    // Общее количество операций  
    const totalOperations = await prismaManager.prisma.bank_operations.count({
      where: { company_id: company_id }
    });
    
    // Статистика по типам (только если есть операции)
    let typeStats = [];
    if (totalOperations > 0) {
      typeStats = await prismaManager.prisma.bank_operations.groupBy({
        by: ['type'],
        where: { company_id: company_id },
        _sum: { amount: true },
        _count: { id: true }
      });
    }
    
    // Общая сумма всех операций
    const totalAmount = await prismaManager.prisma.bank_operations.aggregate({
      where: { company_id: company_id },
      _sum: { amount: true }
    });
    
    // Операции за последний месяц
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const monthlyOperations = await prismaManager.prisma.bank_operations.count({
      where: { 
        company_id: company_id,
        date: { gte: lastMonth }
      }
    });
    
    const result = {
      total: totalOperations,
      totalAmount: totalAmount._sum.amount || 0,
      monthlyOperations: monthlyOperations,
      by_type: typeStats
    };
    
    logger.info('Bank stats result:', result);
    res.json(result);
    
  } catch (error) {
    logger.error('Error fetching bank operations stats:', error);
    res.status(500).json({ error: 'Failed to fetch bank operations stats' });
  }
};

module.exports = {
  getAllOperations,
  getOperationById,
  createOperation,
  updateOperation,
  deleteOperation,
  getOperationsStats
  // uploadBankStatement, // Раскомментировать когда установим зависимости
};