import axios from 'axios';

const API_URL = '/api/vendors';

export interface Vendor {
  id: string;
  name: string;
  type?: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  companyCode?: string;
  directorName?: string;
}

const vendorsService = {
  getVendorsList: async (): Promise<Vendor[]> => {
    try {
      const response = await axios.get<Vendor[]>(`${API_URL}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vendors:', error);
      // Возвращаем моковые данные в случае ошибки для предотвращения сбоев UI
      return [
        { id: '1', name: 'ASSET LOGISTICS GMBH' },
        { id: '2', name: 'SWAPOIL GMBH' },
        { id: '3', name: 'ASSET BILANS SPOLKA Z O O' },
        { id: '4', name: 'RAPSOIL OU' }
      ];
    }
  },

  getVendorById: async (id: string): Promise<Vendor | null> => {
    try {
      const response = await axios.get<Vendor>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching vendor with ID ${id}:`, error);
      // Возвращаем null или моковые данные в случае ошибки
      const mockVendors = {
        '1': { id: '1', name: 'ASSET LOGISTICS GMBH' },
        '2': { id: '2', name: 'SWAPOIL GMBH' },
        '3': { id: '3', name: 'ASSET BILANS SPOLKA Z O O' },
        '4': { id: '4', name: 'RAPSOIL OU' }
      };
      return mockVendors[id] || null;
    }
  },

  createVendor: async (vendorData: Omit<Vendor, 'id'>): Promise<Vendor> => {
    try {
      const response = await axios.post<Vendor>(API_URL, vendorData);
      return response.data;
    } catch (error) {
      console.error('Error creating vendor:', error);
      throw new Error('Failed to create vendor');
    }
  },

  updateVendor: async (id: string, vendorData: Partial<Vendor>): Promise<Vendor> => {
    try {
      const response = await axios.put<Vendor>(`${API_URL}/${id}`, vendorData);
      return response.data;
    } catch (error) {
      console.error(`Error updating vendor with ID ${id}:`, error);
      throw new Error('Failed to update vendor');
    }
  }
};

export default vendorsService;