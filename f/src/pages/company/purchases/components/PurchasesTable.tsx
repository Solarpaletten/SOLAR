import React from 'react';
import { Purchase, PAYMENT_STATUSES, DELIVERY_STATUSES } from '../types/purchasesTypes';

interface PurchasesTableProps {
  purchases: Purchase[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (purchase: Purchase) => void;
  onDelete: (id: number) => void;
}

const PurchasesTable: React.FC<PurchasesTableProps> = ({
  purchases,
  loading,
  onRefresh,
  onEdit,
  onDelete
}) => {
  const getStatusColor = (status: string, type: 'payment' | 'delivery') => {
    const statuses = type === 'payment' ? PAYMENT_STATUSES : DELIVERY_STATUSES;
    return statuses.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbols = { EUR: '€', USD: '$', UAH: '₴', AED: 'د.إ' };
    return `${symbols[currency] || currency} ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">⏳ Loading purchases...</div>
        </div>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="text-center py-12">
          <span className="text-6xl block mb-4">🛒</span>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No purchases found</h3>
          <p className="text-gray-600 mb-6">Start by creating your first purchase order</p>
          <button 
            onClick={onRefresh}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            ➕ Create Purchase
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delivery Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {purchases.map((purchase) => (
              <tr key={purchase.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🛒</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {purchase.document_number}
                      </div>
                      <div className="text-sm text-gray-500">
                        {purchase.operation_type}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {purchase.supplier?.name || `Supplier #${purchase.supplier_id}`}
                    </div>
                    {purchase.supplier?.company_name && (
                      <div className="text-gray-500">
                        {purchase.supplier.company_name}
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(purchase.document_date)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(purchase.total_amount, purchase.currency)}
                    </div>
                    <div className="text-gray-500">
                      Subtotal: {formatCurrency(purchase.subtotal, purchase.currency)}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(purchase.payment_status, 'payment')}`}>
                    {purchase.payment_status}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(purchase.delivery_status, 'delivery')}`}>
                    {purchase.delivery_status}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(purchase)}
                      className="text-indigo-600 hover:text-indigo-800 p-1 rounded"
                      title="Edit Purchase"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(purchase.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded"
                      title="Delete Purchase"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total: {purchases.length} purchases</span>
          <button
            onClick={onRefresh}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchasesTable;
