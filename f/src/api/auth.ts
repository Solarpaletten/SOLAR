import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const login = async (email, password) => {
  console.log('API_URL being used:', API_URL); // Добавь для отладки
  const response = await axios.post(`${API_URL}/api/auth/login`, {
    email,
    password,
  });
  return response.data;
};

export const register = async (email, password, username) => {
  const response = await axios.post(`${API_URL}/api/auth/register`, {
    email,
    password,
    username,
  });
  return response.data;
};
