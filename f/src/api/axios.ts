// f/src/api/axios.ts
// ===============================================
// 🌐 ОБНОВЛЕННЫЙ AXIOS КЛИЕНТ С АВТОМАТИЧЕСКИМ X-COMPANY-ID
// ===============================================

import axios from 'axios';

// Автоматическое определение API URL
const getApiUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    // Продакшен
    if (hostname === 'solar.swapoil.de') {
      return 'https://api.solar.swapoil.de';
    }

    // Локальная разработка
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:4000/api';
    }
  }

  // Fallback
  return 'https://api.solar.swapoil.de';
};

// Создаем экземпляр axios
export const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log(`🔗 API URL: ${getApiUrl()}`);

// ===============================================
// 🔧 УЛУЧШЕННЫЙ REQUEST INTERCEPTOR
// ===============================================
api.interceptors.request.use(
  (config) => {
    console.log(`�� API Request: ${config.method?.toUpperCase()} ${config.url}`);

    // 1. Добавляем токен авторизации
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Автоматически добавляем X-Company-Id для Company Level запросов
    const currentCompanyId = localStorage.getItem('current_company_id');

    // ===============================================
    // 🎯 ОПРЕДЕЛЕНИЕ COMPANY LEVEL ЗАПРОСОВ
    // ===============================================
    const isCompanyLevelRequest = (url: string): boolean => {
      // Прямые Company Level endpoints
      if (url.includes('/api/company/')) return true;

      // Endpoints которые требуют X-Company-Id
      const companyEndpoints = [
        '/api/company/clients',
        '/sales',
        '/purchases',
        '/stats',
        '/bank-operations',
        '/assistant',
        '/dashboard',
        // 🔥 ДОБАВИТЬ ЭТИ:
        '/clients',              // Для обратной совместимости  
        '/api/company/sales',
        '/api/company/purchases',
        '/api/company/stats',
        '/api/company/bank-operations',
        '/api/company/assistant',
        '/api/company/dashboard'
      ];

      return companyEndpoints.some(endpoint => url.includes(endpoint));
    };

    // ===============================================
    // 🏢 АВТОМАТИЧЕСКОЕ ДОБАВЛЕНИЕ X-COMPANY-ID
    // ===============================================
    if (config.url && isCompanyLevelRequest(config.url)) {
      if (currentCompanyId) {
        config.headers['X-Company-Id'] = currentCompanyId;
        console.log(`🏢 Added X-Company-Id: ${currentCompanyId} to ${config.url}`);
      } else {
        console.warn(`⚠️ Company Level request to ${config.url} without X-Company-Id!`);
        console.warn('💡 Hint: Select a company first on /account/dashboard');
      }
    }

    // ===============================================
    // 📋 ACCOUNT LEVEL - НЕ ДОБАВЛЯЕМ X-COMPANY-ID  
    // ===============================================
    const isAccountLevelRequest = (url: string): boolean => {
      const accountEndpoints = [
        '/api/account/',
        '/api/auth/',
        '/api/company-context/',
        '/api/mock/'
      ];

      return accountEndpoints.some(endpoint => url.includes(endpoint));
    };

    if (config.url && isAccountLevelRequest(config.url)) {
      console.log(`🏛️ Account Level request: ${config.url} (no X-Company-Id needed)`);
    }

    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ===============================================
// 🔄 RESPONSE INTERCEPTOR
// ===============================================
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);

    // Логируем успешные ответы с данными
    if (response.data && response.config.url) {
      if (response.config.url.includes('/companies')) {
        console.log(`📊 Companies data:`, response.data.count || response.data.length);
      }
      if (response.config.url.includes('/clients')) {
        console.log(`👥 Clients data:`, response.data.length || 'unknown count');
      }
    }

    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    console.error(`❌ API Error: ${status || 'Network'} ${url}`);

    // ===============================================
    // 🔒 ОБРАБОТКА ОШИБОК АВТОРИЗАЦИИ
    // ===============================================
    if (status === 401) {
      console.warn('🔒 Unauthorized - clearing auth data');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_company_id');
      localStorage.removeItem('company_selected_at');

      // Редирект на логин (если не уже там)
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // ===============================================
    // 🏢 ОБРАБОТКА ОШИБОК КОНТЕКСТА КОМПАНИИ
    // ===============================================
    if (status === 400 && error.response?.data?.error?.includes('Company ID')) {
      console.warn('🏢 Company context error - redirecting to company selection');

      // Очищаем неверный контекст
      localStorage.removeItem('current_company_id');
      localStorage.removeItem('company_selected_at');

      // Редирект на выбор компании
      if (!window.location.pathname.includes('/account/dashboard')) {
        window.location.href = '/account/dashboard';
      }
    }

    // ===============================================
    // 📊 ЛОГИРОВАНИЕ ПОЛЕЗНОЙ ИНФОРМАЦИИ ОБ ОШИБКАХ
    // ===============================================
    if (status === 404 && url?.includes('/clients')) {
      console.info('💡 Tip: Make sure you have selected a company and it has clients');
    }

    if (status === 404 && url?.includes('/api/company/')) {
      console.info('💡 Tip: Check if X-Company-Id header is present and valid');
    }

    return Promise.reject(error);
  }
);

export default api;

