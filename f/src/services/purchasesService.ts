import axios from 'axios';
import {
  Purchase,
  PurchaseFilter,
  PurchaseStatus,
  CreatePurchaseDto,
  UpdatePurchaseDto,
} from '../types/purchasesTypes';
import { withMockFallback } from '../api/mockConfig';
import { api } from '../api/axios';

const API_URL = '/api/purchases';

interface PurchasesResponse {
  data: Purchase[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Мок-данные для разработки
const createMockPurchases = (count: number = 5): Purchase[] => {
  return Array(count)
    .fill(null)
    .map((_, index) => ({
      id: `mock-${index}`,
      date: new Date().toISOString().split('T')[0],
      invoiceNumber: `INV-${2023000 + index}`,
      client_id: index + 1,
      description: 'Тестовая закупка для разработки',
      items: [],
      totalAmount: Math.round(Math.random() * 10000) / 100,
      status: [
        'pending',
        'paid',
        'delivered',
        'completed',
        'cancelled',
        'draft',
      ][Math.floor(Math.random() * 6)] as PurchaseStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currency: 'EUR',
    }));
};

const purchasesService = {
  // Получить список закупок с фильтрацией
  getPurchases: async (filters: PurchaseFilter = {}) => {
    const queryParams = new URLSearchParams();

    // Добавляем параметры фильтрации в URL
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.client_id)
      queryParams.append('client_id', filters.client_id.toString());
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
    if (filters.minAmount)
      queryParams.append('minAmount', filters.minAmount.toString());
    if (filters.maxAmount)
      queryParams.append('maxAmount', filters.maxAmount.toString());
    if (filters.archived !== undefined)
      queryParams.append('archived', filters.archived.toString());

    return withMockFallback(
      async () => {
        const response = await api.get<PurchasesResponse>(
          `${API_URL}?${queryParams.toString()}`
        );
        return response;
      },
      {
        data: {
          data: createMockPurchases(5),
          totalCount: 5,
          page: filters.page || 1,
          limit: filters.limit || 10,
          totalPages: 1,
        },
      }
    );
  },

  // Получить закупку по ID
  getPurchaseById: async (id: string): Promise<Purchase> => {
    return withMockFallback(
      async () => {
        const response = await api.get<Purchase>(`${API_URL}/${id}`);
        return response.data;
      },
      {
        id,
        date: new Date().toISOString().split('T')[0],
        invoiceNumber: `INV-${id}`,
        client_id: 1,
        description: 'Тестовая закупка для разработки',
        items: [],
        totalAmount: 1000,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currency: 'EUR',
      }
    );
  },

  // Создать новую закупку
  createPurchase: async (
    purchaseData: CreatePurchaseDto
  ): Promise<Purchase> => {
    try {
      const response = await api.post<Purchase>(API_URL, purchaseData);
      return response.data;
    } catch (error) {
      console.error('Error creating purchase:', error);
      throw new Error('Failed to create purchase');
    }
  },

  // Обновить существующую закупку
  updatePurchase: async (
    id: string,
    purchaseData: UpdatePurchaseDto
  ): Promise<Purchase> => {
    try {
      const response = await api.put<Purchase>(
        `${API_URL}/${id}`,
        purchaseData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating purchase with ID ${id}:`, error);
      throw new Error('Failed to update purchase');
    }
  },

  // Обновить статус закупки
  updatePurchaseStatus: async (
    id: string,
    status: PurchaseStatus
  ): Promise<Purchase> => {
    try {
      const response = await api.patch<Purchase>(`${API_URL}/${id}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating status for purchase with ID ${id}:`, error);
      throw new Error('Failed to update purchase status');
    }
  },

  // Удалить закупку
  deletePurchase: async (id: string): Promise<void> => {
    try {
      await api.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting purchase with ID ${id}:`, error);
      throw new Error('Failed to delete purchase');
    }
  },

  // Экспорт закупок в CSV
  exportPurchasesToCSV: async (): Promise<Blob> => {
    try {
      const response = await api.get(`${API_URL}/export`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting purchases to CSV:', error);
      throw new Error('Failed to export purchases');
    }
  },

  // Импорт закупок из CSV
  importPurchasesFromCSV: async (file: File): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post(`${API_URL}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Error importing purchases from CSV:', error);
      throw new Error('Failed to import purchases');
    }
  },

  // Скачать PDF для закупки
  downloadPurchasePDF: async (id: string): Promise<Blob> => {
    try {
      const response = await api.get(`${API_URL}/${id}/export/pdf`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error(`Error downloading PDF for purchase with ID ${id}:`, error);
      throw new Error('Failed to download PDF');
    }
  },

  // Получить список имен поставщиков
  getSuppliersList: async () => {
    return withMockFallback(async () => {
      const response = await api.get(`${API_URL}/suppliers`);
      return response.data;
    }, [
      'ASSET LOGISTICS GMBH',
      'SWAPOIL GMBH',
      'ASSET BILANS SPOLKA Z O O',
      'RAPSOIL OU',
    ]);
  },
};

export default purchasesService;
