// src/pages/auth/OnboardingPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clientsService from '../../services/clientsService';

interface OnboardingFormData {
  companyCode: string;
  directorName: string;
}

const OnboardingPage: React.FC = () => {
  const { t } = useTranslation();
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
      // Creating the first counterparty (client's own company)
      await clientsService.createVendor({
        name: localStorage.getItem('companyName') || t('My Company'), 
        type: 'self', // Type "own company"
        email: localStorage.getItem('email') || '',
        phone: localStorage.getItem('phone') || '',
        companyCode: formData.companyCode,
        directorName: formData.directorName,
      });
      setSuccessMessage(t('Company setup successful'));
      setTimeout(() => {
        navigate('/warehouse/purchases');
      }, 2000);
    } catch (err: any) {
      setError(err.message || t('Failed to complete setup'));
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('setupYourCompany')}</h1>
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
            className="mt-1 block w-full border rounded px-3 py-2 text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('finishSetup')}
        </button>
      </form>
    </div>
  );
};

export default OnboardingPage;