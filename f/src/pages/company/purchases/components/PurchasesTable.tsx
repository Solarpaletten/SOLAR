// f/src/pages/company/purchases/components/PurchasesTable.tsx - Enhanced Version
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // ← ДОБАВЛЯЕМ
import { Purchase, PurchaseTableColumn, DEFAULT_PURCHASE_COLUMNS } from '../types/purchasesTypes';
import ColumnSettingsModal from './ColumnSettingsModal';

interface PurchasesTableProps {
  purchases: Purchase[];
  loading: boolean;
  bulkLoading?: boolean;
  onRefresh: () => void;
  onEdit: (purchase: Purchase) => void;
  onDelete: (id: number) => void;
  onBulkDelete: (ids: number[]) => void;
  onBulkCopy: (ids: number[]) => void;
  onBulkExport?: (ids: number[]) => void;
}

const PurchasesTable: React.FC<PurchasesTableProps> = ({
  purchases,
  loading,
  bulkLoading = false,
  onRefresh,
  onEdit,
  onDelete,
  onBulkDelete,
  onBulkCopy,
  onBulkExport,
}) => {
  const navigate = useNavigate(); // ← ДОБАВЛЯЕМ
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [columns, setColumns] = useState<PurchaseTableColumn[]>(DEFAULT_PURCHASE_COLUMNS);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [liteMode, setLiteMode] = useState(false);

  // Get visible columns only
  const visibleColumns = useMemo(() => 
    columns.filter(col => col.visible), [columns]
  );

  // Selection handlers
  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    if (selectedIds.size === purchases.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(purchases.map(p => p.id)));
    }
  };

  // Render cell content based on column type
  const renderCell = (purchase: Purchase, column: PurchaseTableColumn) => {
    const value = purchase[column.key as keyof Purchase];

    switch (column.type) {
      case 'date':
        return value ? new Date(value as string).toLocaleDateString() : '-';
      
      case 'currency':
        return value ? `€ ${Number(value).toLocaleString()}` : '€ 0';
      
      case 'number':
        return value ? Number(value).toLocaleString() : '0';
      
      case 'status':
        if (column.key === 'payment_status') {
          const statusColors = {
            'PENDING': 'bg-yellow-100 text-yellow-800',
            'PAID': 'bg-green-100 text-green-800',
            'PARTIAL': 'bg-blue-100 text-blue-800',
            'OVERDUE': 'bg-red-100 text-red-800',
            'CANCELLED': 'bg-gray-100 text-gray-800'
          };
          return (
            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[value as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
              {value}
            </span>
          );
        }
        if (column.key === 'locked') {
          return value ? '🔒' : '';
        }
        return value ? String(value) : '-';
      
      case 'text':
        if (column.key === 'supplier') {
          return purchase.supplier?.name || `Supplier #${purchase.supplier_id}`;
        }
        if (column.key === 'warehouse') {
          return purchase.warehouse?.name || 'All';
        }
        if (column.key === 'document_number') {
          // Делаем номер документа кликабельным для перехода к детальной странице
          return (
            <button
              onClick={() => navigate(`/purchases/${purchase.id}`)}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {purchase.document_number}
            </button>
          );
        }
        return value ? String(value) : '-';
      
      default:
        return value ? String(value) : '-';
    }
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

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Table Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🛒</span>
              <span className="font-semibold text-blue-900">Purchases</span>
              {liteMode && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  ⚡ Enable lite mode
                </span>
              )}
            </div>

            {selectedIds.size > 0 && (
              <>
                <span className="text-sm text-blue-700">
                  {selectedIds.size} selected
                </span>
                <button
                  onClick={() => onBulkCopy(Array.from(selectedIds))}
                  disabled={bulkLoading}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  📋 Copy
                </button>
                <button
                  onClick={() => onBulkDelete(Array.from(selectedIds))}
                  disabled={bulkLoading}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
                >
                  🗑️ Delete
                </button>
                {onBulkExport && (
                  <button
                    onClick={() => onBulkExport(Array.from(selectedIds))}
                    disabled={bulkLoading}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    📊 Export
                  </button>
                )}
              </>
            )}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-2 text-sm text-blue-700">
            <span>1 / 1</span>
            <button className="p-1 hover:bg-blue-100 rounded">◀</button>
            <button className="p-1 hover:bg-blue-100 rounded">▶</button>
            <select className="text-xs border border-blue-300 rounded px-2 py-1">
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span>of {purchases.length}</span>
            
            <div className="flex items-center space-x-1 ml-4">
              <button className="p-1 hover:bg-blue-100 rounded text-blue-600" title="Search">🔍</button>
              <button 
                onClick={() => setShowColumnSettings(true)}
                className="p-1 hover:bg-blue-100 rounded text-blue-600" 
                title="Column Settings"
              >
                ⚙️
              </button>
              <button 
                onClick={onRefresh}
                className="p-1 hover:bg-blue-100 rounded text-blue-600"
                title="Refresh"
              >
                🔄
              </button>
              <button className="p-1 hover:bg-blue-100 rounded text-blue-600" title="Export">📤</button>
              <button className="p-1 hover:bg-blue-100 rounded text-blue-600" title="Import">📥</button>
              <button 
                onClick={() => setLiteMode(!liteMode)}
                className={`p-1 hover:bg-blue-100 rounded ${liteMode ? 'text-blue-800' : 'text-blue-600'}`}
                title="Toggle Lite Mode"
              >
                ⚡
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-10 px-2 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === purchases.length && purchases.length > 0}
                    onChange={selectAll}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </th>
                {visibleColumns.map((column) => (
                  <th
                    key={column.key}
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    style={column.width ? { width: column.width } : undefined}
                  >
                    <div className="flex items-center">
                      {column.label}
                      {column.sortable && <span className="ml-1 text-gray-400">↕️</span>}
                    </div>
                  </th>
                ))}
                <th className="w-20 px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchases.map((purchase) => (
                <tr
                  key={purchase.id}
                  className={`hover:bg-gray-50 ${selectedIds.has(purchase.id) ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-2 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(purchase.id)}
                      onChange={() => toggleSelect(purchase.id)}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </td>
                  {visibleColumns.map((column) => (
                    <td
                      key={column.key}
                      className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap"
                    >
                      {renderCell(purchase, column)}
                    </td>
                  ))}
                  <td className="px-3 py-3 text-center text-sm">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        onClick={() => navigate(`/purchases/${purchase.id}`)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => onEdit(purchase)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete(purchase.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {purchases.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">🛒</div>
              <p className="text-gray-500">No purchases found</p>
              <p className="text-sm text-gray-400 mt-2">Add your first purchase to get started</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
          Total: {purchases.length} purchases
          {selectedIds.size > 0 && ` • ${selectedIds.size} selected`}
        </div>
      </div>

      {/* Column Settings Modal */}
      <ColumnSettingsModal
        isOpen={showColumnSettings}
        onClose={() => setShowColumnSettings(false)}
        columns={columns}
        onColumnsChange={setColumns}
      />
    </>
  );
};

export default PurchasesTable;