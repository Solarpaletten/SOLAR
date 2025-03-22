import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import vendorsService from '../../services/vendorsService';

interface OnboardingFormData {
  companyCode: string;
  directorName: string;
}

const OnboardingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<OnboardingFormData>({
    companyCode: '',
    directorName: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      await vendorsService.createVendor({
        name: localStorage.getItem('companyName') || 'My Company',
        type: 'self',
        email: localStorage.getItem('email') || '',
        phone: localStorage.getItem('phone') || '',
        companyCode: formData.companyCode,
        directorName: formData.directorName,
      });
      setSuccessMessage(t('setupSuccess'));
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || t('setupError'));
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
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
            onClick={() => changeLanguage('en')}
            className={`px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            EN
          </button>
          <button
            onClick={() => changeLanguage('ru')}
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

      {/* Форма онбординга */}
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white rounded shadow">
          <h1 className="text-2xl font-bold mb-4 text-center">{t('onboardingTitle')}</h1>
          {successMessage && (
            <div className="p-2 text-sm text-green-700 bg-green-100 border border-green-300 rounded mb-4">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="p-2 text-sm text-red-700 bg-red-100 border border-red-300 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('companyCode')} *</label>
              <input
                type="text"
                name="companyCode"
                value={formData.companyCode}
                onChange={handleChange}
                placeholder={t('companyCodePlaceholder')}
                className="mt-1 block w-full border rounded px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('directorName')} *</label>
              <input
                type="text"
                name="directorName"
                value={formData.directorName}
                onChange={handleChange}
                placeholder={t('directorNamePlaceholder')}
                className="mt-1 block w-full border rounded px-3 py-2 text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {t('completeSetup')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;