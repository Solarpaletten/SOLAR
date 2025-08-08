// f/src/pages/company/purchases/PurchaseDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompanyContext } from '../../../contexts/CompanyContext';
import { api } from '../../../api/axios';
import { Purchase, PurchaseFormData, PurchaseItem } from './types/purchasesTypes';
import PurchaseItemsTable from './components/PurchaseItemsTable';
import ColumnSettingsModal from './components/ColumnSettingsModal';

const PurchaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { companyId } = useCompanyContext();

  // ===============================================
  // 🏗️ STATE MANAGEMENT
  // ===============================================
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'account' | 'overhead'>('account');
  const [showColumnSettings, setShowColumnSettings] = useState(false);

  // Form data
  const [formData, setFormData] = useState<PurchaseFormData>({
    document_date: '',
    operation_type: 'PURCHASE',
    supplier_id: 0,
    currency: 'EUR',
    payment_status: 'PENDING',
    delivery_status: 'PENDING',
    document_status: 'DRAFT',
    items: []
  });

  // ===============================================
  // 📡 DATA LOADING
  // ===============================================
  useEffect(() => {
    if (id && companyId) {
      fetchPurchase();
    }
  }, [id, companyId]);

  const fetchPurchase = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/company/purchases/${id}`, {
        headers: { 'Company-ID': companyId?.toString() || '1' }
      });

      if (response.data.success) {
        const purchaseData = response.data.purchase;
        setPurchase(purchaseData);
        
        // Convert to form data
        setFormData({
          document_date: purchaseData.document_date,
          due_date: purchaseData.due_date,
          operation_type: purchaseData.operation_type,
          supplier_id: purchaseData.supplier_id,
          supplier_code: purchaseData.supplier_code,
          warehouse_id: purchaseData.warehouse_id,
          purchase_manager_id: purchaseData.purchase_manager_id,
          currency: purchaseData.currency,
          foreign_currency: purchaseData.foreign_currency,
          exchange_rate: purchaseData.exchange_rate,
          country: purchaseData.country,
          city: purchaseData.city,
          business_license_code: purchaseData.business_license_code,
          delivery_method: purchaseData.delivery_method,
          vat_classification: purchaseData.vat_classification,
          vat_date: purchaseData.vat_date,
          vat_comment: purchaseData.vat_comment,
          payment_status: purchaseData.payment_status,
          delivery_status: purchaseData.delivery_status,
          document_status: purchaseData.document_status,
          advance_payment: purchaseData.advance_payment,
          discount_percent: purchaseData.discount_percent,
          discount_amount: purchaseData.discount_amount,
          additional_expenses: purchaseData.additional_expenses,
          comments: purchaseData.comments,
          items: purchaseData.items || []
        });
      }
    } catch (error) {
      console.error('Error fetching purchase:', error);
    } finally {
      setLoading(false);
    }
  };

  // ===============================================
  // 💾 SAVE HANDLERS
  // ===============================================
  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await api.put(`/api/company/purchases/${id}`, formData, {
        headers: { 'Company-ID': companyId?.toString() || '1' }
      });

      if (response.data.success) {
        alert('✅ Purchase saved successfully');
        await fetchPurchase(); // Refresh data
      }
    } catch (error: any) {
      console.error('Error saving purchase:', error);
      alert(`❌ Error saving purchase: ${error.response?.data?.message || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    navigate('/purchases');
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this purchase?')) return;

    try {
      await api.delete(`/api/company/purchases/${id}`, {
        headers: { 'Company-ID': companyId?.toString() || '1' }
      });
      alert('✅ Purchase deleted successfully');
      navigate('/purchases');
    } catch (error: any) {
      console.error('Error deleting purchase:', error);
      alert(`❌ Error deleting purchase: ${error.response?.data?.message || error.message}`);
    }
  };

  // ===============================================
  // 📝 FORM HANDLERS
  // ===============================================
  const updateFormField = (field: keyof PurchaseFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateItems = (items: PurchaseItem[]) => {
    setFormData(prev => ({
      ...prev,
      items
    }));
  };

  // ===============================================
  // 🎨 RENDER
  // ===============================================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">⏳ Loading purchase details...</div>
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">❌ Purchase not found</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Action Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="text-xl mr-2">📝</span>
            Purchase: {purchase.document_number}
          </h1>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              💾 Save
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              ❌ Close
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              🖨️ Print
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              🗑️ Delete
            </button>
            <div className="border-l border-gray-300 h-6 mx-2"></div>
            <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
              📋 Deductions
            </button>
            <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
              📁 File storage
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('account')}
            className={`py-3 border-b-2 text-sm font-medium ${
              activeTab === 'account'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Account information
          </button>
          <button
            onClick={() => setActiveTab('overhead')}
            className={`py-3 border-b-2 text-sm font-medium ${
              activeTab === 'overhead'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overhead costs
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Form Fields */}
        <div className="w-2/3 bg-white overflow-y-auto">
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Warehouse <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.warehouse_id || ''}
                      onChange={(e) => updateFormField('warehouse_id', parseInt(e.target.value) || undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select warehouse</option>
                      <option value="1">Prekes</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Operation <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.operation_type}
                      onChange={(e) => updateFormField('operation_type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PURCHASE">Pirkimas</option>
                      <option value="RETURN">Return</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={purchase.supplier?.name || ''}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      readOnly
                    />
                    <button className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200">
                      ✏️
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purchase date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.document_date}
                      onChange={(e) => updateFormField('document_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Series</label>
                    <input
                      type="text"
                      defaultValue="AB"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={purchase.document_number}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      readOnly
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => updateFormField('currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                      <option value="UAH">UAH</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Advance employee</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due date</label>
                    <input
                      type="date"
                      value={formData.due_date || ''}
                      onChange={(e) => updateFormField('due_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">VAT rate</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                  <input
                    type="text"
                    value={purchase.purchase_manager?.first_name + ' ' + purchase.purchase_manager?.last_name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                  <textarea
                    value={formData.comments || ''}
                    onChange={(e) => updateFormField('comments', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier code</label>
                  <input
                    type="text"
                    value={formData.supplier_code || ''}
                    onChange={(e) => updateFormField('supplier_code', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adv. payment date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">💰 Summary</h3>
                  <div className="text-sm text-green-700">EUR</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">VAT</label>
                    <input
                      type="number"
                      step="0.01"
                      value={purchase.vat_amount}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">VAT date</label>
                    <input
                      type="date"
                      value={formData.vat_date || ''}
                      onChange={(e) => updateFormField('vat_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Locked</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.payment_status}
                      onChange={(e) => updateFormField('payment_status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PAID">Paid</option>
                      <option value="PARTIAL">Partial</option>
                      <option value="OVERDUE">Overdue</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated VAT</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.estimated_vat || 0}
                    onChange={(e) => updateFormField('estimated_vat', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total excl. VAT</label>
                  <input
                    type="number"
                    step="0.01"
                    value={purchase.total_excl_vat || purchase.subtotal}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total incl VAT</label>
                  <input
                    type="number"
                    step="0.01"
                    value={purchase.total_amount}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                    readOnly
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount, %</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.discount_percent || 0}
                      onChange={(e) => updateFormField('discount_percent', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount sum</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.discount_amount || 0}
                      onChange={(e) => updateFormField('discount_amount', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rounding amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.rounding_amount || 0}
                    onChange={(e) => updateFormField('rounding_amount', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded p-2">
                  ⚠️ Rounding when paying in cash. Choose the Expert plan and make use of additional features.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Summary */}
        <div className="w-1/3 bg-gray-50 border-l border-gray-200 overflow-y-auto">
          <div className="p-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-4 flex items-center">
                📊 Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Currency:</span>
                  <span className="font-medium">EUR</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT:</span>
                  <span className="font-medium">{purchase.vat_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT date:</span>
                  <span className="font-medium">-</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated VAT:</span>
                  <span className="font-medium">{formData.estimated_vat?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total excl. VAT:</span>
                  <span className="font-medium">{(purchase.total_excl_vat || purchase.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t border-green-300 pt-2 mt-3">
                  <span>Total incl VAT:</span>
                  <span>{purchase.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount, %:</span>
                  <span className="font-medium">{formData.discount_percent?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount sum:</span>
                  <span className="font-medium">{formData.discount_amount?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rounding amount:</span>
                  <span className="font-medium">{formData.rounding_amount?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Positions Table */}
      <div className="bg-white border-t border-gray-200">
        <div className="px-6 py-4 bg-blue-600 text-white">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">📦 Purchase positions</h2>
            <div className="flex items-center space-x-2">
              <button className="p-1 bg-green-500 hover:bg-green-600 rounded text-white">+</button>
              <button className="p-1 bg-red-500 hover:bg-red-600 rounded text-white">-</button>
            </div>
          </div>
        </div>
        
        <PurchaseItemsTable
          items={formData.items}
          onItemsChange={updateItems}
          showColumnSettings={() => setShowColumnSettings(true)}
        />
      </div>

      {/* Column Settings Modal */}
      <ColumnSettingsModal
        isOpen={showColumnSettings}
        onClose={() => setShowColumnSettings(false)}
        columns={[]} // Will be passed from PurchaseItemsTable
        onColumnsChange={() => {}} // Will be implemented
      />
    </div>
  );
};

export default PurchaseDetailPage;