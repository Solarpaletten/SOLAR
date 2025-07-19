import React from 'react';
import { Purchase } from '../../types/purchasesTypes';

interface PurchasesSummaryProps {
  purchases: Purchase[];
}

const PurchasesSummary: React.FC<PurchasesSummaryProps> = ({ purchases }) => {
  const totalAmount = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalCount = purchases.length;

  return (
    <div className="flex justify-between items-center px-4 py-2 border-t border-gray-200 bg-gray-50 text-sm text-gray-700">
      <div>
        Всего записей: <strong>{totalCount}</strong>
      </div>
      <div>
        Общая сумма: <strong>{totalAmount.toFixed(2)} EUR</strong>
      </div>
    </div>
  );
};

export default PurchasesSummary;
