import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Удаляем токен и другие данные авторизации
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Перенаправляем на страницу входа
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Выйти
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p>Лучшая бухгалтерская компания LEANID SOLAR</p>
        </div>
      </div>
    </div>
  );
};
