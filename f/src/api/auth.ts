import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

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
