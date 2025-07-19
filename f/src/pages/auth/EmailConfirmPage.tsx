// src/pages/auth/EmailConfirmPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '../../services/authService';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';

const EmailConfirmPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Извлекаем токен из URL (из query параметров)
  const getTokenFromUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('token');
  };

  useEffect(() => {
    const confirmEmail = async () => {
      const token = getTokenFromUrl();

      if (!token) {
        setError(t('Invalid or missing confirmation token'));
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await authService.verifyEmail(token);
        setSuccess(true);

        // Если сервер указал, куда редиректить после подтверждения - редиректим туда
        if (response.redirectTo) {
          setTimeout(() => {
            navigate(response.redirectTo || '/auth/login');
          }, 3000);
        }
      } catch (err: any) {
        console.error('Email confirmation error', err);
        setError(
          err.message || t('Failed to confirm your email. Please try again.')
        );
      } finally {
        setIsLoading(false);
      }
    };

    confirmEmail();
  }, [navigate, t, location]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">LEANID SOLAR</div>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
        </div>
      </nav>

      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white rounded shadow">
          <h1 className="text-2xl font-bold mb-4 text-center">
            {t('Email Confirmation')}
          </h1>

          {isLoading && (
            <div className="text-center my-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-gray-600">
                {t('Verifying your email...')}
              </p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 my-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    {t('Email confirmed successfully!')}
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>{t('You can now log in to your account.')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {t('Email confirmation failed')}
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/auth/login')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('Go to Login')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmPage;
