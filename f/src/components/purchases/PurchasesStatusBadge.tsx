import React from 'react';
import { PurchaseStatus } from '../../types/purchasesTypes';

interface PurchasesStatusBadgeProps {
  status: PurchaseStatus;
}

interface StatusConfig {
  label: string;
  bgColor: string;
  textColor: string;
}

const PurchasesStatusBadge: React.FC<PurchasesStatusBadgeProps> = ({ status }) => {
  // Конфигурация стилей и текста для разных статусов
  const statusConfig: Record<PurchaseStatus, StatusConfig> = {
    pending: {
      label: 'В обработке',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800'
    },
    paid: {
      label: 'Оплачено',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800'
    },
    cancelled: {
      label: 'Отменено',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800'
    },
    delivered: {
      label: 'Доставлено',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800'
    },
    completed: {
      label: 'Завершено',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-800'
    },
    draft: {
      label: 'Черновик',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800'
    }
  };

  // Получаем конфигурацию для текущего статуса или используем конфигурацию по умолчанию
  const config = statusConfig[status] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800'
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
      title={config.label}
    >
      {/* Индикатор статуса (точка) */}
      <span className={`-ml-0.5 mr-1.5 h-2 w-2 rounded-full ${config.textColor.replace('text', 'bg')}`}></span>
      {config.label}
    </span>
  );
};

export default PurchasesStatusBadge;