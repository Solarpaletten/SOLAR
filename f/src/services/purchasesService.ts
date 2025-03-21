import axios from 'axios';
import { Purchase, PurchaseItem, PurchaseFilter, PurchaseStatus } from '../types/purchasesTypes';
import { api } from '../api/axios';

/**
 * Интерфейс ответа API для списка закупок
 */
interface PurchasesResponse {
  data: Purchase[];
  totalCount: number;
  page: number;
  limit: number;
}

/**
 * Интерфейс ответа API для одной закупки
 */
interface PurchaseResponse {
  data: Purchase;
}

/**
 * Сервис для работы с закупками
 */
const purchasesService = {
  /**
   * Получение списка закупок с фильтрацией и пагинацией
   */
  async getPurchases(filters?: PurchaseFilter): Promise<PurchasesResponse> {
    try {
      const params = {
        page: filters?.page || 1,
        limit: filters?.limit || 10,
        search: filters?.search || '',
        startDate: filters?.startDate || '',
        endDate: filters?.endDate || '',
        status: filters?.status || '',
        vendor: filters?.vendor || '',
        sortBy: filters?.sortBy || 'date',
        sortOrder: filters?.sortOrder || 'desc'
      };

      const response = await api.get<PurchasesResponse>('/purchases', { params });
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении списка закупок:', error);
      throw error;
    }
  },

  /**
   * Получение деталей одной закупки по ID
   */
  async getPurchaseById(id: string): Promise<Purchase> {
    try {
      const response = await api.get<PurchaseResponse>(`/purchases/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Ошибка при получении закупки с ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Создание новой закупки
   */
  async createPurchase(purchaseData: Omit<Purchase, 'id' | 'createdAt' | 'updatedAt'>): Promise<Purchase> {
    try {
      const response = await api.post<PurchaseResponse>('/purchases', purchaseData);
      return response.data.data;
    } catch (error) {
      console.error('Ошибка при создании закупки:', error);
      throw error;
    }
  },

  /**
   * Обновление существующей закупки
   */
  async updatePurchase(id: string, purchaseData: Partial<Purchase>): Promise<Purchase> {
    try {
      const response = await api.put<PurchaseResponse>(`/purchases/${id}`, purchaseData);
      return response.data.data;
    } catch (error) {
      console.error(`Ошибка при обновлении закупки с ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Удаление закупки
   */
  async deletePurchase(id: string): Promise<void> {
    try {
      await api.delete(`/purchases/${id}`);
    } catch (error) {
      console.error(`Ошибка при удалении закупки с ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Обновление статуса закупки
   */
  async updatePurchaseStatus(id: string, status: PurchaseStatus): Promise<Purchase> {
    try {
      const response = await api.patch<PurchaseResponse>(`/purchases/${id}/status`, { status });
      return response.data.data;
    } catch (error) {
      console.error(`Ошибка при обновлении статуса закупки с ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Добавление позиции к закупке
   */
  async addPurchaseItem(purchaseId: string, item: Omit<PurchaseItem, 'id'>): Promise<PurchaseItem> {
    try {
      const response = await api.post<{ data: PurchaseItem }>(`/purchases/${purchaseId}/items`, item);
      return response.data.data;
    } catch (error) {
      console.error(`Ошибка при добавлении позиции к закупке с ID ${purchaseId}:`, error);
      throw error;
    }
  },

  /**
   * Обновление позиции закупки
   */
  async updatePurchaseItem(purchaseId: string, itemId: string, itemData: Partial<PurchaseItem>): Promise<PurchaseItem> {
    try {
      const response = await api.put<{ data: PurchaseItem }>(`/purchases/${purchaseId}/items/${itemId}`, itemData);
      return response.data.data;
    } catch (error) {
      console.error(`Ошибка при обновлении позиции ${itemId} закупки ${purchaseId}:`, error);
      throw error;
    }
  },

  /**
   * Удаление позиции из закупки
   */
  async deletePurchaseItem(purchaseId: string, itemId: string): Promise<void> {
    try {
      await api.delete(`/purchases/${purchaseId}/items/${itemId}`);
    } catch (error) {
      console.error(`Ошибка при удалении позиции ${itemId} из закупки ${purchaseId}:`, error);
      throw error;
    }
  },

  /**
   * Экспорт закупок в CSV
   */
  async exportPurchasesToCSV(filters?: PurchaseFilter): Promise<Blob> {
    try {
      const params = {
        startDate: filters?.startDate || '',
        endDate: filters?.endDate || '',
        status: filters?.status || '',
        vendor: filters?.vendor || '',
        search: filters?.search || ''
      };

      const response = await api.get('/purchases/export', {
        params,
        responseType: 'blob'
      });

      return response.data;
    } catch (error) {
      console.error('Ошибка при экспорте закупок в CSV:', error);
      throw error;
    }
  },

  /**
   * Импорт закупок из CSV
   */
  async importPurchasesFromCSV(file: File): Promise<{ success: boolean; imported: number; errors: number }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<{ success: boolean; imported: number; errors: number }>(
        '/purchases/import',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Ошибка при импорте закупок из CSV:', error);
      throw error;
    }
  },

  /**
   * Получение статистики по закупкам
   */
  async getPurchasesStats(startDate?: string, endDate?: string): Promise<{
    totalCount: number;
    totalAmount: number;
    byStatus: Record<PurchaseStatus, { count: number; amount: number }>;
    byMonth: Array<{ month: string; count: number; amount: number }>;
  }> {
    try {
      const params = {
        startDate: startDate || '',
        endDate: endDate || ''
      };

      const response = await api.get('/purchases/stats', { params });
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении статистики закупок:', error);
      throw error;
    }
  }
};

export default purchasesService;