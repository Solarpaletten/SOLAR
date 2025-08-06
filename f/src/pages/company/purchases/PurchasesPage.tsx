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
