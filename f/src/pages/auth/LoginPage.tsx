import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { login } from '../../api/axios';

const LoginPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      localStorage.setItem('token', response.token);
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Network Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Навигационная панель */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">LEANID SOLAR</div>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-600 hover:text-blue-600">{t('product')}</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">{t('integrations')}</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">{t('training')}</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">{t('prices')}</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">{t('accountingCompanies')}</a>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => i18n.changeLanguage('en')}
            className={`px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            EN
          </button>
          <button
            onClick={() => i18n.changeLanguage('ru')}
            className={`px-2 py-1 rounded ${i18n.language === 'ru' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            RU
          </button>
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
      </nav>

      {/* Форма входа */}
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white rounded shadow">
          <h1 className="text-2xl font-bold mb-4 text-center">{t('loginTitle')}</h1>
          <div className="flex justify-center space-x-2 mb-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Facebook</button>
            <button className="px-4 py-2 bg-red-600 text-white rounded">Google</button>
          </div>
          <p className="text-center text-gray-600 mb-4">{t('orUseLogin')}</p>
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
                placeholder={t('emailPlaceholder')}
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
                placeholder={t('passwordPlaceholder')}
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
              {isLoading ? 'Loading...' : t('signInButton')}
            </button>
          </form>
          <div className="flex justify-between mt-4 text-sm">
            <a href="#" className="text-blue-500 hover:underline">{t('forgotPassword')}</a>
            <button
              onClick={() => navigate('/auth/register')}
              className="text-blue-500 hover:underline"
            >
              {t('registerLink')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;