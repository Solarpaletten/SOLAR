import React, { useState } from 'react';
import { login } from '../../api/auth';
import { useNavigate } from 'react-router-dom'; // Добавьте этот импорт

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Получите функцию для навигации

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      console.log('Login successful:', response);
      
      // Сохраняем токен в localStorage
      localStorage.setItem('token', response.token);
      
      // Можно также сохранить информацию о пользователе, если она есть
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      // Перенаправляем на страницу дашборда или на другую нужную страницу
      navigate('/dashboard'); // Измените на нужный путь
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  // Остальной код компонента...