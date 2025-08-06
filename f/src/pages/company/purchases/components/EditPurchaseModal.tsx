import React, { useState, useEffect } from 'react';
import { Purchase, PurchaseFormData } from '../types/purchasesTypes';

interface EditPurchaseModalProps {
  purchase: Purchase;
  onClose: () => void;
  onSubmit: (data: PurchaseFormData) => Promise<void>;
}

const EditPurchaseModal: React.FC<EditPurchaseModalProps> = ({ purchase, onClose, onSubmit }) => {
  // Преобразуем Purchase в PurchaseFormData
  const [initialFormData] = useState<PurchaseFormData>(() => ({
    document_number: purchase.document_number,
    document_date: purchase.document_date,
    operation_type: purchase.operation_type,
    supplier_id: purchase.supplier_id,
    warehouse_id: purchase.warehouse_id,
    purchase_manager_id: purchase.purchase_manager_id,
    currency: purchase.currency,
    payment_status: purchase.payment_status,
    delivery_status: purchase.delivery_status,
    document_status: purchase.document_status,
    items: purchase.items || []
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <span className="text-2xl mr-2">✏️</span>
            Edit Purchase: {purchase.document_number}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Purchase Info */}
        <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Document:</div>
              <div className="font-medium">{purchase.document_number}</div>
            </div>
            <div>
              <div className="text-gray-600">Date:</div>
              <div className="font-medium">{new Date(purchase.document_date).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-gray-600">Supplier:</div>
              <div className="font-medium">{purchase.supplier?.name || `#${purchase.supplier_id}`}</div>
            </div>
            <div>
              <div className="text-gray-600">Total:</div>
              <div className="font-medium">€{purchase.total_amount.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <EditPurchaseForm
          initialData={initialFormData}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

// Компонент формы редактирования (упрощенная версия AddPurchaseModal)
const EditPurchaseForm: React.FC<{
  initialData: PurchaseFormData;
  onClose: () => void;
  onSubmit: (data: PurchaseFormData) => Promise<void>;
}> = ({ initialData, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<PurchaseFormData>(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || 'Error updating purchase');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let vatAmount = 0;

    formData.items.forEach(item => {
      const itemSubtotal = item.quantity * item.unit_price_base;
      const itemVat = itemSubtotal * ((item.vat_rate || 0) / 100);
      
      subtotal += itemSubtotal;
      vatAmount += itemVat;
    });

    return {
      subtotal,
      vat_amount: vatAmount,
      total_amount: subtotal + vatAmount
    };
  };

  const totals = calculateTotals();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800 text-sm">{error}</div>
          </div>
        )}

        {/* Status Updates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status
            </label>
            <select
              value={formData.payment_status}
              onChange={(e) => setFormData(prev => ({ ...prev, payment_status: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="PARTIAL">Partial</option>
              <option value="OVERDUE">Overdue</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Status
            </label>
            <select
              value={formData.delivery_status}
              onChange={(e) => setFormData(prev => ({ ...prev, delivery_status: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="PENDING">Pending</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Status
            </label>
            <select
              value={formData.document_status}
              onChange={(e) => setFormData(prev => ({ ...prev, document_status: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="DRAFT">Draft</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Basic Purchase Info (read-only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Date
            </label>
            <input
              type="date"
              value={formData.document_date}
              onChange={(e) => setFormData(prev => ({ ...prev, document_date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Operation Type
            </label>
            <select
              value={formData.operation_type}
              onChange={(e) => setFormData(prev => ({ ...prev, operation_type: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="PURCHASE">Purchase</option>
              <option value="RETURN">Return</option>
            </select>
          </div>
        </div>

        {/* Items Display */}
        {formData.items && formData.items.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="bg-gray-50 px-4 py-2">
              <h4 className="text-lg font-medium text-gray-900">Purchase Items</h4>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">VAT %</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {formData.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{item.product?.name || `Product #${item.product_id}`}</div>
                          <div className="text-gray-500 text-xs">{item.product?.code}</div>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {item.quantity} {item.product?.unit}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        €{item.unit_price_base.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {item.vat_rate}%
                      </td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">
                        €{item.line_total.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {item.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Totals Summary */}
        {formData.items && formData.items.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Purchase Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-right">
              <div>
                <div className="text-sm text-gray-600">Subtotal:</div>
                <div className="text-lg font-medium">€{totals.subtotal.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">VAT:</div>
                <div className="text-lg font-medium">€{totals.vat_amount.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total:</div>
                <div className="text-xl font-bold text-indigo-600">€{totals.total_amount.toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Notes Section */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purchase Notes
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Add any notes about this purchase..."
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-600">
          Last updated: {new Date(initialData.items?.[0]?.created_at || Date.now()).toLocaleString()}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Updating...' : '✅ Update Purchase'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditPurchaseModal;