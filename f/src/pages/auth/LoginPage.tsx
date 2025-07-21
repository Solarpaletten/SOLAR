// f/src/pages/auth/LoginPage.tsx
// ===============================================
// 🔐 ОБНОВЛЕННЫЙ LOGIN PAGE С СУЩЕСТВУЮЩИМ LOGIN FORM
// ===============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🎯 Простые тестовые учетные данные
  const testUsers = [
    { email: 'admin@solar.com', password: '123456', role: 'admin' },
    { email: 'test@solar.com', password: '123456', role: 'user' },
    { email: 'demo@solar.com', password: '123456', role: 'demo' }
  ];

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Login attempt:', { email });

      // Имитируем задержку сети
      await new Promise(resolve => setTimeout(resolve, 500));

      // 🎯 Проверяем тестовые учетные данные
      const user = testUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Неверный email или пароль');
      }

      // 🎯 Создаем токен
      const token = btoa(JSON.stringify({
        email: user.email,
        role: user.role,
        timestamp: Date.now(),
        expires: Date.now() + (24 * 60 * 60 * 1000) // 24 часа
      }));

      // �� Сохраняем данные (совместимость со старым и новым кодом)
      localStorage.setItem('auth_token', `Bearer ${token}`);
      localStorage.setItem('token', token); // Для старого кода
      localStorage.setItem('user_email', user.email);
      localStorage.setItem('user_role', user.role);

      console.log('✅ Login successful!');
      
      // �� Очищаем старые данные компании
      localStorage.removeItem('current_company_id');
      localStorage.removeItem('lastUsedCompanyId');

      // 🚀 Перенаправляем на Account Dashboard
      navigate('/account/dashboard');

    } catch (error: any) {
      console.error('❌ Login failed:', error);
      setError(error.message || 'Ошибка входа в систему');
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Быстрый логин для демо
  const quickLogin = (email: string, password: string) => {
    handleLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header Navigation */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">SOLAR ERP</div>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-600 hover:text-blue-600">Product</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">Integrations</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">Training</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">Prices</a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">☀️</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Вход в систему</h1>
              <p className="text-gray-600">Multi-Tenant Architecture</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                <strong>Ошибка:</strong> {error}
              </div>
            )}

            {/* Login Form */}
            <div className="flex justify-center mb-6">
              <LoginForm onLogin={handleLogin} isLoading={loading} />
            </div>

            {/* Quick Login Buttons */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-4">Быстрый демо-вход:</p>
              <div className="space-y-2">
                <button
                  onClick={() => quickLogin('admin@solar.com', '123456')}
                  disabled={loading}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors text-sm disabled:opacity-50"
                >
                  👨‍💼 Администратор (admin@solar.com)
                </button>
                <button
                  onClick={() => quickLogin('test@solar.com', '123456')}
                  disabled={loading}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors text-sm disabled:opacity-50"
                >
                  👤 Пользователь (test@solar.com)
                </button>
                <button
                  onClick={() => quickLogin('demo@solar.com', '123456')}
                  disabled={loading}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors text-sm disabled:opacity-50"
                >
                  🎯 Демо-доступ (demo@solar.com)
                </button>
              </div>
            </div>

            {/* Test Credentials Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">�� Тестовые учетные данные:</h4>
              <div className="text-xs text-blue-700 space-y-1">
                <p>• Email: <strong>admin@solar.com</strong> | Пароль: <strong>123456</strong></p>
                <p>• Email: <strong>test@solar.com</strong> | Пароль: <strong>123456</strong></p>
                <p>• Email: <strong>demo@solar.com</strong> | Пароль: <strong>123456</strong></p>
              </div>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Нет аккаунта?{' '}
              <button
                onClick={() => navigate('/auth/register')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Зарегистрироваться
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white p-4 text-center text-sm text-gray-500">
        <p>&copy; 2025 Solar ERP. Двухуровневая мульти-тенантная архитектура.</p>
      </div>
    </div>
  );
};

export default LoginPage;
