import React, { useEffect } from 'react';
import { PurchaseItem } from '../../types/purchasesTypes';

interface PurchasesItemRowProps {
  item: PurchaseItem;
  onItemChange: (itemId: string, field: keyof PurchaseItem, value: any) => void;
  onRemoveItem: (itemId: string) => void;
  currency?: string;
}

const PurchasesItemRow: React.FC<PurchasesItemRowProps> = ({
  item,
  onItemChange,
  onRemoveItem,
  currency = 'EUR'
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;

    if (name === 'quantity' || name === 'unitPrice') {
      parsedValue = value === '' ? 0 : parseFloat(value);
    }

    onItemChange(item.id, name as keyof PurchaseItem, parsedValue);
  };

  useEffect(() => {
    const calculatedTotal = item.quantity * item.unitPrice;
    if (item.totalPrice !== calculatedTotal) {
      onItemChange(item.id, 'totalPrice', calculatedTotal);
    }
  }, [item.quantity, item.unitPrice]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      <div className="col-span-5">
        <input
          type="text"
          name="description"
          value={item.description}
          onChange={handleChange}
          placeholder="Описание товара или услуги"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div className="col-span-2">
        <input
          type="number"
          name="quantity"
          value={item.quantity}
          onChange={handleChange}
          min="1"
          step="1"
          placeholder="Кол-во"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div className="col-span-2">
        <input
          type="number"
          name="unitPrice"
          value={item.unitPrice}
          onChange={handleChange}
          min="0"
          step="0.01"
          placeholder="Цена"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div className="col-span-2 text-right font-medium">
        {formatCurrency(item.totalPrice)}
      </div>

      <div className="col-span-1 text-right">
        <button
          type="button"
          onClick={() => onRemoveItem(item.id)}
          className="text-gray-500 hover:text-red-600"
          title="Удалить позицию"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PurchasesItemRow;
