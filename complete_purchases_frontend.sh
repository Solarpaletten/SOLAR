#!/bin/bash
# 🛒 СОЗДАНИЕ ПОЛНОГО PURCHASES FRONTEND MODULE
# Основано на анализе Prisma Schema + API Routes + Controller

echo "🎊🔥🛒 СОЗДАНИЕ PURCHASES FRONTEND MODULE! 🛒🔥🎊"
echo ""
echo "📊 АНАЛИЗ ПОКАЗАЛ:"
echo "   ✅ Prisma Schema: purchases + purchase_items"
echo "   ✅ API Routes: CRUD готов (/api/company/purchases)"
echo "   ✅ Controller: создание/редактирование работает"
echo "   ❌ Frontend: НЕ ХВАТАЕТ компонентов!"
echo ""

# 1. Создаём TypeScript типы на основе Prisma Schema
echo "1️⃣ СОЗДАЁМ TYPESCRIPT ТИПЫ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

mkdir -p f/src/pages/company/purchases/types

cat > f/src/pages/company/purchases/types/purchasesTypes.ts << 'EOF'
// 🛒 PURCHASES TYPES - На основе Prisma Schema

export type Currency = 'EUR' | 'USD' | 'UAH' | 'AED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'CANCELLED';
export type DeliveryStatus = 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type DocumentStatus = 'DRAFT' | 'CONFIRMED' | 'CANCELLED';
export type PurchaseOperationType = 'PURCHASE' | 'RETURN';

// 🏢 Supplier (Client) Interface
export interface Supplier {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company_name?: string;
  registration_number?: string;
  vat_number?: string;
  is_active: boolean;
}

// 📦 Product Interface
export interface Product {
  id: number;
  code: string;
  name: string;
  unit: string;
  price: number;
  cost_price?: number;
  currency: Currency;
  is_active: boolean;
}

// 🏭 Warehouse Interface
export interface Warehouse {
  id: number;
  name: string;
  code?: string;
  address?: string;
  is_active: boolean;
}

// 👤 User Interface
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

// 📋 Purchase Item Interface
export interface PurchaseItem {
  id?: number;
  purchase_id?: number;
  product_id: number;
  line_number?: number;
  quantity: number;
  unit_price_base: number;
  vat_rate?: number;
  vat_amount?: number;
  line_total: number;
  employee_id?: number;
  notes?: string;
  
  // Relations
  product?: Product;
  employee?: User;
}

// 🛒 Main Purchase Interface
export interface Purchase {
  id: number;
  company_id: number;
  document_number: string;
  document_date: string;
  operation_type: PurchaseOperationType;
  
  supplier_id: number;
  warehouse_id?: number;
  purchase_manager_id?: number;
  
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  currency: Currency;
  
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
  document_status: DocumentStatus;
  
  created_by: number;
  created_at: string;
  updated_by?: number;
  updated_at: string;
  
  // Relations
  supplier?: Supplier;
  warehouse?: Warehouse;
  purchase_manager?: User;
  creator?: User;
  modifier?: User;
  items?: PurchaseItem[];
}

// 📊 Statistics Interface
export interface PurchasesStats {
  total: number;
  pending: number;
  paid: number;
  partial: number;
  overdue: number;
  cancelled: number;
  totalSpent: number;
  averageOrderValue: number;
  topSuppliers: number;
}

// 🔍 Filter Interface
export interface PurchasesFilter {
  search?: string;
  status?: PaymentStatus;
  supplier_id?: number;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// 📝 Form Data Interfaces
export interface PurchaseFormData {
  document_number?: string;
  document_date: string;
  operation_type: PurchaseOperationType;
  supplier_id: number;
  warehouse_id?: number;
  purchase_manager_id?: number;
  currency: Currency;
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
  document_status: DocumentStatus;
  items: PurchaseItem[];
}

// 📡 API Response Interfaces
export interface PurchasesResponse {
  success: boolean;
  purchases: Purchase[];
  total: number;
  page: number;
  limit: number;
  companyId: number;
}

export interface PurchaseResponse {
  success: boolean;
  purchase: Purchase;
  companyId: number;
}

export interface PurchasesStatsResponse {
  success: boolean;
  stats: PurchasesStats;
  companyId: number;
}

export interface CreatePurchaseResponse {
  success: boolean;
  purchase: Purchase;
  message: string;
  companyId: number;
}

// 📋 Constants
export const PAYMENT_STATUSES = [
  { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'PAID', label: 'Paid', color: 'bg-green-100 text-green-800' },
  { value: 'PARTIAL', label: 'Partial', color: 'bg-blue-100 text-blue-800' },
  { value: 'OVERDUE', label: 'Overdue', color: 'bg-red-100 text-red-800' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-gray-100 text-gray-800' }
] as const;

export const DELIVERY_STATUSES = [
  { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'SHIPPED', label: 'Shipped', color: 'bg-blue-100 text-blue-800' },
  { value: 'DELIVERED', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-gray-100 text-gray-800' }
] as const;

export const DOCUMENT_STATUSES = [
  { value: 'DRAFT', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-green-100 text-green-800' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
] as const;

export const CURRENCIES = [
  { value: 'EUR', label: '€ Euro', symbol: '€' },
  { value: 'USD', label: '$ US Dollar', symbol: '$' },
  { value: 'UAH', label: '₴ Ukrainian Hryvnia', symbol: '₴' },
  { value: 'AED', label: 'د.إ UAE Dirham', symbol: 'د.إ' }
] as const;
EOF

# 2. Исправляем PurchasesToolbar
echo ""
echo "2️⃣ ИСПРАВЛЯЕМ PURCHASES TOOLBAR:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Копируем исправленный файл (уже создан выше)
echo "✅ PurchasesToolbar.tsx уже исправлен в предыдущем артефакте"

# 3. Создаём основную страницу PurchasesPage
echo ""
echo "3️⃣ СОЗДАЁМ PURCHASES PAGE:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat > f/src/pages/company/purchases/PurchasesPage.tsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { useCompanyContext } from '../../../contexts/CompanyContext';
import PurchasesTable from './components/PurchasesTable';
import PurchasesToolbar from './components/PurchasesToolbar';
import PurchasesStats from './components/PurchasesStats';
import AddPurchaseModal from './components/AddPurchaseModal';
import EditPurchaseModal from './components/EditPurchaseModal';
import { api } from '../../../api/axios';
import { 
  Purchase, 
  PurchasesStats as Stats, 
  PurchaseFormData,
  PurchasesResponse,
  PurchasesStatsResponse,
  PurchasesFilter
} from './types/purchasesTypes';

const PurchasesPage: React.FC = () => {
  const { companyId, company } = useCompanyContext();
  
  // ===============================================
  // 🏗️ STATE MANAGEMENT
  // ===============================================
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Modal states
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);

  // Filters
  const [filters, setFilters] = useState<PurchasesFilter>({
    search: '',
    status: undefined,
    supplier_id: undefined,
    date_from: '',
    date_to: '',
    sort_by: 'document_date',
    sort_order: 'desc'
  });

  // ===============================================
  // 📡 API FUNCTIONS
  // ===============================================
  
  const fetchPurchases = async () => {
    if (!companyId) return;
    
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.supplier_id) params.append('supplier_id', filters.supplier_id.toString());
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      if (filters.sort_by) params.append('sort_by', filters.sort_by);
      if (filters.sort_order) params.append('sort_order', filters.sort_order);

      const response = await api.get<PurchasesResponse>(`/api/company/purchases?${params}`);

      if (response.data.success) {
        setPurchases(response.data.purchases || []);
      } else {
        setError('Failed to fetch purchases');
      }
    } catch (error: any) {
      console.error('Error fetching purchases:', error);
      setError(error.response?.data?.message || 'Failed to fetch purchases');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!companyId) return;
    
    try {
      const response = await api.get<PurchasesStatsResponse>('/api/company/purchases/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreatePurchase = async (formData: PurchaseFormData) => {
    try {
      const response = await api.post('/api/company/purchases', formData);
      
      if (response.data.success) {
        setShowAddModal(false);
        fetchPurchases();
        fetchStats();
      } else {
        throw new Error(response.data.error || 'Failed to create purchase');
      }
    } catch (error: any) {
      console.error('Error creating purchase:', error);
      throw error;
    }
  };

  const handleEditPurchase = async (id: number, formData: PurchaseFormData) => {
    try {
      const response = await api.put(`/api/company/purchases/${id}`, formData);
      
      if (response.data.success) {
        setShowEditModal(false);
        setEditingPurchase(null);
        fetchPurchases();
        fetchStats();
      } else {
        throw new Error(response.data.error || 'Failed to update purchase');
      }
    } catch (error: any) {
      console.error('Error updating purchase:', error);
      throw error;
    }
  };

  const handleDeletePurchase = async (id: number) => {
    if (!confirm('Are you sure you want to delete this purchase?')) {
      return;
    }

    try {
      const response = await api.delete(`/api/company/purchases/${id}`);
      
      if (response.data.success) {
        fetchPurchases();
        fetchStats();
      } else {
        throw new Error(response.data.error || 'Failed to delete purchase');
      }
    } catch (error: any) {
      console.error('Error deleting purchase:', error);
      alert('Error deleting purchase: ' + (error.response?.data?.message || error.message));
    }
  };

  // ===============================================
  // 🔄 EFFECTS
  // ===============================================
  
  useEffect(() => {
    if (companyId) {
      fetchPurchases();
      fetchStats();
    }
  }, [companyId, filters]);

  // ===============================================
  // 🎨 RENDER
  // ===============================================
  
  if (!companyId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">⏳ Loading company context...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <span className="text-3xl mr-3">🛒</span>
              Purchases Management
            </h1>
            <p className="opacity-90 mt-1">
              {company?.name} • Manage purchase orders and supplier relationships
            </p>
          </div>
          <button className="bg-blue-700 px-4 py-2 rounded text-sm hover:bg-blue-800 transition-colors">
            Support (FAQ: 15)
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && <PurchasesStats stats={stats} />}

      {/* Toolbar */}
      <PurchasesToolbar 
        filters={filters}
        onFiltersChange={setFilters}
        onAddPurchase={() => setShowAddModal(true)}
        totalCount={purchases.length}
        loading={loading}
      />

      {/* Error Display */}
      {error && (
        <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-700">
            <span className="text-xl mr-2">⚠️</span>
            {error}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 px-6 pb-6">
        <PurchasesTable 
          purchases={purchases}
          loading={loading}
          onRefresh={fetchPurchases}
          onEdit={(purchase) => {
            setEditingPurchase(purchase);
            setShowEditModal(true);
          }}
          onDelete={handleDeletePurchase}
        />
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddPurchaseModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleCreatePurchase}
        />
      )}

      {showEditModal && editingPurchase && (
        <EditPurchaseModal
          purchase={editingPurchase}
          onClose={() => {
            setShowEditModal(false);
            setEditingPurchase(null);
          }}
          onSubmit={(formData) => handleEditPurchase(editingPurchase.id, formData)}
        />
      )}
    </div>
  );
};

export default PurchasesPage;
EOF

# 4. Создаём таблицу PurchasesTable
echo ""
echo "4️⃣ СОЗДАЁМ PURCHASES TABLE:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

mkdir -p f/src/pages/company/purchases/components

cat > f/src/pages/company/purchases/components/PurchasesTable.tsx << 'EOF'
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
EOF

echo ""
echo "🎊🔥🛒 ОСНОВА PURCHASES MODULE СОЗДАНА! 🛒🔥🎊"
echo ""
echo "✅ ЧТО СОЗДАНО:"
echo "   📊 purchasesTypes.ts - Полные TypeScript типы"
echo "   📋 PurchasesPage.tsx - Главная страница"
echo "   📊 PurchasesTable.tsx - Таблица покупок"
echo "   🔧 PurchasesToolbar.tsx - Исправлен"
echo ""
echo "🚀 СЛЕДУЮЩИЙ ШАГ: Создать AddPurchaseModal и EditPurchaseModal!"

# Создаём index.ts для экспорта
cat > f/src/pages/company/purchases/index.ts << 'EOF'
export { default } from './PurchasesPage';
export { default as PurchasesPage } from './PurchasesPage';
export * from './types/purchasesTypes';
EOF

echo "📦 Создан index.ts для экспорта модуля"