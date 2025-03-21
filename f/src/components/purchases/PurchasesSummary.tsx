import React from 'react';

interface PurchasesSummaryProps {
  totalAmount: number;
  count: number;
  periodStart?: Date;
  periodEnd?: Date;
  currency?: string;
}

const PurchasesSummary: React.FC<PurchasesSummaryProps> = ({
  totalAmount,
  count,
  periodStart,
  periodEnd,
  currency = 'RUB'
}) => {
  // Форматирование денежных сумм
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Форматирование даты
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Получение периода для отображения, если указаны даты начала и конца
  const getPeriodText = () => {
    if (periodStart && periodEnd) {
      return `за период с ${formatDate(periodStart)} по ${formatDate(periodEnd)}`;
    }
    return '';
  };

  // Получение среднего значения закупки
  const getAverageAmount = () => {
    if (count === 0) return 0;
    return totalAmount / count;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2">
      <div className="space-y-1 mb-2 sm:mb-0">
        <h4 className="text-sm font-medium text-gray-500">Сводная информация {getPeriodText()}</h4>
        <div className="flex space-x-4">
          <div>
            <span className="text-xs text-gray-500">Всего записей:</span>
            <span className="ml-1 text-sm font-medium text-gray-900">{count}</span>
          </div>
          {count > 0 && (
            <div>
              <span className="text-xs text-gray-500">Средняя сумма:</span>
              <span className="ml-1 text-sm font-medium text-gray-900">{formatCurrency(getAverageAmount())}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-md px-4 py-2">
        <div className="text-xs text-gray-500">Общая сумма</div>
        <div className="text-lg font-semibold text-gray-900">{formatCurrency(totalAmount)}</div>
      </div>
    </div>
  );
};

export default PurchasesSummary;