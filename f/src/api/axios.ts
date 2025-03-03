import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Создание экземпляра axios с базовым URL
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавление перехватчика для установки токена авторизации
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Функция логина с явными типами
export const login = async (email: string, password: string) => {
  console.log('Sending request to:', `${API_URL}/api/auth/login`);
  const response = await axios.post(`${API_URL}/api/auth/login`, {
    email,
    password,
  });
  return response.data;
};

// Функция регистрации с явными типами
export const register = async (
  email: string,
  password: string,
  username: string
) => {
  const response = await axios.post(`${API_URL}/api/auth/register`, {
    email,
    password,
    username,
  });
  return response.data;
};

// Функция выхода из системы
export const logout = () => {
  // Удаляем токен и другие данные авторизации из localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // Если вы используете axios с interceptors для автоматического добавления токена,
  // можно сбросить конфигурацию (опционально)
  // axios.defaults.headers.common['Authorization'] = '';
};
