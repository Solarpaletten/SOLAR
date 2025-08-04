// f/src/pages/company/sales/SalesPage.tsx
import React, { useState, useEffect } from 'react';
import CompanyLayout from '../../../components/company/CompanyLayout.tsx';
import { 
  Sale, 
  SalesStats, 
  SalesFilter, 
  SalesResponse, 
  SalesStatsResponse,
  SaleFormData
} from './types/salesTypes';

// Import components
import SalesTable from './components/SalesTable';
import SalesToolbar from './components/SalesToolbar';
import AddSaleModal from './components/AddSaleModal';

// API service
const salesService = {
  async getStats(): Promise<SalesStats> {
    const token = localStorage.getItem('authToken') || localStorage.getItem('auth_token') || localStorage.getItem('token');;
    const companyId = localStorage.getItem('currentCompanyId');
    
    const response = await fetch('/api/company/sales/stats', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-company-id': companyId || '',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch sales stats');
    const data: SalesStatsResponse = await response.json();
    return data.stats;
  },

  async getSales(filters: SalesFilter = {}): Promise<SalesResponse> {
    const token = localStorage.getItem('authToken') || localStorage.getItem('auth_token') || localStorage.getItem('token');
    const companyId = localStorage.getItem('currentCompanyId');
    
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await fetch(`/api/company/sales?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-company-id': companyId || '',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch sales');
    return response.json();
  },

  async createSale(data: SaleFormData): Promise<Sale> {
    const token = localStorage.getItem('authToken') || localStorage.getItem('auth_token') || localStorage.getItem('token');
    const companyId = localStorage.getItem('currentCompanyId');
    
    const response = await fetch('/api/company/sales', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-company-id': companyId || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Failed to create sale');
    const result = await response.json();
    return result.sale;
  }
};

// Stats Component
const StatsCards: React.FC<{ stats: SalesStats }> = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-100 text-sm font-medium">Total Sales</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-blue-400 rounded-full p-3">
          💰
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-green-100 text-sm font-medium">Total Revenue</p>
          <p className="text-2xl font-bold">€{stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-green-400 rounded-full p-3">
          💸
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-orange-100 text-sm font-medium">Pending Payment</p>
          <p className="text-3xl font-bold">{stats.pending}</p>
        </div>
        <div className="bg-orange-400 rounded-full p-3">
          ⏳
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-purple-100 text-sm font-medium">Avg Order Value</p>
          <p className="text-2xl font-bold">€{stats.averageOrderValue.toLocaleString()}</p>
        </div>
        <div className="bg-purple-400 rounded-full p-3">
          📊
        </div>
      </div>
    </div>
  </div>
);

// Main Sales Page Component
const SalesPage: React.FC = () => {
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [filters, setFilters] = useState<SalesFilter>({
    page: 1,
    limit: 50,
    sort_by: 'document_date',
    sort_order: 'desc'
  });

  const fetchStats = async () => {
    try {
      const statsData = await salesService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch sales stats:', err);
      setError('Failed to fetch sales statistics');
    }
  };

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await salesService.getSales(filters);
      setSales(response.sales);
    } catch (err) {
      console.error('Failed to fetch sales:', err);
      setError('Failed to fetch sales');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSale = async (data: SaleFormData) => {
    setCreateLoading(true);
    try {
      await salesService.createSale(data);
      setShowAddModal(false);
      fetchSales(); // Refresh the list
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error('Error creating sale:', error);
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

  const handleView = (sale: Sale) => {
    // TODO: Implement view functionality
    console.log('View sale:', sale);
  };

  const handleEdit = (sale: Sale) => {
    // TODO: Implement edit functionality
    console.log('Edit sale:', sale);
  };

  const handleDelete = (sale: Sale) => {
    // TODO: Implement delete functionality
    console.log('Delete sale:', sale);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export sales');
  };

  useEffect(() => {
    fetchStats();
    fetchSales();
  }, []);

  useEffect(() => {
    fetchSales();
  }, [filters]);

  const handleFiltersChange = (newFilters: SalesFilter) => {
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
                    fetchSales();
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
              💰 Sales Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your sales orders, invoices and revenue
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              💼 Sales Module
            </span>
          </div>
        </div>

        {/* Stats */}
        {stats && <StatsCards stats={stats} />}

        {/* Toolbar */}
        <SalesToolbar 
          filters={filters} 
          onFiltersChange={handleFiltersChange}
          onAddSale={() => setShowAddModal(true)}
          onExport={handleExport}
          totalCount={sales.length}
          loading={loading}
        />

        {/* Sales Table */}
        <SalesTable 
          sales={sales}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          sortBy={filters.sort_by}
          sortOrder={filters.sort_order}
          onSort={handleSort}
        />

        {/* Add Sale Modal */}
        <AddSaleModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleCreateSale}
          loading={createLoading}
        />
      </div>
    </CompanyLayout>
  );
};

export default SalesPage;