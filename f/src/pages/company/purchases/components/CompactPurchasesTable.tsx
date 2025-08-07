import React, { useState, useMemo } from 'react';
import { Purchase, PAYMENT_STATUSES, DELIVERY_STATUSES } from '../types/purchasesTypes';

interface CompactPurchasesTableProps {
  purchases: Purchase[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (purchase: Purchase) => void;
  onDelete: (id: number) => void;
  onBulkDelete: (ids: number[]) => void;
  onBulkCopy: (ids: number[]) => void;
  onBulkExport?: (ids: number[]) => void; // Добавьте эту строку
}

interface ColumnFilter {
  field: string;
  value: string;
  type: 'text' | 'date' | 'select';
}
// Компонент для компактного отображения списка покупок
const CompactPurchasesTable: React.FC<CompactPurchasesTableProps> = ({
  purchases,
  loading,
  onRefresh,
  onEdit,
  onDelete,
  onBulkDelete,
  onBulkCopy,
  onBulkExport, // Добавьте этот проп в интерфейс
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [editingCell, setEditingCell] = useState<{id: number, field: string} | null>(null);
  const [filters, setFilters] = useState<ColumnFilter[]>([]);
  const [liteMode, setLiteMode] = useState(true);

  // 🔍 Фильтрация данных
  const filteredPurchases = useMemo(() => {
    if (filters.length === 0) return purchases;
    
    return purchases.filter(purchase => {
      return filters.every(filter => {
        const value = purchase[filter.field]?.toString().toLowerCase() || '';
        return value.includes(filter.value.toLowerCase());
      });
    });
  }, [purchases, filters]);

  // ✅ Управление выбором
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
    if (selectedIds.size === filteredPurchases.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredPurchases.map(p => p.id)));
    }
  };

  // 📝 Inline редактирование
  const startEdit = (id: number, field: string) => {
    setEditingCell({ id, field });
  };

  const saveEdit = (id: number, field: string, value: string) => {
    // Здесь будет API вызов для обновления поля
    console.log(`Обновить ${field} для покупки ${id}: ${value}`);
    setEditingCell(null);
  };

  // 🔍 Обновление фильтра
  const updateFilter = (field: string, value: string) => {
    setFilters(prev => {
      const existing = prev.find(f => f.field === field);
      if (existing) {
        if (value === '') {
          return prev.filter(f => f.field !== field);
        }
        existing.value = value;
        return [...prev];
      } else if (value !== '') {
        return [...prev, { field, value, type: 'text' }];
      }
      return prev;
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbols = { EUR: '€', USD: '$', UAH: '₴', AED: 'د.إ' };
    return `${symbols[currency] || currency} ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB'); // DD/MM/YYYY
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-center h-32 text-gray-500">
          ⏳ Loading purchases...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header с переключателем режима и bulk операциями */}
      <div className="bg-blue-50 px-4 py-2 border-b border-blue-200 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="font-medium text-blue-900">Purchases</h3>
          
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={liteMode}
              onChange={(e) => setLiteMode(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-blue-800">Enable lite mode</span>
          </label>
        </div>

        <div className="flex items-center space-x-2">
          {selectedIds.size > 0 && (
            <>
              <span className="text-sm text-blue-700">
                {selectedIds.size} selected
              </span>
              <button
                onClick={() => onBulkCopy(Array.from(selectedIds))}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                📋 Copy
              </button>
              <button
                onClick={() => onBulkDelete(Array.from(selectedIds))}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                🗑️ Delete
              </button>
            </>
          )}
          
          <div className="flex items-center space-x-2 text-sm text-blue-700">
            <span>1 / 1</span>
            <button className="p-1 hover:bg-blue-100 rounded">◀</button>
            <button className="p-1 hover:bg-blue-100 rounded">▶</button>
            <select className="text-xs border border-blue-300 rounded px-2 py-1">
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span>of 2</span>
          </div>

          <div className="flex items-center space-x-1">
            <button className="p-1 hover:bg-blue-100 rounded text-blue-600">🔍</button>
            <button className="p-1 hover:bg-blue-100 rounded text-blue-600">⚙️</button>
            <button 
              onClick={onRefresh}
              className="p-1 hover:bg-blue-100 rounded text-blue-600"
            >
              🔄
            </button>
            <button className="p-1 hover:bg-blue-100 rounded text-blue-600">📤</button>
            <button className="p-1 hover:bg-blue-100 rounded text-blue-600">📥</button>
          </div>
        </div>
      </div>

      {/* Компактная таблица */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-10 px-2 py-1">
                <input
                  type="checkbox"
                  checked={selectedIds.size === filteredPurchases.length && filteredPurchases.length > 0}
                  onChange={selectAll}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </th>
              
              {/* Purchase date */}
              <th className="px-2 py-1 text-left">
                <div className="text-xs font-medium text-gray-700">📅 Purchase date</div>
                <input
                  type="text"
                  placeholder="yyyy-mm-dd"
                  className="w-20 text-xs border border-gray-300 rounded px-1 mt-1"
                  onChange={(e) => updateFilter('document_date', e.target.value)}
                />
              </th>

              {/* Due date */}
              <th className="px-2 py-1 text-left">
                <div className="text-xs font-medium text-gray-700">Due date</div>
                <input
                  type="text"
                  placeholder="yyyy-mm-dd"
                  className="w-20 text-xs border border-gray-300 rounded px-1 mt-1"
                  onChange={(e) => updateFilter('due_date', e.target.value)}
                />
              </th>

              {/* Series */}
              <th className="px-2 py-1 text-left">
                <div className="text-xs font-medium text-gray-700">📄 Series</div>
                <input
                  type="text"
                  placeholder="AB"
                  className="w-12 text-xs border border-gray-300 rounded px-1 mt-1"
                  onChange={(e) => updateFilter('series', e.target.value)}
                />
              </th>

              {/* Number */}
              <th className="px-2 py-1 text-left">
                <div className="text-xs font-medium text-gray-700">📄 Number</div>
                <input
                  type="text"
                  placeholder="Number"
                  className="w-24 text-xs border border-gray-300 rounded px-1 mt-1"
                  onChange={(e) => updateFilter('document_number', e.target.value)}
                />
              </th>

              {/* Warehouse */}
              <th className="px-2 py-1 text-left">
                <div className="text-xs font-medium text-gray-700">Warehouse</div>
                <select className="w-20 text-xs border border-gray-300 rounded px-1 mt-1">
                  <option value="">All</option>
                  <option value="main">Main</option>
                </select>
              </th>

              {/* Supplier code */}
              <th className="px-2 py-1 text-left">
                <div className="text-xs font-medium text-gray-700">Supplier code</div>
                <input
                  type="text"
                  placeholder="Code"
                  className="w-16 text-xs border border-gray-300 rounded px-1 mt-1"
                  onChange={(e) => updateFilter('supplier_code', e.target.value)}
                />
              </th>

              {/* Supplier */}
              <th className="px-2 py-1 text-left">
                <div className="text-xs font-medium text-gray-700">Supplier</div>
                <input
                  type="text"
                  placeholder="Supplier"
                  className="w-32 text-xs border border-gray-300 rounded px-1 mt-1"
                  onChange={(e) => updateFilter('supplier_name', e.target.value)}
                />
              </th>

              {/* Business license */}
              <th className="px-2 py-1 text-left">
                <div className="text-xs font-medium text-gray-700">Business license</div>
                <input
                  type="text"
                  placeholder="License"
                  className="w-24 text-xs border border-gray-300 rounded px-1 mt-1"
                />
              </th>

              {/* Total incl. VAT */}
              <th className="px-2 py-1 text-right">
                <div className="text-xs font-medium text-gray-700">Total incl. VAT</div>
                <input
                  type="text"
                  placeholder="Amount"
                  className="w-20 text-xs border border-gray-300 rounded px-1 mt-1"
                  onChange={(e) => updateFilter('total_amount', e.target.value)}
                />
              </th>

              {/* Remarks */}
              <th className="px-2 py-1 text-left">
                <div className="text-xs font-medium text-gray-700">Remarks</div>
                <input
                  type="text"
                  placeholder="=="
                  className="w-12 text-xs border border-gray-300 rounded px-1 mt-1"
                />
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredPurchases.map((purchase, index) => (
              <tr 
                key={purchase.id} 
                className={`
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} 
                  hover:bg-blue-50 border-b border-gray-100
                  ${selectedIds.has(purchase.id) ? 'ring-2 ring-blue-200 bg-blue-50' : ''}
                `}
              >
                <td className="px-2 py-1">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(purchase.id)}
                    onChange={() => toggleSelect(purchase.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </td>

                {/* Purchase date - editable */}
                <td className="px-2 py-1 text-xs">
                  {editingCell?.id === purchase.id && editingCell?.field === 'document_date' ? (
                    <input
                      type="date"
                      defaultValue={purchase.document_date}
                      onBlur={(e) => saveEdit(purchase.id, 'document_date', e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit(purchase.id, 'document_date', (e.target as HTMLInputElement).value)}
                      className="w-20 text-xs border border-blue-300 rounded px-1"
                      autoFocus
                    />
                  ) : (
                    <span 
                      onClick={() => startEdit(purchase.id, 'document_date')}
                      className="cursor-pointer hover:bg-yellow-100 px-1 rounded"
                    >
                      {formatDate(purchase.document_date)}
                    </span>
                  )}
                </td>

                {/* Due date */}
                <td className="px-2 py-1 text-xs text-gray-600">
                  {formatDate(purchase.document_date)} {/* Placeholder */}
                </td>

                {/* Series */}
                <td className="px-2 py-1 text-xs font-mono">
                  AB {/* Placeholder */}
                </td>

                {/* Number */}
                <td className="px-2 py-1 text-xs font-mono">
                  {purchase.document_number}
                </td>

                {/* Warehouse */}
                <td className="px-2 py-1 text-xs">
                  {purchase.warehouse?.name || '-'}
                </td>

                {/* Supplier code */}
                <td className="px-2 py-1 text-xs font-mono">
                  {purchase.supplier?.code || purchase.supplier_id}
                </td>

                {/* Supplier */}
                <td className="px-2 py-1 text-xs">
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    {purchase.supplier?.name || `Supplier #${purchase.supplier_id}`}
                  </span>
                </td>

                {/* Business license */}
                <td className="px-2 py-1 text-xs text-gray-500">
                  {purchase.supplier?.registration_number || '-'}
                </td>

                {/* Total incl. VAT */}
                <td className="px-2 py-1 text-xs text-right font-medium">
                  {formatCurrency(purchase.total_amount, purchase.currency)}
                </td>

                {/* Remarks */}
                <td className="px-2 py-1 text-xs text-center">
                  {purchase.document_status === 'CONFIRMED' ? '==' : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Total: {filteredPurchases.length} purchases</span>
          <span>
            Total: {formatCurrency(
              filteredPurchases.reduce((sum, p) => sum + p.total_amount, 0), 
              'EUR'
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CompactPurchasesTable;