import React from 'react';
import { PurchasesStats as Stats } from '../types/purchasesTypes.ts.backup';

interface PurchasesStatsProps {
  stats: Stats;
}

const PurchasesStats: React.FC<PurchasesStatsProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return `€${amount.toLocaleString()}`;
  };

  const statItems = [
    {
      label: 'Total Purchases',
      value: stats.total.toString(),
      icon: '🛒',
      color: 'bg-blue-500'
    },
    {
      label: 'Pending',
      value: stats.pending.toString(),
      icon: '⏳',
      color: 'bg-yellow-500'
    },
    {
      label: 'Paid',
      value: stats.paid.toString(),
      icon: '✅',
      color: 'bg-green-500'
    },
    {
      label: 'Overdue',
      value: stats.overdue.toString(),
      icon: '⚠️',
      color: 'bg-red-500'
    },
    {
      label: 'Total Spent',
      value: formatCurrency(stats.totalSpent),
      icon: '💰',
      color: 'bg-purple-500'
    },
    {
      label: 'Avg Order Value',
      value: formatCurrency(stats.averageOrderValue),
      icon: '📊',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-6">
      {statItems.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
            <div className={`${item.color} rounded-full p-3 text-white text-xl`}>
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PurchasesStats;
