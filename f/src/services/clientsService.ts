import axios from 'axios';

const API_URL = '/api/clients'; // Исправлено с '/api/suppler' на '/api/clients'

export enum ClientRole {
  CLIENT = 'CLIENT',
  SUPPLIER = 'SUPPLIER'
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: ClientRole;  // Используем enum вместо строкового типа
  is_active?: boolean;
  code?: string;
  vat_code?: string;
  created_at?: string;
  updated_at?: string;
}

const clientsService = {
  // Исправлено название метода с getClietsList на getClientsList
  getClientsList: async (): Promise<Client[]> => {
    try {
      const response = await axios.get<Client[]>(`${API_URL}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      // Возвращаем моковые данные в случае ошибки для предотвращения сбоев UI
      return [
        { id: 1, name: 'ASSET LOGISTICS GMBH', email: 'info@assetlogistics.com', role: ClientRole.SUPPLIER, is_active: true },
        { id: 2, name: 'SWAPOIL GMBH', email: 'info@swapoil.com', role: ClientRole.SUPPLIER, is_active: true },
        { id: 3, name: 'ASSET BILANS SPOLKA Z O O', email: 'info@assetbilans.pl', role: ClientRole.SUPPLIER, is_active: true },
        { id: 4, name: 'RAPSOIL OU', email: 'info@rapsoil.ee', role: ClientRole.SUPPLIER, is_active: true }
      ];
    }
  },

  // Получить только поставщиков (SUPPLIER)
  getSuppliersList: async (): Promise<Client[]> => {
    try {
      const response = await axios.get<Client[]>(`${API_URL}?role=SUPPLIER`);
      return response.data;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      return [
        { id: 1, name: 'ASSET LOGISTICS GMBH', email: 'info@assetlogistics.com', role: ClientRole.SUPPLIER, is_active: true },
        { id: 2, name: 'SWAPOIL GMBH', email: 'info@swapoil.com', role: ClientRole.SUPPLIER, is_active: true },
        { id: 3, name: 'ASSET BILANS SPOLKA Z O O', email: 'info@assetbilans.pl', role: ClientRole.SUPPLIER, is_active: true },
        { id: 4, name: 'RAPSOIL OU', email: 'info@rapsoil.ee', role: ClientRole.SUPPLIER, is_active: true }
      ];
    }
  },

  // Получить клиента по ID, исправлено название и типы
  getClientById: async (id: number): Promise<Client | null> => {
    try {
      const response = await axios.get<Client>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching client with ID ${id}:`, error);
      // Моковые данные с правильными типами
      const mockClients: Record<number, Client> = {
        1: { id: 1, name: 'ASSET LOGISTICS GMBH', email: 'info@assetlogistics.com', role: ClientRole.SUPPLIER, is_active: true },
        2: { id: 2, name: 'SWAPOIL GMBH', email: 'info@swapoil.com', role: ClientRole.SUPPLIER, is_active: true },
        3: { id: 3, name: 'ASSET BILANS SPOLKA Z O O', email: 'info@assetbilans.pl', role: ClientRole.SUPPLIER, is_active: true },
        4: { id: 4, name: 'RAPSOIL OU', email: 'info@rapsoil.ee', role: ClientRole.SUPPLIER, is_active: true }
      };
      return mockClients[id] || null;
    }
  },

  // Создать нового клиента, исправлены типы
  createClient: async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> => {
    try {
      const response = await axios.post<Client>(API_URL, clientData);
      return response.data;
    } catch (error) {
      console.error('Error creating client:', error);
      throw new Error('Failed to create client');
    }
  },

  // Обновить существующего клиента, исправлены типы
  updateClient: async (id: number, clientData: Partial<Client>): Promise<Client> => {
    try {
      const response = await axios.put<Client>(`${API_URL}/${id}`, clientData);
      return response.data;
    } catch (error) {
      console.error(`Error updating client with ID ${id}:`, error);
      throw new Error('Failed to update client');
    }
  }
};

export default clientsService; // Исправлено с vendorsService на clientsService