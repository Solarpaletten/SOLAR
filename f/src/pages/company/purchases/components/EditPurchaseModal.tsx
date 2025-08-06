// f/src/pages/company/purchases/components/EditPurchaseModal.tsx
import React, { useState, useEffect } from 'react';
import { EditPurchaseModalProps, PurchaseFormData } from '../types/purchasesTypes';

const EditPurchaseModal: React.FC<EditPurchaseModalProps> = ({ purchase, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PurchaseFormData>({
    purchase_number: '',
    date: '',
    supplier: '',
    supplier_id: undefined,
    product: '',
    product_id: undefined,
    quantity: 0,
    unit: 'T',
    price: 0,
    currency: 'EUR',
    status: 'pending',
    description: '',
    vat_rate: 21
  });

  // Initialize form data from purchase
  useEffect(() => {
    if (purchase) {
      setFormData({
        purchase_number: purchase.purchase_number,
        date: purchase.date.split('T')[0], // Extract date part
        supplier: purchase.supplier,
        supplier_id: purchase.supplier_id,
        product: purchase.product,
        product_id: purchase.product_id,
        quantity: purchase.quantity,
        unit: purchase.unit,
        price: purchase.price,
        currency: purchase.currency,
        status: purchase.status,
        description: purchase.description || '',
        vat_rate: purchase.vat_rate || 21
      });
    }
  }, [purchase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' || name === 'vat_rate' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.supplier.trim() || !formData.product.trim() || formData.quantity <= 0 || formData.price <= 0) {
      alert('Please fill in all required fields with valid values');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const supplierOptions = [
    'ASSET LOGISTICS GMBH',
    'TECH SOLUTIONS LTD',
    'GLOBAL TRADING INC',
    'ECO MATERIALS BV',
    'INDUSTRIAL SUPPLIES CO'
  ];

  const productOptions = [
    'RESIDUES TECHNICAL OIL',
    'INDUSTRIAL LUBRICANTS',
    'CHEMICAL ADDITIVES',
    'RAW MATERIALS',
    'PACKAGING SUPPLIES'
  ];

  const unitOptions = [
    'T', 'KG', 'L', 'M3', 'PCS', 'M', 'M2'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-orange-500 text-white px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">✏️ Edit Purchase</h2>
              <p className="text-orange-100 text-sm">#{purchase.purchase_number}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-orange-200 transition-colors text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Purchase Number & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purchase Number *
              </label>
              <input
                type="text"
                name="purchase_number"
                value={formData.purchase_number}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
          </div>

          {/* Supplier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier *
            </label>
            <div className="flex gap-2">
              <select
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              >
                <option value="">Select supplier...</option>
                {supplierOptions.map((supplier) => (
                  <option key={supplier} value={supplier}>
                    {supplier}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="px-3 py-2 text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
                title="Add new supplier"
              >
                ➕
              </button>
            </div>
          </div>

          {/* Product */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product *
            </label>
            <div className="flex gap-2">
              <select
                name="product"
                value={formData.product}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              >
                <option value="">Select product...</option>
                {productOptions.map((product) => (
                  <option key={product} value={product}>
                    {product}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="px-3 py-2 text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
                title="Add new product"
              >
                ➕
              </button>
            </div>
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0.01"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit *
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              >
                {unitOptions.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0.01"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency *
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="PLN">PLN (zł)</option>
              </select>
            </div>
          </div>

          {/* Status & VAT */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                VAT Rate (%)
              </label>
              <input
                type="number"
                name="vat_rate"
                value={formData.vat_rate}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Additional notes or description..."
            />
          </div>

          {/* Total Calculation */}
          {formData.quantity > 0 && formData.price > 0 && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Updated Total:</span>
                <span className="text-orange-600">
                  {(formData.quantity * formData.price).toFixed(2)} {formData.currency}
                </span>
              </div>
              {formData.vat_rate > 0 && (
                <div className="text-sm text-gray-600 mt-1">
                  VAT ({formData.vat_rate}%): {((formData.quantity * formData.price) * (formData.vat_rate / 100)).toFixed(2)} {formData.currency}
                </div>
              )}
              <div className="text-sm text-gray-500 mt-2">
                Original: {purchase.total.toFixed(2)} {purchase.currency}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.supplier.trim() || !formData.product.trim()}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <span className="animate-spin">⏳</span>}
              {loading ? 'Updating...' : 'Update Purchase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPurchaseModal;