// f/src/pages/company/purchases/components/ColumnSettingsModal.tsx
import React, { useState } from 'react';
import { PurchaseTableColumn, DEFAULT_PURCHASE_COLUMNS } from '../types/purchasesTypes';

interface ColumnSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: PurchaseTableColumn[];
  onColumnsChange: (columns: PurchaseTableColumn[]) => void;
}

const ColumnSettingsModal: React.FC<ColumnSettingsModalProps> = ({
  isOpen,
  onClose,
  columns,
  onColumnsChange
}) => {
  const [localColumns, setLocalColumns] = useState<PurchaseTableColumn[]>(columns);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredColumns = localColumns.filter(col =>
    col.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    col.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleColumn = (key: string) => {
    setLocalColumns(prev =>
      prev.map(col =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handleSelectAll = () => {
    setLocalColumns(prev =>
      prev.map(col => ({ ...col, visible: true }))
    );
  };

  const handleDeselectAll = () => {
    setLocalColumns(prev =>
      prev.map(col => ({ ...col, visible: false }))
    );
  };

  const handleSave = () => {
    onColumnsChange(localColumns);
    onClose();
  };

  const handleReset = () => {
    setLocalColumns(DEFAULT_PURCHASE_COLUMNS);
  };

  const visibleCount = localColumns.filter(col => col.visible).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <span className="text-xl mr-3">⚙️</span>
            <h3 className="text-xl font-semibold text-gray-900">
              Grid config, columns, filters, pagination
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Column Visibility Section */}
          <div className="p-4 flex-1 overflow-hidden">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">📋 Column visibility</h4>
                <div className="flex items-center space-x-2 text-sm">
                  <button
                    onClick={handleSelectAll}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ✅ Select all
                  </button>
                  <button
                    onClick={handleDeselectAll}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ❌ Deselect all
                  </button>
                </div>
              </div>
              
              {/* Columns Grid */}
              <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-0">
                  {filteredColumns.map((column) => (
                    <label
                      key={column.key}
                      className="flex items-center p-3 hover:bg-gray-50 border-b border-r border-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={column.visible}
                        onChange={() => handleToggleColumn(column.key)}
                        className="mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {column.label}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {column.key}
                        </div>
                      </div>
                      {column.sortable && (
                        <span className="text-xs text-gray-400 ml-2">📊</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Selection of table rows */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-blue-700 text-sm mr-2">📋</span>
                <h4 className="font-medium text-blue-900">Selection of table rows</h4>
              </div>
              <label className="flex items-center mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  defaultChecked={true}
                />
                <span className="text-sm text-blue-800">
                  Preserve row selection when navigating between table pages
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {visibleCount} of {localColumns.length} columns visible
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              🔄 Reset grid's config, columns, filters, pagination
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              💾 Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColumnSettingsModal;