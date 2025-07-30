// f/src/pages/company/warehouse/WarehousePage.tsx
import React, { useState, useEffect } from 'react';
import CompanyLayout from '../../../components/company/CompanyLayout';
import { 
  Warehouse, 
  WarehouseStats, 
  WarehouseFilter, 
  WarehousesResponse, 
  WarehouseStatsResponse,
  WarehouseFormData
} from './types/warehouseTypes';

// API service
const warehouseService = {
  async getStats(): Promise<WarehouseStats> {
    const token = localStorage.getItem('token');
    const companyId = localStorage.getItem('currentCompanyId');
    
    const response = await fetch('/api/company/warehouses/stats', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-company-id': companyId || '',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch warehouse stats');
    const data: WarehouseStatsResponse = await response.json();
    return data.stats;
  },

  async getWarehouses(filters: WarehouseFilter = {}): Promise<WarehousesResponse> {
    const token = localStorage.getItem('token');
    const companyId = localStorage.getItem('currentCompanyId');
    
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await fetch(`/api/company/warehouses?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-company-id': companyId || '',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch warehouses');
    return response.json();
  },

  async createWarehouse(data: WarehouseFormData): Promise<Warehouse> {
    const token = localStorage.getItem('token');
    const companyId = localStorage.getItem('currentCompanyId');
    
    const response = await fetch('/api/company/warehouses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-company-id': companyId || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Failed to create warehouse');
    const result = await response.json();
    return result.warehouse;
  }
};

// Stats Component
const StatsCards: React.FC<{ stats: WarehouseStats }> = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-100 text-sm font-medium">Total Warehouses</p>
          <p className="text-3xl font-bold">{stats?.total_warehouses || 0}</p>
        </div>
        <div className="bg-blue-400 rounded-full p-3">
          🏭
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-green-100 text-sm font-medium">Active Warehouses</p>
          <p className="text-3xl font-bold">{stats?.active_warehouses || 0}</p>
        </div>
        <div className="bg-green-400 rounded-full p-3">
          ✅
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-purple-100 text-sm font-medium">Total Products</p>
          <p className="text-3xl font-bold">{stats?.total_products || 0}</p>
        </div>
        <div className="bg-purple-400 rounded-full p-3">
          📦
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-orange-100 text-sm font-medium">Low Stock Items</p>
          <p className="text-3xl font-bold">{stats?.low_stock_items || 0}</p>
        </div>
        <div className="bg-orange-400 rounded-full p-3">
          ⚠️
        </div>
      </div>
    </div>
  </div>
);

// Warehouse Table Component
const WarehouseTable: React.FC<{
  warehouses: Warehouse[];
  loading: boolean;
  onView: (warehouse: Warehouse) => void;
  onEdit: (warehouse: Warehouse) => void;
  onDelete: (warehouse: Warehouse) => void;
}> = ({ warehouses, loading, onView, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (warehouses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-6xl mb-4">🏭</div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No Warehouses Found</h3>
        <p className="text-gray-500 mb-6">Create your first warehouse to start managing inventory</p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
          Create Warehouse
        </button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'ACTIVE': { color: 'bg-green-100 text-green-800', text: 'Active' },
      'INACTIVE': { color: 'bg-gray-100 text-gray-800', text: 'Inactive' },
      'MAINTENANCE': { color: 'bg-yellow-100 text-yellow-800', text: 'Maintenance' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['ACTIVE'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Warehouse
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Manager
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transactions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {warehouses.map((warehouse) => (
              <tr key={warehouse.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        {warehouse.is_main && <span className="text-blue-500">⭐</span>}
                        {warehouse.name}
                      </div>
                    </div>
                    {warehouse.address && (
                      <div className="text-sm text-gray-500 mt-1">
                        📍 {warehouse.address}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-gray-700">
                    {warehouse.code || '-'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {warehouse.manager ? 
                      `${warehouse.manager.first_name} ${warehouse.manager.last_name}` : 
                      'No manager assigned'
                    }
                  </div>
                  {warehouse.manager?.email && (
                    <div className="text-sm text-gray-500">
                      {warehouse.manager.email}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(warehouse.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="space-y-1">
                    <div>📤 Sales: {warehouse._count?.sales || 0}</div>
                    <div>📥 Purchases: {warehouse._count?.purchases || 0}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onView(warehouse)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      👁️ View
                    </button>
                    <button
                      onClick={() => onEdit(warehouse)}
                      className="text-green-600 hover:text-green-900 transition-colors"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => onDelete(warehouse)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Add Warehouse Modal Component
const AddWarehouseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WarehouseFormData) => Promise<void>;
  loading?: boolean;
}> = ({ isOpen, onClose, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<WarehouseFormData>({
    name: '',
    code: '',
    description: '',
    address: '',
    manager_id: undefined,
    status: 'ACTIVE',
    is_main: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Warehouse name is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        name: '',
        code: '',
        description: '',
        address: '',
        manager_id: undefined,
        status: 'ACTIVE',
        is_main: false
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error creating warehouse:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              🏭 Create New Warehouse
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warehouse Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter warehouse name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warehouse Code
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="WH001"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Warehouse description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Warehouse address"
            />
          </div>

          {/* Status and Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>

            <div className="flex items-center pt-8">
              <input
                type="checkbox"
                id="is_main"
                checked={formData.is_main}
                onChange={(e) => setFormData(prev => ({ ...prev, is_main: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_main" className="ml-2 block text-sm text-gray-700">
                ⭐ Main Warehouse
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>🏭 Create Warehouse</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Warehouse Page Component
const WarehousePage: React.FC = () => {
  const [stats, setStats] = useState<WarehouseStats | null>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [filters, setFilters] = useState<WarehouseFilter>({
    page: 1,
    limit: 50,
    sort_by: 'name',
    sort_order: 'asc'
  });

  const fetchStats = async () => {
    try {
      const statsData = await warehouseService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch warehouse stats:', err);
      setStats({
        total_warehouses: 0,
        active_warehouses: 0,
        total_products: 0,
        low_stock_items: 0,
        warehouse_utilization: 0
      });
    }
  };

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await warehouseService.getWarehouses(filters);
      setWarehouses(response.warehouses || []);
    } catch (err) {
      console.error('Failed to fetch warehouses:', err);
      setError('Failed to fetch warehouses. Please check your connection and try again.');
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWarehouse = async (data: WarehouseFormData) => {
    setCreateLoading(true);
    try {
      await warehouseService.createWarehouse(data);
      setShowAddModal(false);
      fetchWarehouses(); // Refresh the list
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error('Error creating warehouse:', error);
      throw error; // Re-throw to let modal handle it
    } finally {
      setCreateLoading(false);
    }
  };

  const handleView = (warehouse: Warehouse) => {
    // TODO: Navigate to warehouse detail page
    console.log('View warehouse:', warehouse);
  };

  const handleEdit = (warehouse: Warehouse) => {
    // TODO: Open edit modal
    console.log('Edit warehouse:', warehouse);
  };

  const handleDelete = (warehouse: Warehouse) => {
    // TODO: Show delete confirmation
    console.log('Delete warehouse:', warehouse);
  };

  useEffect(() => {
    fetchStats();
    fetchWarehouses();
  }, []);

  useEffect(() => {
    fetchWarehouses();
  }, [filters]);

  return (
    <CompanyLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              🏭 Warehouse Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your warehouses, track inventory, and monitor stock levels
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              ➕ Add Warehouse
            </button>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              🏭 Warehouse Module
            </span>
          </div>
        </div>

        {/* Stats - Only show if available */}
        {stats && <StatsCards stats={stats} />}

        {/* Error banner for API issues */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-yellow-400 text-lg mr-3">⚠️</div>
              <div className="flex-1">
                <p className="text-yellow-800 text-sm">{error}</p>
              </div>
              <button
                onClick={() => {
                  setError(null);
                  fetchWarehouses();
                }}
                className="text-yellow-600 hover:text-yellow-800 ml-3"
              >
                🔄 Retry
              </button>
            </div>
          </div>
        )}

        {/* Warehouses Table */}
        <WarehouseTable 
          warehouses={warehouses}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Add Warehouse Modal */}
        <AddWarehouseModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleCreateWarehouse}
          loading={createLoading}
        />
      </div>
    </CompanyLayout>
  );
};

export default WarehousePage;