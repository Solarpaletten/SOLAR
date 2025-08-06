// f/src/pages/company/purchases/components/PurchasesToolbar.tsx
import React, { useState } from 'react';
import { PurchasesFilter, PaymentStatus } from '../types/purchasesTypes';

interface PurchasesToolbarProps {
  filters: PurchasesFilter;
  onFiltersChange: (filters: PurchasesFilter) => void;
  onAddPurchase?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  totalCount?: number;
  loading?: boolean;
}

const PurchasesToolbar: React.FC<PurchasesToolbarProps> = ({
  filters,
  onFiltersChange,
  onAddPurchase,
  onExport,
  onImport,
  totalCount = 0,
  loading = false
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      status: undefined,
      supplier_id: undefined,
      date_from: '',
      date_to: '',
      sort_by: 'document_date',
      sort_order: 'desc'
    });
  };

  const hasActiveFilters = () => {
    return !!(
      filters.search ||
      filters.status ||
      filters.supplier_id ||
      filters.date_from ||
      filters.date_to
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Main Toolbar */}
      <div className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left Side - Search and Basic Filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search Input */}
            <div className="flex-1 min-w-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder="Search purchases by document number, supplier name..."
                  value={filters.search || ''}
                  onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {filters.search && (
                  <button
                    onClick={() => onFiltersChange({ ...filters, search: '' })}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <span className="text-gray-400 hover:text-gray-600">✕</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Quick Filters */}
            <div className="flex gap-2">
              <select
                value={filters.status || ''}
                onChange={(e) => onFiltersChange({ 
                  ...filters, 
                  status: e.target.value as PaymentStatus | undefined 
                })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="PARTIAL">Partial</option>
                <option value="OVERDUE">Overdue</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  showAdvancedFilters || hasActiveFilters()
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                🔧 Filters
                {hasActiveFilters() && (
                  <span className="ml-1 bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs">
                    Active
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-3">
            {/* Total Count */}
            <div className="text-sm text-gray-600">
              {loading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                <span>
                  <strong>{totalCount}</strong> purchases
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {onImport && (
                <button
                  onClick={onImport}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                >
                  📥 Import
                </button>
              )}
              
              {onExport && (
                <button
                  onClick={onExport}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                >
                  📤 Export
                </button>
              )}
              
              {onAddPurchase && (
                <button
                  onClick={onAddPurchase}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center text-sm"
                >
                  <span className="mr-2">➕</span>
                  Add Purchase
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date From
              </label>
              <input
                type="date"
                value={filters.date_from || ''}
                onChange={(e) => onFiltersChange({ ...filters, date_from: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date To
              </label>
              <input
                type="date"
                value={filters.date_to || ''}
                onChange={(e) => onFiltersChange({ ...filters, date_to: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={filters.sort_by || 'document_date'}
                onChange={(e) => onFiltersChange({ ...filters, sort_by: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="document_date">Document Date</option>
                <option value="total_amount">Total Amount</option>
                <option value="supplier_name">Supplier Name</option>
                <option value="document_number">Document Number</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <select
                value={filters.sort_order || 'desc'}
                onChange={(e) => onFiltersChange({ ...filters, sort_order: e.target.value as 'asc' | 'desc' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          {/* Advanced Filter Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {hasActiveFilters() ? (
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                  Filters applied
                </span>
              ) : (
                'No filters applied'
              )}
            </div>
            
            {hasActiveFilters() && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasesToolbar;