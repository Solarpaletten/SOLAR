import { useCompanyContext } from '../contexts/CompanyContext';
import { api } from '../api/axios';

// 🎯 Hook для автоматического добавления Company-ID заголовков
export const useCompanyApi = () => {
  const { companyId } = useCompanyContext();

  const companyApi = {
    get: (url: string, config?: any) => {
      return api.get(url, {
        ...config,
        headers: {
          ...config?.headers,
          'Company-ID': companyId?.toString() || '1'
        }
      });
    },

    post: (url: string, data?: any, config?: any) => {
      return api.post(url, data, {
        ...config,
        headers: {
          ...config?.headers,
          'Company-ID': companyId?.toString() || '1'
        }
      });
    },

    put: (url: string, data?: any, config?: any) => {
      return api.put(url, data, {
        ...config,
        headers: {
          ...config?.headers,
          'Company-ID': companyId?.toString() || '1'
        }
      });
    },

    delete: (url: string, config?: any) => {
      return api.delete(url, {
        ...config,
        headers: {
          ...config?.headers,
          'Company-ID': companyId?.toString() || '1'
        }
      });
    }
  };

  return { companyApi, companyId };
};

export default useCompanyApi;
