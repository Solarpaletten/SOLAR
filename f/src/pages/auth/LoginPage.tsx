// src/pages/auth/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { login } from '../../api/axios';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already authorized when loading the component
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login(email, password);
      console.log('Login successful:', response);

      // Save token in localStorage
      localStorage.setItem('token', response.token);

      // If the response contains user data, save it too
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || t('Network error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navigation bar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">LEANID SOLAR</div>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-600 hover:text-blue-600">{t('product')}</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">{t('integrations')}</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">{t('training')}</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">{t('prices')}</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">{t('accountingCompanies')}</a>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <div className="flex space-x-2">
            <button
              onClick={() => navigate('/auth/login')}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              {t('signIn')}
            </button>
            <button
              onClick={() => navigate('/auth/register')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {t('register')}
            </button>
          </div>
        </div>
      </nav>

      {/* Login form */}
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white rounded shadow">
          <h1 className="text-2xl font-bold mb-4 text-center">{t('loginTitle')}</h1>
          <div className="flex justify-center space-x-2 mb-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Facebook</button>
            <button className="px-4 py-2 bg-red-600 text-white rounded">Google</button>
          </div>
          <p className="text-center text-gray-600 mb-4">{t('orUseCredentials')}</p>
          {error && (
            <div className="p-2 text-sm text-red-700 bg-red-100 border border-red-300 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('username')} *</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="mt-1 block w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('password')} *</label>
              <input
                type="password"
                placeholder={t('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="mt-1 block w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {isLoading ? t('loggingIn') : t('signIn')}
            </button>
          </form>
          <div className="flex justify-between mt-4 text-sm">
            <a href="#" className="text-blue-500 hover:underline">{t('forgotPassword')}</a>
            <button
              onClick={() => navigate('/auth/register')}
              className="text-blue-500 hover:underline"
            >
              {t('register')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;