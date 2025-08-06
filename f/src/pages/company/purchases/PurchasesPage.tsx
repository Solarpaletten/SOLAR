// f/src/pages/company/purchases/PurchasesPage.tsx
import React, { useState, useEffect } from 'react';
import PurchasesTable from './components/PurchasesTable';
import PurchasesToolbar from '../purchases/components/PurchasesToolbar';
import PurchasesStats from './components/PurchasesStats';
import AddPurchaseModal from './components/AddPurchaseModal';
import EditPurchaseModal from './components/EditPurchaseModal';
import { api } from '../../../api/axios';
import { 
  Purchase, 
  PurchasesStats as Stats, 
  PurchaseFormData,
  PurchasesResponse,
  PurchasesStatsResponse 
} from './types/purchasesTypes';

const PurchasesPage: React.FC = () => {
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

  // Search and filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [supplierFilter, setSupplierFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // ===============================================
  // 📡 API FUNCTIONS
  // ===============================================
  
  const fetchPurchases = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get<PurchasesResponse>('/api/company/purchases', {
        params: {
          search: searchTerm || undefined,
          status: statusFilter || undefined,
          supplier: supplierFilter || undefined,
          page: currentPage,
          limit: 50
        }
      });

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
        await fetchPurchases();
        await fetchStats();
      } else {
        throw new Error(response.data.message || 'Failed to create purchase');
      }
    } catch (error: any) {
      console.error('Error creating purchase:', error);
      alert(error.response?.data?.message || 'Failed to create purchase');
    }
  };

  const handleEditPurchase = async (id: number, formData: PurchaseFormData) => {
    try {
      const response = await api.put(`/api/company/purchases/${id}`, formData);
      
      if (response.data.success) {
        setShowEditModal(false);
        setEditingPurchase(null);
        await fetchPurchases();
        await fetchStats();
      } else {
        throw new Error(response.data.message || 'Failed to update purchase');
      }
    } catch (error: any) {
      console.error('Error updating purchase:', error);
      alert(error.response?.data?.message || 'Failed to update purchase');
    }
  };

  const handleDeletePurchase = async (id: number) => {
    if (!confirm('Are you sure you want to delete this purchase?')) {
      return;
    }

    try {
      const response = await api.delete(`/api/company/purchases/${id}`);
      
      if (response.data.success) {
        await fetchPurchases();
        await fetchStats();
      } else {
        throw new Error(response.data.message || 'Failed to delete purchase');
      }
    } catch (error: any) {
      console.error('Error deleting purchase:', error);
      alert(error.response?.data?.message || 'Failed to delete purchase');
    }
  };

  // ===============================================
  // 🔄 EFFECTS
  // ===============================================
  
  useEffect(() => {
    fetchPurchases();
  }, [searchTerm, statusFilter, supplierFilter, currentPage]);

  useEffect(() => {
    fetchStats();
  }, []);

  // ===============================================
  // 🎨 RENDER
  // ===============================================

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">🛒 Purchases Management</h1>
          <p className="text-blue-100 text-sm">Manage purchase orders and supplier relationships</p>
        </div>
        <button className="bg-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-800 transition-colors">
          Support (FAQ: 15)
        </button>
      </div>

      {/* Stats */}
      {stats && <PurchasesStats stats={stats} />}

      {/* Toolbar */}
      <PurchasesToolbar 
        onAddPurchase={() => setShowAddModal(true)}
        onSearch={setSearchTerm}
        onStatusFilter={setStatusFilter}
        onSupplierFilter={setSupplierFilter}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        supplierFilter={supplierFilter}
        totalPurchases={purchases.length}
      />

      {/* Error Display */}
      {error && (
        <div className="mx-4 my-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <div className="flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-hidden">
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