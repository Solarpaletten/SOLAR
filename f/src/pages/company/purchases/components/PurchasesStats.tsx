// f/src/pages/company/purchases/components/PurchasesStats.tsx
import React from 'react';
import { PurchasesStats as Stats } from '../types/purchasesTypes';

interface PurchasesStatsProps {
  stats: Stats;
}

const PurchasesStats: React.FC<PurchasesStatsProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Purchases */}
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600 font-medium">Total Purchases</div>
        </div>
        
        {/* Completed Purchases */}
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600 font-medium">Completed</div>
        </div>
        
        {/* Pending Purchases */}
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          <div className="text-sm text-gray-600 font-medium">Pending</div>
        </div>
        
        {/* Processing Purchases */}
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{stats.processing}</div>
          <div className="text-sm text-gray-600 font-medium">Processing</div>
        </div>
        
        {/* Total Value */}
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {formatCurrency(stats.totalValue)}
          </div>
          <div className="text-sm text-gray-600 font-medium">Total Value</div>
        </div>
        
        {/* Suppliers */}
        <div className="text-center p-3 bg-indigo-50 rounded-lg">
          <div className="text-2xl font-bold text-indigo-600">{stats.suppliers.length}</div>
          <div className="text-sm text-gray-600 font-medium">Suppliers</div>
        </div>
      </div>

      {/* Suppliers breakdown */}
      {stats.suppliers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Top Suppliers:</h3>
          <div className="flex flex-wrap gap-2">
            {stats.suppliers.slice(0, 5).map((supplier, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {supplier.name}: {supplier.count} ({formatCurrency(supplier.value)})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasesStats;