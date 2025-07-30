// f/src/pages/company/sales/components/AddSaleModal.tsx
import React, { useState, useEffect } from 'react';
import { 
  SaleFormData, 
  SaleItemFormData, 
  SalesDocumentType, 
  PaymentStatus, 
  DeliveryStatus, 
  DocumentStatus, 
  Currency,
  Client,
  Product
} from '../types/salesTypes';

interface AddSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SaleFormData) => Promise<void>;
  loading?: boolean;
}

// Mock data - в реальной версии это будет из API
const mockClients: Client[] = [
  { id: 1, name: 'ACME Corporation', email: 'contact@acme.com', code: 'ACM001' },
  { id: 2, name: 'TechStart Ltd', email: 'info@techstart.com', code: 'TSL002' },
];

const mockProducts: Product[] = [
  { 
    id: 1, 
    code: 'PRD001', 
    name: 'Residius Oil technical', 
    unit: 'liter', 
    price: 100, 
    currency: 'EUR', 
    vat_rate: 20,
    is_active: true 
  },
  { 
    id: 2, 
    code: 'PRD002', 
    name: 'Premium Service', 
    unit: 'hour', 
    price: 150, 
    currency: 'EUR', 
    vat_rate: 20,
    is_active: true 
  },
];

const AddSaleModal: React.FC<AddSaleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState<SaleFormData>({
    document_number: '',
    document_date: new Date().toISOString().split('T')[0],
    document_type: 'INVOICE',
    delivery_date: '',
    due_date: '',
    client_id: 0,
    warehouse_id: undefined,
    sales_manager_id: undefined,
    currency: 'EUR',
    payment_status: 'PENDING',
    delivery_status: 'PENDING',
    document_status: 'DRAFT',
    items: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Generate automatic document number
  useEffect(() => {
    if (isOpen && !formData.document_number) {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      setFormData(prev => ({
        ...prev,
        document_number: `INV-${year}${month}${day}-${random}`
      }));
    }
  }, [isOpen]);

  const addItem = () => {
    const newItem: SaleItemFormData = {
      product_id: 0,
      quantity: 1,
      unit_price_base: 0,
      discount_percent: 0,
      total_discount: 0,
      vat_rate: 20,
      description: ''
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: keyof SaleItemFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value };
          
          // Auto-update price when product changes
          if (field === 'product_id') {
            const product = mockProducts.find(p => p.id === parseInt(value));
            if (product) {
              updatedItem.unit_price_base = product.price;
              updatedItem.vat_rate = product.vat_rate || 20;
            }
          }
          
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const calculateItemTotal = (item: SaleItemFormData) => {
    const subtotal = item.quantity * item.unit_price_base;
    const discount = item.total_discount || 0;
    const afterDiscount = subtotal - discount;
    const vat = afterDiscount * ((item.vat_rate || 0) / 100);
    return afterDiscount + vat;
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalVat = 0;

    formData.items.forEach(item => {
      const itemSubtotal = item.quantity * item.unit_price_base;
      const itemDiscount = item.total_discount || 0;
      const itemAfterDiscount = itemSubtotal - itemDiscount;
      const itemVat = itemAfterDiscount * ((item.vat_rate || 0) / 100);

      subtotal += itemSubtotal;
      totalDiscount += itemDiscount;
      totalVat += itemVat;
    });

    return {
      subtotal,
      totalDiscount,
      totalVat,
      total: subtotal - totalDiscount + totalVat
    };
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.document_number.trim()) {
      newErrors.document_number = 'Document number is required';
    }
    if (!formData.document_date) {
      newErrors.document_date = 'Document date is required';
    }
    if (!formData.client_id) {
      newErrors.client_id = 'Client is required';
    }
    if (formData.items.length === 0) {
      newErrors.items = 'At least one item is required';
    }

    formData.items.forEach((item, index) => {
      if (!item.product_id) {
        newErrors[`item_${index}_product`] = 'Product is required';
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0';
      }
      if (item.unit_price_base <= 0) {
        newErrors[`item_${index}_price`] = 'Price must be greater than 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Error creating sale:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      document_number: '',
      document_date: new Date().toISOString().split('T')[0],
      document_type: 'INVOICE',
      delivery_date: '',
      due_date: '',
      client_id: 0,
      warehouse_id: undefined,
      sales_manager_id: undefined,
      currency: 'EUR',
      payment_status: 'PENDING',
      delivery_status: 'PENDING',
      document_status: 'DRAFT',
      items: []
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const totals = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">➕ Create New Sale</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Number *
              </label>
              <input
                type="text"
                value={formData.document_number}
                onChange={(e) => setFormData(prev => ({ ...prev, document_number: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.document_number ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.document_number && (
                <p className="text-red-600 text-sm mt-1">{errors.document_number}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Type
              </label>
              <select
                value={formData.document_type}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  document_type: e.target.value as SalesDocumentType 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="INVOICE">Invoice</option>
                <option value="QUOTE">Quote</option>
                <option value="ORDER">Order</option>
                <option value="RECEIPT">Receipt</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Date *
              </label>
              <input
                type="date"
                value={formData.document_date}
                onChange={(e) => setFormData(prev => ({ ...prev, document_date: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.document_date ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.document_date && (
                <p className="text-red-600 text-sm mt-1">{errors.document_date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client *
              </label>
              <select
                value={formData.client_id}
                onChange={(e) => setFormData(prev => ({ ...prev, client_id: parseInt(e.target.value) }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.client_id ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={loading}
              >
                <option value={0}>Select a client...</option>
                {mockClients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.code})
                  </option>
                ))}
              </select>
              {errors.client_id && (
                <p className="text-red-600 text-sm mt-1">{errors.client_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value as Currency }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="EUR">EUR - Euro</option>
                <option value="USD">USD - US Dollar</option>
                <option value="AED">AED - UAE Dirham</option>
                <option value="RUB">RUB - Russian Ruble</option>
                <option value="UAH">UAH - Ukrainian Hryvnia</option>
              </select>
            </div>
          </div>

          {/* Status Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Status
              </label>
              <select
                value={formData.payment_status}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  payment_status: e.target.value as PaymentStatus 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
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
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  delivery_status: e.target.value as DeliveryStatus 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
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
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  document_status: e.target.value as DocumentStatus 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="DRAFT">Draft</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Sale Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                ➕ Add Item
              </button>
            </div>

            {errors.items && (
              <p className="text-red-600 text-sm">{errors.items}</p>
            )}

            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-start">
                    {/* Product */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product *
                      </label>
                      <select
                        value={item.product_id}
                        onChange={(e) => updateItem(index, 'product_id', parseInt(e.target.value))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors[`item_${index}_product`] ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={loading}
                      >
                        <option value={0}>Select product...</option>
                        {mockProducts.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.code})
                          </option>
                        ))}
                      </select>
                      {errors[`item_${index}_product`] && (
                        <p className="text-red-600 text-sm mt-1">{errors[`item_${index}_product`]}</p>
                      )}
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors[`item_${index}_quantity`] ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={loading}
                      />
                      {errors[`item_${index}_quantity`] && (
                        <p className="text-red-600 text-sm mt-1">{errors[`item_${index}_quantity`]}</p>
                      )}
                    </div>

                    {/* Unit Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit Price *
                      </label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.unit_price_base}
                        onChange={(e) => updateItem(index, 'unit_price_base', parseFloat(e.target.value))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors[`item_${index}_price`] ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={loading}
                      />
                      {errors[`item_${index}_price`] && (
                        <p className="text-red-600 text-sm mt-1">{errors[`item_${index}_price`]}</p>
                      )}
                    </div>

                    {/* VAT Rate */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        VAT %
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.vat_rate || 0}
                        onChange={(e) => updateItem(index, 'vat_rate', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        disabled={loading}
                        title="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Item Total Display */}
                  <div className="mt-3 text-right text-sm text-gray-600">
                    Item Total: €{calculateItemTotal(item).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Summary */}
          {formData.items.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>€{totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.totalDiscount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Total Discount:</span>
                    <span>-€{totals.totalDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Total VAT:</span>
                  <span>€{totals.totalVat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>€{totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSaleModal;