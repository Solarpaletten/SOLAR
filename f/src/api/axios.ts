import axios from 'axios';

// Получаем базовый URL из переменных окружения и добавляем /api
const API_URL =
  import.meta.env.VITE_API_URL || 'https://npmbk-ppnp.onrender.com';
const BASE_URL = `${API_URL}/api`;

// Создаем экземпляр axios с базовым URL
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем перехватчик для автоматической установки токена авторизации
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Экспортируем функции для авторизации
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password }); // Убираем /api
  return response.data;
};

export const register = async (
  email: string,
  password: string,
  username: string
) => {
  const response = await api.post('/auth/register', {
    email,
    password,
    username,
  }); // Убираем /api
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};


export const checkDatabaseConnection = async () => {
  return await api.get('/health');
};