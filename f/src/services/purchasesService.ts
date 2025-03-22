import axios from 'axios';
import { Purchase, PurchaseItem, PurchaseFilter, PurchaseStatus } from '../types/purchasesTypes';
import { api } from '../api/axios';

interface PurchasesResponse {
  data: Purchase[];
  totalCount: number;
  page: number;
  limit: number;
}

interface PurchaseResponse {
  data: Purchase;
}

const purchasesService = {
  async getPurchases(filters?: PurchaseFilter): Promise<PurchasesResponse> {
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
  },

  async getPurchaseById(id: string): Promise<Purchase> {
    const response = await api.get<PurchaseResponse>(`/purchases/${id}`);
    return response.data.data;
  },

  async createPurchase(purchaseData: Omit<Purchase, 'id' | 'createdAt' | 'updatedAt'>): Promise<Purchase> {
    const response = await api.post<PurchaseResponse>('/purchases', purchaseData);
    return response.data.data;
  },

  async updatePurchase(id: string, purchaseData: Partial<Purchase>): Promise<Purchase> {
    const response = await api.put<PurchaseResponse>(`/purchases/${id}`, purchaseData);
    return response.data.data;
  },

  async deletePurchase(id: string): Promise<void> {
    await api.delete(`/purchases/${id}`);
  },

  async updatePurchaseStatus(id: string, status: PurchaseStatus): Promise<Purchase> {
    const response = await api.patch<PurchaseResponse>(`/purchases/${id}/status`, { status });
    return response.data.data;
  },

  async addPurchaseItem(purchaseId: string, item: Omit<PurchaseItem, 'id'>): Promise<PurchaseItem> {
    const response = await api.post<{ data: PurchaseItem }>(`/purchases/${purchaseId}/items`, item);
    return response.data.data;
  },

  async updatePurchaseItem(purchaseId: string, itemId: string, itemData: Partial<PurchaseItem>): Promise<PurchaseItem> {
    const response = await api.put<{ data: PurchaseItem }>(`/purchases/${purchaseId}/items/${itemId}`, itemData);
    return response.data.data;
  },

  async deletePurchaseItem(purchaseId: string, itemId: string): Promise<void> {
    await api.delete(`/purchases/${purchaseId}/items/${itemId}`);
  },

  async exportPurchasesToCSV(filters?: PurchaseFilter): Promise<Blob> {
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
  },

  async importPurchasesFromCSV(file: File): Promise<{ success: boolean; imported: number; errors: number }> {
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
  },

  async getPurchasesStats(startDate?: string, endDate?: string): Promise<{
    totalCount: number;
    totalAmount: number;
    byStatus: Record<PurchaseStatus, { count: number; amount: number }>;
    byMonth: Array<{ month: string; count: number; amount: number }>;
  }> {
    const params = {
      startDate: startDate || '',
      endDate: endDate || ''
    };
    const response = await api.get('/purchases/stats', { params });
    return response.data;
  },

  async duplicatePurchase(id: string): Promise<Purchase> {
    const original = await this.getPurchaseById(id);
    const { id: _, createdAt, updatedAt, ...rest } = original;
    const duplicated = { ...rest, date: new Date().toISOString() };
    return await this.createPurchase(duplicated);
  },

  async archivePurchase(id: string): Promise<void> {
    await api.patch(`/purchases/${id}/archive`);
  },

  async downloadPurchasePDF(id: string): Promise<Blob> {
    const response = await api.get(`/purchases/${id}/pdf`, { responseType: 'blob' });
    return response.data;
  },

  async bulkDelete(ids: string[]): Promise<void> {
    await api.post('/purchases/bulk-delete', { ids });
  },

  async getVendorsList(): Promise<string[]> {
    const response = await api.get<{ data: string[] }>('/vendors');
    return response.data.data;
  }
};

export default purchasesService;
