const salesController = require('../../src/controllers/salesController');
const prismaManager = require('../../src/utils/prismaManager');
const { logger } = require('../../src/config/logger');

// Мокируем req и res объекты для тестов
const mockRequest = () => {
  const req = {};
  req.body = jest.fn().mockReturnValue(req);
  req.params = jest.fn().mockReturnValue(req);
  req.query = jest.fn().mockReturnValue(req);
  req.user = { id: 1 }; // Мокируем авторизованного пользователя
  return req;
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('Sales Controller', () => {
  // Общие моки и переменные для тестов
  let req, res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
  });

  describe('getAllSales', () => {
    it('should return sales list with pagination', async () => {
      // Подготовка моков
      const mockSalesList = [
        { id: 1, doc_number: 'SALE-001', total_amount: 100 },
        { id: 2, doc_number: 'SALE-002', total_amount: 200 }
      ];
      
      req.query = {
        page: '1',
        limit: '10'
      };
      
      prismaManager.prisma.sales.count.mockResolvedValue(2);
      prismaManager.prisma.sales.findMany.mockResolvedValue(mockSalesList);
      
      // Вызов тестируемого метода
      await salesController.getAllSales(req, res);
      
      // Проверки
      expect(prismaManager.prisma.sales.count).toHaveBeenCalled();
      expect(prismaManager.prisma.sales.findMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
      
      // Проверяем структуру ответа
      const responseData = res.json.mock.calls[0][0];
      expect(responseData).toHaveProperty('data');
      expect(responseData).toHaveProperty('totalCount');
      expect(responseData).toHaveProperty('page');
      expect(responseData).toHaveProperty('limit');
      expect(responseData).toHaveProperty('totalPages');
    });

    it('should handle error when fetching sales', async () => {
      // Мокируем ошибку в Prisma
      prismaManager.prisma.sales.count.mockRejectedValue(new Error('Database error'));
      
      // Вызов тестируемого метода
      await salesController.getAllSales(req, res);
      
      // Проверки
      expect(logger.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch sales' });
    });
  });

  describe('createSale', () => {
    it('should create a new sale with items', async () => {
      // Подготовка моков
      const mockSaleData = {
        doc_number: 'SALE-001',
        doc_date: '2023-05-09',
        client_id: '1',
        warehouse_id: '1',
        total_amount: 100,
        currency: 'EUR',
        status: 'draft',
        invoice_number: 'INV-001',
        items: [
          {
            product_id: '1',
            quantity: 2,
            unit_price: 50,
            amount: 100
          }
        ]
      };
      
      const mockCreatedSale = {
        id: 1,
        ...mockSaleData,
        client: { name: 'Test Client' },
        warehouse: { name: 'Test Warehouse' },
        items: [
          {
            id: 1,
            sale_id: 1,
            product_id: 1,
            quantity: 2,
            unit_price: 50,
            amount: 100,
            product: { name: 'Test Product' }
          }
        ]
      };
      
      req.body = mockSaleData;
      
      // Мокируем результат транзакции
      prismaManager.prisma.$transaction.mockImplementation(callback => {
        return Promise.resolve(mockCreatedSale);
      });
      
      // Вызов тестируемого метода
      await salesController.createSale(req, res);
      
      // Проверки
      expect(prismaManager.prisma.$transaction).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return validation errors for invalid input', async () => {
      // Подготовка моков - намеренно некорректные данные
      const invalidSaleData = {
        // Отсутствуют обязательные поля
        status: 'draft'
      };
      
      req.body = invalidSaleData;
      
      // Вызов тестируемого метода
      await salesController.createSale(req, res);
      
      // Проверки
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0]).toHaveProperty('errors');
      expect(Array.isArray(res.json.mock.calls[0][0].errors)).toBe(true);
    });

    it('should handle error during sale creation', async () => {
      // Подготовка моков
      const mockSaleData = {
        doc_number: 'SALE-001',
        doc_date: '2023-05-09',
        client_id: '1',
        warehouse_id: '1',
        total_amount: 100,
        currency: 'EUR',
        status: 'draft',
        invoice_number: 'INV-001',
        items: []
      };
      
      req.body = mockSaleData;
      
      // Мокируем ошибку в транзакции
      prismaManager.prisma.$transaction.mockRejectedValue(new Error('Database error'));
      
      // Вызов тестируемого метода
      await salesController.createSale(req, res);
      
      // Проверки
      expect(logger.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create sale' });
    });
  });
});