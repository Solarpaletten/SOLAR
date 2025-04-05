import React from 'react';
import { Purchase } from '../../types/purchasesTypes';
import { Client } from '../../../../services/clientsService';
import { useTranslation } from 'react-i18next';

interface PurchasesFormProps {
  initialData?: Purchase;
  onSubmit: (data: Purchase) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  suppliers?: Client[];
}

const PurchasesForm: React.FC<PurchasesFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  suppliers = [],
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = React.useState<Purchase>(
    initialData || {
      id: '',
      date: new Date().toISOString().split('T')[0],
      invoiceNumber: '',
      client_id: 0,
      totalAmount: 0,
      currency: 'EUR',
      status: 'draft',
      description: '',
      items: [],
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'client_id') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else if (name === 'totalAmount') {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('date')}</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">{t('supplierLabel')}</label>
        <select
          name="client_id"
          value={formData.client_id || ''}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        >
          <option value="">{t('selectSupplier')}</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">{t('invoiceNumber')}</label>
        <input
          type="text"
          name="invoiceNumber"
          value={formData.invoiceNumber}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">{t('total')}</label>
        <input
          type="number"
          name="totalAmount"
          value={formData.totalAmount}
          onChange={handleChange}
          step="0.01"
          min="0"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">{t('description')}</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">{t('statusLabel')}</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        >
          <option value="draft">{t('draft')}</option>
          <option value="pending">{t('pending')}</option>
          <option value="paid">{t('paid')}</option>
          <option value="delivered">{t('delivered')}</option>
          <option value="completed">{t('completed')}</option>
          <option value="cancelled">{t('cancelled')}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">{t('currency')}</label>
        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
        </select>
      </div>

      <div className="flex items-center justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded"
          disabled={isSubmitting}
        >
          {t('cancel')}
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('saving') : t('save')}
        </button>
      </div>
    </form>
  );
};

export default PurchasesForm;