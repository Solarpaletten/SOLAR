// src/pages/landing/LandingPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';

const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-100">
      {/* Navigation bar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">LEANID SOLAR</div>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-600 hover:text-blue-600">
            {t('product')}
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600">
            {t('integrations')}
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600">
            {t('training')}
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600">
            {t('prices')}
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600">
            {t('accountingCompanies')}
          </a>
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

      {/* Main header */}
      <div className="flex items-center justify-between p-10 bg-blue-500 text-white">
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold mb-4">{t('mainHeader')}</h1>
          <button
            onClick={() => navigate('/auth/register')}
            className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {t('startUsing')}
          </button>
          <p className="mt-2 text-sm">{t('freeTrial')}</p>
        </div>
        {/* You can add an illustration of people here */}
        <div className="w-1/2">
          {/* <img src="path-to-illustration.png" alt="People discussing" /> */}
        </div>
      </div>

      {/* Invoice recognition section */}
      <div className="p-10 bg-white flex items-center justify-between">
        <div className="max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Invoice Recognition</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Automatic document recognition</li>
            <li>Time saving on manual entry</li>
            <li>Accounting integration</li>
            <li>Reduced input errors</li>
          </ul>
          <button
            onClick={() => navigate('/auth/register')}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Try recognition
          </button>
        </div>
        {/* You can add an illustration of a laptop with charts here */}
        <div className="w-1/3">
          {/* <img src="path-to-laptop-illustration.png" alt="Laptop with charts" /> */}
        </div>
      </div>

      {/* Kitten section */}
      <div className="p-4 bg-gray-100 flex justify-end">
        <div className="max-w-xs p-4 bg-blue-200 rounded flex items-center space-x-2">
          <div>
            <p className="text-sm">
              Do you have questions? Our support kitten is always ready to help!
            </p>
            <p className="text-sm font-bold">Support Kitten</p>
          </div>
          {/* You can add an illustration of a kitten here */}
          {/* <img src="path-to-kitten.png" alt="Kitten" className="w-16 h-16" /> */}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
