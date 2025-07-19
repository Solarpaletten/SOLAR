import React from 'react';

interface PurchasesStatusBadgeProps {
  status: 'pending' | 'completed' | 'cancelled';
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
  pending: 'В ожидании',
  completed: 'Завершено',
  cancelled: 'Отменено',
};

const PurchasesStatusBadge: React.FC<PurchasesStatusBadgeProps> = ({
  status,
}) => {
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
};

export default PurchasesStatusBadge;
