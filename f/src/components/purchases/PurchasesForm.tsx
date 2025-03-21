import React, { useState, useEffect } from 'react';
import { Purchase, PurchaseItem, PurchaseStatus } from '../../types/purchasesTypes';
import PurchasesItemRow from './PurchasesItemRow';

interface PurchasesFormProps {
  initialData?: Purchase;
  onSubmit: (data: Purchase) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  vendors?: { id: string; name: string }[];
}

// Default empty purchase
const emptyPurchase: Purchase = {
  id: '',
  date: new Date().toISOString().slice(0, 10),
  invoiceNumber: '',
  vendor: '',
  description: '',
  items: [],
  totalAmount: 0,
  status: 'pending',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Default empty item
const emptyItem: PurchaseItem = {
  id: '',
  description: '',
  quantity: 1,
  unitPrice: 0,
  totalPrice: 0,
};

const PurchasesForm: React.FC<PurchasesFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  vendors = [],
}) => {
  // Initialize form data - use initialData if provided, otherwise use empty purchase
  const [formData, setFormData] = useState<Purchase>(initialData || { ...emptyPurchase });
  
  // Local validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Recalculate total amount when items change
  useEffect(() => {
    const total = formData.items.reduce((sum, item) => sum + item.totalPrice, 0);
    setFormData(prev => ({ ...prev, totalAmount: total }));
  }, [formData.items]);

  // Handle input changes for main purchase fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle adding a new item
  const handleAddItem = () => {
    const newItem = {
      ...emptyItem,
      id: `temp-${Date.now()}`, // Temporary ID until saved
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  // Handle removing an item
  const handleRemoveItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
    }));
  };

  // Handle item field changes
  const handleItemChange = (itemId: string, field: keyof PurchaseItem, value: any) => {
    setFormData(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          
          // Recalculate totalPrice if quantity or unitPrice changed
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
          }
          
          return updatedItem;
        }
        return item;
      });
      
      return { ...prev, items: updatedItems };
    });
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.date) {
      newErrors.date = 'Дата обязательна';
    }
    
    if (!formData.invoiceNumber) {
      newErrors.invoiceNumber = 'Номер счета обязателен';
    }
    
    if (!formData.vendor) {
      newErrors.vendor = 'Поставщик обязателен';
    }
    
    if (formData.items.length === 0) {
      newErrors.items = 'Добавьте хотя бы одну позицию';
    } else {
      // Validate each item
      const itemsValid = formData.items.every(item => 
        item.description && item.quantity > 0 && item.unitPrice >= 0
      );
      
      if (!itemsValid) {
        newErrors.items = 'Проверьте все позиции: описание обязательно, количество > 0';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Update timestamps
      const submitData = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };
      
      // If new purchase, add createdAt
      if (!initialData) {
        submitData.createdAt = new Date().toISOString();
      }
      
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="text-xl font-medium text-gray-900 mb-4">
        {initialData ? 'Редактировать закупку' : 'Новая закупка'}
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Date field */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Дата</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.date ? 'border-red-500' : ''}`}
          />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
        </div>
        
        {/* Invoice number field */}
        <div>
          <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700">Номер счета</label>
          <input
            type="text"
            id="invoiceNumber"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.invoiceNumber ? 'border-red-500' : ''}`}
          />
          {errors.invoiceNumber && <p className="mt-1 text-sm text-red-600">{errors.invoiceNumber}</p>}
        </div>
        
        {/* Vendor field */}
        <div>
          <label htmlFor="vendor" className="block text-sm font-medium text-gray-700">Поставщик</label>
          {vendors.length > 0 ? (
            <select
              id="vendor"
              name="vendor"
              value={formData.vendor}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.vendor ? 'border-red-500' : ''}`}
            >
              <option value="">Выберите поставщика</option>
              {vendors.map(vendor => (
                <option key={vendor.id} value={vendor.name}>
                  {vendor.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              id="vendor"
              name="vendor"
              value={formData.vendor}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.vendor ? 'border-red-500' : ''}`}
            />
          )}
          {errors.vendor && <p className="mt-1 text-sm text-red-600">{errors.vendor}</p>}
        </div>
        
        {/* Status field */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Статус</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="pending">В обработке</option>
            <option value="paid">Оплачено</option>
            <option value="cancelled">Отменено</option>
            <option value="delivered">Доставлено</option>
          </select>
        </div>
      </div>
      
      {/* Description field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Описание (опционально)</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      
      {/* Items section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Позиции</h3>
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Добавить позицию
          </button>
        </div>
        
        {errors.items && <p className="mt-1 text-sm text-red-600 mb-2">{errors.items}</p>}
        
        {formData.items.length === 0 ? (
          <div className="text-center py-4 text-gray-500 border border-dashed border-gray-300 rounded-md">
            Нет позиций. Нажмите "Добавить позицию" для начала.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-700 pb-2 border-b">
              <div className="col-span-5">Описание</div>
              <div className="col-span-2">Количество</div>
              <div className="col-span-2">Цена</div>
              <div className="col-span-2">Сумма</div>
              <div className="col-span-1"></div>
            </div>
            {formData.items.map((item, index) => (
              <PurchasesItemRow
                key={item.id}
                item={item}
                onItemChange={handleItemChange}
                onRemoveItem={handleRemoveItem}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Total amount */}
      <div className="flex justify-end text-lg font-medium">
        <div className="mr-4">Итого:</div>
        <div>
          {new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB'
          }).format(formData.totalAmount)}
        </div>
      </div>
      
      {/* Form actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isSubmitting}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Сохранение...' : initialData ? 'Обновить' : 'Создать'}
        </button>
      </div>
    </form>
  );
};

export default PurchasesForm;