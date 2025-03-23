import axios from 'axios';

const API_URL = '/api/vendors';

export interface Vendor {
  id: string;
  name: string;
  type: string;
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
      const response = await axios.get<Vendor[]>(`${API_URL}?type=vendor`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch vendors');
    }
  },

  createVendor: async (vendorData: Omit<Vendor, 'id'>): Promise<void> => {
    try {
      await axios.post(API_URL, vendorData);
    } catch (error) {
      throw new Error('Failed to create vendor');
    }
  },
};

export default vendorsService;
