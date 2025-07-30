// f/src/pages/company/purchases/PurchasesPage.tsx
import React, { useState, useEffect } from 'react';
import CompanyLayout from '../../../components/company/CompanyLayout';
import { 
  Purchase, 
  PurchasesStats, 
  PurchasesFilter, 
  PurchasesResponse, 
  PurchasesStatsResponse,
  PurchaseFormData
} from './types/purchasesTypes';

// Import components
import PurchasesTable from './components/PurchasesTable';
import PurchasesToolbar from './components/PurchasesToolbar';
import AddPurchaseModal from './components/AddPurchaseModal';

// API service
const purchasesService = {
  async getStats(): Promise<PurchasesStats> {
    const token = localStorage.getItem('token');
    const companyId = localStorage.getItem('currentCompanyId');
    
    const response = await fetch('/api/company/purchases/stats', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-company-id': companyId || '',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch purchases stats');
    const data: PurchasesStatsResponse = await response.json();
    return data.stats;
  },

  async getPurchases(filters: PurchasesFilter = {}): Promise<PurchasesResponse> {
    const token = localStorage.getItem('token');
    const companyId = localStorage.getItem('currentCompanyId');
    
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await fetch(`/api/company/purchases?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-company-id': companyId || '',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch purchases');
    return response.json();
  },

  async createPurchase(data: PurchaseFormData): Promise<Purchase> {
    const token = localStorage.getItem('token');
    const companyId = localStorage.getItem('currentCompanyId');
    
    const response = await fetch('/api/company/purchases', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-company-id': companyId || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Failed to create purchase');
    const result = await response.json();
    return result.purchase;
  }
};

// Stats Component
const StatsCards: React.FC<{ stats: PurchasesStats }> = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-indigo-100 text-sm font-medium">Total Purchases</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-indigo-400 rounded-full p-3">
          🛍️
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-red-100 text-sm font-medium">Total Spent</p>
          <p className="text-2xl font-bold">€{stats.totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-red-400 rounded-full p-3">
          💸
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-yellow-100 text-sm font-medium">Pending Payment</p>
          <p className="text-3xl font-bold">{stats.pending}</p>
        </div>
        <div className="bg-yellow-400 rounded-full p-3">
          ⏳
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-teal-100 text-sm font-medium">Avg Order Value</p>
          <p className="text-2xl font-bold">€{stats.averageOrderValue.toLocaleString()}</p>
        </div>
        <div className="bg-teal-400 rounded-full p-3">
          📊
        </div>
      </div>
    </div>
  </div>
);

// Main Purchases Page Component
const PurchasesPage: React.FC = () => {
  const [stats, setStats] = useState<PurchasesStats | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [filters, setFilters] = useState<PurchasesFilter>({
    page: 1,
    limit: 50,
    sort_by: 'document_date',
    sort_order: 'desc'
  });

  const fetchStats = async () => {
    try {
      const statsData = await purchasesService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch purchases stats:', err);
      setError('Failed to fetch purchases statistics');
    }
  };

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await purchasesService.getPurchases(filters);
      setPurchases(response.purchases);
    } catch (err) {
      console.error('Failed to fetch purchases:', err);
      setError('Failed to fetch purchases');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePurchase = async (data: PurchaseFormData) => {
    setCreateLoading(true);
    try {
      await purchasesService.createPurchase(data);
      setShowAddModal(false);
      fetchPurchases(); // Refresh the list
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error('Error creating purchase:', error);
      throw error; // Re-throw to let modal handle it
    } finally {
      setCreateLoading(false);
    }
  };

  const handleSort = (field: string) => {
    const newOrder = filters.sort_by === field && filters.sort_order === 'asc' ? 'desc' : 'asc';
    setFilters(prev => ({
      ...prev,
      sort_by: field,
      sort_order: newOrder
    }));
  };

  const handleView = (purchase: Purchase) => {
    // TODO: Implement view functionality
    console.log('View purchase:', purchase);
  };

  const handleEdit = (purchase: Purchase) => {
    // TODO: Implement edit functionality
    console.log('Edit purchase:', purchase);
  };

  const handleDelete = (purchase: Purchase) => {
    // TODO: Implement delete functionality
    console.log('Delete purchase:', purchase);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export purchases');
  };

  useEffect(() => {
    fetchStats();
    fetchPurchases();
  }, []);

  useEffect(() => {
    fetchPurchases();
  }, [filters]);

  const handleFiltersChange = (newFilters: PurchasesFilter) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  if (error) {
    return (
      <CompanyLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="text-red-400 text-xl mr-3">⚠️</div>
              <div>
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-700 mt-1">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    fetchStats();
                    fetchPurchases();
                  }}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              🛍️ Purchases Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your purchase orders, supplier invoices and procurement
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
              🛍️ Purchases Module
            </span>
          </div>
        </div>

        {/* Stats */}
        {stats && <StatsCards stats={stats} />}

        {/* Toolbar */}
        <PurchasesToolbar 
          filters={filters} 
          onFiltersChange={handleFiltersChange}
          onAddPurchase={() => setShowAddModal(true)}
          onExport={handleExport}
          totalCount={purchases.length}
          loading={loading}
        />

        {/* Purchases Table */}
        <PurchasesTable 
          purchases={purchases}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          sortBy={filters.sort_by}
          sortOrder={filters.sort_order}
          onSort={handleSort}
        />

        {/* Add Purchase Modal */}
        <AddPurchaseModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleCreatePurchase}
          loading={createLoading}
        />
      </div>
    </CompanyLayout>
  );
};

export default PurchasesPage;