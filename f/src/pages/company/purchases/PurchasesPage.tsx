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
  PurchasesFilter,
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
  const [bulkLoading, setBulkLoading] = useState(false);
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
    sort_order: 'desc',
  });

  // ===============================================
  // 📡 API FUNCTIONS
  // ===============================================

  // MISSING FUNCTIONS

  const fetchPurchases = async () => {
    if (!companyId) return;

    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.supplier_id)
        params.append('supplier_id', filters.supplier_id.toString());
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      if (filters.sort_by) params.append('sort_by', filters.sort_by);
      if (filters.sort_order) params.append('sort_order', filters.sort_order);

      const response = await api.get<PurchasesResponse>(
        `/api/company/purchases?${params}`
      );

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
      const response = await api.get<PurchasesStatsResponse>(
        '/api/company/purchases/stats'
      );
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

  // Добавьте ЭТИ ФУНКЦИИ в PurchasesPage.tsx:

  // 🗑️ BULK DELETE - массовое удаление
  const handleBulkDelete = async (ids: number[]) => {
    if (
      !confirm(`Are you sure you want to delete ${ids.length} purchase(s)?`)
    ) {
      return;
    }

    setBulkLoading(true);

    try {
      // Удаляем по очереди
      const deletePromises = ids.map((id) =>
        api.delete(`/api/company/purchases/${id}`, {
          headers: { 'Company-ID': companyId?.toString() || '1' },
        })
      );

      await Promise.all(deletePromises);

      // Обновляем данные
      await fetchPurchases();
      await fetchStats();

      alert(`✅ Successfully deleted ${ids.length} purchase(s)`);
    } catch (error: any) {
      console.error('Error bulk deleting purchases:', error);
      alert(
        `❌ Error deleting purchases: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setBulkLoading(false);
    }
  };

  // 🗑️ DELETE SINGLE PURCHASE - удаление одной покупки через bulk операцию
  const handleDeletePurchase = async (id: number) => {
    // Просто вызываем уже существующую bulk функцию с одним ID
    await handleBulkDelete([id]);
  };

  // 📋 BULK COPY - массовое копирование
  const handleBulkCopy = async (ids: number[]) => {
    setBulkLoading(true);

    try {
      // Получаем данные выбранных покупок
      const purchasesToCopy = purchases.filter((p) => ids.includes(p.id));

      // Создаём копии с новыми номерами документов
      const copyPromises = purchasesToCopy.map(async (purchase) => {
        const copyData: PurchaseFormData = {
          document_date: new Date().toISOString().split('T')[0], // Сегодняшняя дата
          operation_type: purchase.operation_type,
          supplier_id: purchase.supplier_id,
          warehouse_id: purchase.warehouse_id,
          purchase_manager_id: purchase.purchase_manager_id,
          currency: purchase.currency,
          payment_status: 'PENDING', // Сбрасываем на PENDING
          delivery_status: 'PENDING',
          document_status: 'DRAFT',
          items:
            purchase.items?.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
              unit_price_base: item.unit_price_base,
              vat_rate: item.vat_rate,
              vat_amount: item.vat_amount,
              line_total: item.line_total,
              notes: item.notes,
            })) || [],
        };

        return api.post('/api/company/purchases', copyData, {
          headers: { 'Company-ID': companyId?.toString() || '1' },
        });
      });

      await Promise.all(copyPromises);

      // Обновляем данные
      await fetchPurchases();
      await fetchStats();

      alert(`✅ Successfully copied ${ids.length} purchase(s)`);
    } catch (error: any) {
      console.error('Error bulk copying purchases:', error);
      alert(
        `❌ Error copying purchases: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setBulkLoading(false);
    }
  };

  // 📊 BULK EXPORT - экспорт выбранных
  const handleBulkExport = async (ids: number[]) => {
    setBulkLoading(true);

    try {
      const selectedPurchases = purchases.filter((p) => ids.includes(p.id));

      // Создаём CSV данные
      const csvHeaders = [
        'Document Number',
        'Date',
        'Supplier',
        'Total Amount',
        'Currency',
        'Payment Status',
        'Delivery Status',
      ];

      const csvData = selectedPurchases.map((purchase) => [
        purchase.document_number,
        new Date(purchase.document_date).toLocaleDateString(),
        purchase.supplier?.name || `Supplier #${purchase.supplier_id}`,
        purchase.total_amount,
        purchase.currency,
        purchase.payment_status,
        purchase.delivery_status,
      ]);

      // Создаём CSV контент
      const csvContent = [csvHeaders, ...csvData]
        .map((row) => row.map((cell) => `"${cell}"`).join(','))
        .join('\n');

      // Скачиваем файл
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `purchases_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(`✅ Exported ${ids.length} purchase(s) to CSV`);
    } catch (error: any) {
      console.error('Error exporting purchases:', error);
      alert(`❌ Error exporting purchases: ${error.message}`);
    } finally {
      setBulkLoading(false);
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
              {company?.name} • Manage purchase orders and supplier
              relationships
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
          onBulkDelete={handleBulkDelete} // ← Подключаем РЕАЛЬНУЮ функцию
          onBulkCopy={handleBulkCopy} // ← Подключаем РЕАЛЬНУЮ функцию
          onBulkExport={handleBulkExport} // ← Добавляем Export
          bulkLoading={bulkLoading} // ← Показываем загрузку
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
          onSubmit={(formData) =>
            handleEditPurchase(editingPurchase.id, formData)
          }
        />
      )}
    </div>
  );
};

export default PurchasesPage;
