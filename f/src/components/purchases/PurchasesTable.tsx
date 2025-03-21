import React, { useState } from 'react';
import { Purchase, PurchasesTableProps } from '../../types/purchasesTypes';
import PurchasesRow from './PurchasesRow';
import PurchasesPagination from './PurchasesPagination';
import PurchasesSearch from './PurchasesSearch';
import PurchasesActions from './PurchasesActions';
import PurchasesSummary from './PurchasesSummary';

const PurchasesTable: React.FC<PurchasesTableProps> = ({
  purchases = [], // Добавлено значение по умолчанию
  isLoading,
  error,
  onEdit,
  onDelete,
  onView,
  onSearch,
  onPageChange,
  onItemsPerPageChange,
  onSort,
  currentPage,
  totalItems,
  itemsPerPage,
  onExport,
  onImport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const [localItemsPerPage, setLocalItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'date',
    direction: 'desc'
  });

  // Используем либо внешнее управление страницей, либо локальное состояние
  const effectiveCurrentPage = currentPage || localCurrentPage;
  const effectiveItemsPerPage = itemsPerPage || localItemsPerPage;

  // Filter purchases based on search term
  const filteredPurchases = purchases.filter(purchase => 
    purchase.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (purchase.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Sort purchases
  const sortedPurchases = [...filteredPurchases].sort((a, b) => {
    const aValue = a[sortBy.field as keyof Purchase];
    const bValue = b[sortBy.field as keyof Purchase];
    
    if (aValue === undefined || bValue === undefined) return 0;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortBy.direction === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortBy.direction === 'asc' 
        ? aValue.getTime() - bValue.getTime() 
        : bValue.getTime() - aValue.getTime();
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortBy.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  // Pagination
  const indexOfLastItem = effectiveCurrentPage * effectiveItemsPerPage;
  const indexOfFirstItem = indexOfLastItem - effectiveItemsPerPage;
  const currentPurchases = sortedPurchases.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedPurchases.length / effectiveItemsPerPage);

  // Calculate summary data
  const totalAmount = filteredPurchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
  const totalItemsCount = filteredPurchases.length;

  // Handle sort
  const handleSort = (field: string) => {
    const newDirection = sortBy.field === field && sortBy.direction === 'asc' ? 'desc' : 'asc';
    
    setSortBy({
      field,
      direction: newDirection
    });
    
    // Если передан обработчик сортировки от родительского компонента
    if (onSort) {
      onSort(field, newDirection);
    }
  };

  // Handle search
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    // Если передан обработчик поиска от родительского компонента
    if (onSearch) {
      onSearch(value);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setLocalCurrentPage(page);
    
    // Если передан обработчик изменения страницы от родительского компонента
    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (limit: number) => {
    setLocalItemsPerPage(limit);
    
    // Если передан обработчик изменения количества элементов от родительского компонента
    if (onItemsPerPageChange) {
      onItemsPerPageChange(limit);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading purchases...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading purchases: {error.message}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b">
        <PurchasesSearch 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange} 
        />
        <PurchasesActions 
          onCreateNew={() => window.location.href = "/warehouse/purchases/create"} 
          onExport={onExport}
          onImport={onImport}
          hasExportFeature={!!onExport}
          hasImportFeature={!!onImport}
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('date')}
              >
                Date
                {sortBy.field === 'date' && (
                  <span className="ml-1">{sortBy.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('invoiceNumber')}
              >
                Invoice #
                {sortBy.field === 'invoiceNumber' && (
                  <span className="ml-1">{sortBy.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('vendor')}
              >
                Vendor
                {sortBy.field === 'vendor' && (
                  <span className="ml-1">{sortBy.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('totalAmount')}
              >
                Amount
                {sortBy.field === 'totalAmount' && (
                  <span className="ml-1">{sortBy.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Status
                {sortBy.field === 'status' && (
                  <span className="ml-1">{sortBy.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPurchases.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No purchases found
                </td>
              </tr>
            ) : (
              currentPurchases.map(purchase => (
                <PurchasesRow 
                  key={purchase.id} 
                  purchase={purchase}
                  onEdit={() => onEdit(purchase.id)}
                  onDelete={() => onDelete(purchase.id)}
                  onView={() => onView(purchase.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-2">
        <PurchasesSummary totalAmount={totalAmount} count={totalItemsCount} />
      </div>
      
      <div className="border-t border-gray-200 px-4 py-2">
        <PurchasesPagination 
          currentPage={effectiveCurrentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={effectiveItemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
};

export default PurchasesTable;