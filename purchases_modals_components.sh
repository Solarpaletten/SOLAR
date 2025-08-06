#!/bin/bash
# 📝 СОЗДАНИЕ МОДАЛОВ PURCHASES: ADD & EDIT
# Продолжаем создание полного Purchases Module

echo "📝🔥 СОЗДАНИЕ МОДАЛОВ PURCHASES! 🔥📝"
echo ""

# 1. Создаём AddPurchaseModal
echo "1️⃣ СОЗДАЁМ ADD PURCHASE MODAL:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat > f/src/pages/company/purchases/components/AddPurchaseModal.tsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { PurchaseFormData, PurchaseItem, Supplier, Product, Warehouse, User, Currency, PaymentStatus, DeliveryStatus, DocumentStatus } from '../types/purchasesTypes';
import { api } from '../../../../api/axios';

interface AddPurchaseModalProps {
  onClose: () => void;
  onSubmit: (data: PurchaseFormData) => Promise<void>;
}

const AddPurchaseModal: React.FC<AddPurchaseModalProps> = ({ onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Form data
  const [formData, setFormData] = useState<PurchaseFormData>({
    document_date: new Date().toISOString().split('T')[0],
    operation_type: 'PURCHASE',
    supplier_id: 0,
    warehouse_id: undefined,
    purchase_manager_id: undefined,
    currency: 'EUR',
    payment_status: 'PENDING',
    delivery_status: 'PENDING',
    document_status: 'DRAFT',
    items: []
  });

  // Item form for adding products
  const [newItem, setNewItem] = useState<Partial<PurchaseItem>>({
    product_id: 0,
    quantity: 1,
    unit_price_base: 0,
    vat_rate: 21,
    notes: ''
  });

  // ===============================================
  // 📡 LOAD DATA
  // ===============================================
  
  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      // Load suppliers (clients with supplier flag)
      const suppliersRes = await api.get('/api/company/clients?type=supplier');
      if (suppliersRes.data.success) {
        setSuppliers(suppliersRes.data.clients);
      }

      // Load products
      const productsRes = await api.get('/api/company/products');
      if (productsRes.data.success) {
        setProducts(productsRes.data.products);
      }

      // Load warehouses
      const warehousesRes = await api.get('/api/company/warehouses');
      if (warehousesRes.data.success) {
        setWarehouses(warehousesRes.data.warehouses);
      }

      // Load users (for purchase manager)
      const usersRes = await api.get('/api/company/users');
      if (usersRes.data.success) {
        setUsers(usersRes.data.users);
      }
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

  // ===============================================
  // 🧮 CALCULATIONS
  // ===============================================
  
  const calculateItemTotal = (item: Partial<PurchaseItem>) => {
    const subtotal = (item.quantity || 0) * (item.unit_price_base || 0);
    const vatAmount = subtotal * ((item.vat_rate || 0) / 100);
    return {
      line_total: subtotal + vatAmount,
      vat_amount: vatAmount
    };
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

  // ===============================================
  // 📝 FORM HANDLERS
  // ===============================================
  
  const addItem = () => {
    if (!newItem.product_id || !newItem.quantity || !newItem.unit_price_base) {
      setError('Please fill in all required item fields');
      return;
    }

    const product = products.find(p => p.id === newItem.product_id);
    if (!product) {
      setError('Selected product not found');
      return;
    }

    const calculations = calculateItemTotal(newItem);
    
    const item: PurchaseItem = {
      product_id: newItem.product_id!,
      line_number: formData.items.length + 1,
      quantity: newItem.quantity!,
      unit_price_base: newItem.unit_price_base!,
      vat_rate: newItem.vat_rate || 0,
      vat_amount: calculations.vat_amount,
      line_total: calculations.line_total,
      notes: newItem.notes,
      product
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));

    // Reset new item form
    setNewItem({
      product_id: 0,
      quantity: 1,
      unit_price_base: 0,
      vat_rate: 21,
      notes: ''
    });
    setError('');
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.supplier_id) {
      setError('Please select a supplier');
      return;
    }

    if (formData.items.length === 0) {
      setError('Please add at least one item');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || 'Error creating purchase');
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <span className="text-2xl mr-2">🛒</span>
            Create New Purchase
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-800 text-sm">{error}</div>
              </div>
            )}

            {/* Purchase Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Date *
                </label>
                <input
                  type="date"
                  value={formData.document_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, document_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier *
                </label>
                <select
                  value={formData.supplier_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, supplier_id: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value={0}>Select Supplier</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name} {supplier.company_name && `(${supplier.company_name})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warehouse
                </label>
                <select
                  value={formData.warehouse_id || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, warehouse_id: e.target.value ? Number(e.target.value) : undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map(warehouse => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Manager
                </label>
                <select
                  value={formData.purchase_manager_id || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchase_manager_id: e.target.value ? Number(e.target.value) : undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Manager</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value as Currency }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="EUR">€ Euro</option>
                  <option value="USD">$ US Dollar</option>
                  <option value="UAH">₴ Ukrainian Hryvnia</option>
                  <option value="AED">د.إ UAE Dirham</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={formData.payment_status}
                  onChange={(e) => setFormData(prev => ({ ...prev, payment_status: e.target.value as PaymentStatus }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="PARTIAL">Partial</option>
                  <option value="OVERDUE">Overdue</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Add Item Section */}
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📦</span>
                Add Products
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                  <select
                    value={newItem.product_id || 0}
                    onChange={(e) => {
                      const productId = Number(e.target.value);
                      const product = products.find(p => p.id === productId);
                      setNewItem(prev => ({
                        ...prev,
                        product_id: productId,
                        unit_price_base: product?.cost_price || product?.price || 0
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value={0}>Select Product</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    min="0"
                    step="0.001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                  <input
                    type="number"
                    value={newItem.unit_price_base}
                    onChange={(e) => setNewItem(prev => ({ ...prev, unit_price_base: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">VAT %</label>
                  <select
                    value={newItem.vat_rate}
                    onChange={(e) => setNewItem(prev => ({ ...prev, vat_rate: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value={0}>0%</option>
                    <option value={9}>9%</option>
                    <option value={21}>21%</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addItem}
                    className="w-full bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 text-sm"
                  >
                    ➕ Add
                  </button>
                </div>
              </div>

              {newItem.product_id && newItem.quantity && newItem.unit_price_base ? (
                <div className="bg-gray-50 p-2 rounded text-sm">
                  Total: €{calculateItemTotal(newItem).line_total.toFixed(2)} 
                  (incl. VAT: €{calculateItemTotal(newItem).vat_amount.toFixed(2)})
                </div>
              ) : null}
            </div>

            {/* Items List */}
            {formData.items.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                <div className="bg-gray-50 px-4 py-2">
                  <h4 className="text-lg font-medium text-gray-900">Purchase Items</h4>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {formData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {item.product?.name || `Product #${item.product_id}`}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {item.quantity} {item.product?.unit}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        €{item.unit_price_base.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">
                        €{item.line_total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
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
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? '⏳ Updating...' : '✅ Update Purchase'}
        </button>
      </div>
    </form>
  );
};

export default EditPurchaseModal;
EOF

echo "✅ EditPurchaseModal создан!"

# 3. Создаём PurchasesStats
echo ""
echo "3️⃣ СОЗДАЁМ PURCHASES STATS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat > f/src/pages/company/purchases/components/PurchasesStats.tsx << 'EOF'
import React from 'react';
import { PurchasesStats as Stats } from '../types/purchasesTypes';

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
EOF

echo "✅ PurchasesStats создан!"

# 4. Обновляем index.ts
echo ""
echo "4️⃣ ОБНОВЛЯЕМ INDEX.TS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat > f/src/pages/company/purchases/index.ts << 'EOF'
export { default } from './PurchasesPage';
export { default as PurchasesPage } from './PurchasesPage';
export { default as PurchasesTable } from './components/PurchasesTable';
export { default as PurchasesToolbar } from './components/PurchasesToolbar';
export { default as PurchasesStats } from './components/PurchasesStats';
export { default as AddPurchaseModal } from './components/AddPurchaseModal';
export { default as EditPurchaseModal } from './components/EditPurchaseModal';
export * from './types/purchasesTypes';
EOF

# 5. Создаём роутинг файл для добавления в App.tsx
echo ""
echo "5️⃣ СОЗДАЁМ ИНСТРУКЦИИ ПО РОУТИНГУ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat > f/src/pages/company/purchases/ROUTING_INSTRUCTIONS.md << 'EOF'
# 🛒 PURCHASES MODULE - ROUTING SETUP

## 📍 Добавьте в App.tsx или основной router:

```tsx
// 1. Import
import PurchasesPage from './pages/company/purchases';

// 2. Route (в company section)
<Route path="/company/purchases" element={<PurchasesPage />} />
```

## 🔗 Добавьте в navigation menu:

```tsx
{
  path: '/company/purchases',
  label: 'Purchases',
  icon: '🛒',
  description: 'Manage purchase orders'
}
```

## 🧪 Test URL:
```
http://localhost:5173/company/purchases
```

## ✅ Проверьте что у вас есть:
- [x] API routes: /api/company/purchases
- [x] Backend controller работает
- [x] Company context подключен
- [x] axios API настроен
EOF

echo ""
echo "🎊🔥🛒 PURCHASES MODULE ПОЛНОСТЬЮ ГОТОВ! 🛒🔥🎊"
echo ""
echo "✅ СОЗДАННЫЕ КОМПОНЕНТЫ:"
echo "   📝 AddPurchaseModal.tsx - Форма создания покупки с товарами"
echo "   ✏️ EditPurchaseModal.tsx - Форма редактирования статусов"
echo "   📊 PurchasesStats.tsx - Статистика покупок"
echo "   📋 PurchasesPage.tsx - Основная страница (уже создан)"
echo "   📊 PurchasesTable.tsx - Таблица покупок (уже создан)"
echo "   🔧 PurchasesToolbar.tsx - Исправленный тулбар"
echo "   📊 purchasesTypes.ts - Полные TypeScript типы"
echo ""
echo "🚀 СЛЕДУЮЩИЕ ШАГИ:"
echo "   1️⃣ Скопируйте файлы в ваш проект"
echo "   2️⃣ Добавьте роут в App.tsx"
echo "   3️⃣ Протестируйте на /company/purchases"
echo "   4️⃣ Убедитесь что API /api/company/purchases работает"
echo ""
echo "💎 FEATURES:"
echo "   🛒 Создание покупок с несколькими товарами"
echo "   ✏️ Редактирование статусов (Payment/Delivery/Document)"
echo "   🔍 Фильтрация по поставщикам, датам, статусам"
echo "   📊 Статистика в реальном времени"
echo "   💰 Автоматический расчёт НДС и итогов"
echo "   📦 Интеграция с товарами и складами"-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">VAT</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {item.product?.name}
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
                          <td className="px-4 py-2">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Totals */}
            {formData.items.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
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
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || formData.items.length === 0}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Creating...' : '✅ Create Purchase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPurchaseModal;
EOF

echo "✅ AddPurchaseModal создан!"

# 2. Создаём EditPurchaseModal
echo ""
echo "2️⃣ СОЗДАЁМ EDIT PURCHASE MODAL:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat > f/src/pages/company/purchases/components/EditPurchaseModal.tsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { Purchase, PurchaseFormData } from '../types/purchasesTypes';
import AddPurchaseModal from './AddPurchaseModal';

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

  // Используем тот же компонент что и для создания, но с предзаполненными данными
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
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

        {/* Items Display (read-only for now) */}
        {formData.items && formData.items.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2">
              <h4 className="text-lg font-medium text-gray-900">Purchase Items</h4>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-2 text-left text