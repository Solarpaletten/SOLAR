import React, { useEffect, useState } from 'react';
import { PurchasesTableProps } from '../../types/purchasesTypes';
import PurchasesRow from './PurchasesRow';
import clientsService, { Client } from '../../../../services/clientsService';

const PurchasesTable: React.FC<PurchasesTableProps> = ({
  purchases = [],
  isLoading,
  error,
  onEdit,
  onDelete,
  onView,
  onSearch,
  onPageChange,
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [suppliers, setSuppliers] = useState<Client[]>([]);
  const [suppliersLoading, setSuppliersLoading] = useState(false);

  useEffect(() => {
    const loadSuppliers = async () => {
      setSuppliersLoading(true);
      try {
        const suppliersList = await clientsService.getSuppliersList();
        setSuppliers(suppliersList);
      } catch (err) {
        console.error('Ошибка при загрузке поставщиков:', err);
      } finally {
        setSuppliersLoading(false);
      }
    };

    loadSuppliers();
  }, []);

  const getSupplierName = (clientId: number): string => {
    const supplier = suppliers.find((s) => s.id === clientId);
    return supplier ? supplier.name : '—';
  };

  const toggleRow = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === purchases.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(purchases.map((p) => p.id));
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (isLoading) return <div className="flex justify-center p-4">Загрузка данных...</div>;
  if (error) return <div className="text-red-500 p-4">Ошибка: {error.message}</div>;

  const totalAmount = purchases.reduce((sum, p) => sum + p.totalAmount, 0);

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-md mb-4 text-xs font-light">
      {selectedRows.length > 0 && (
        <div className="flex items-center justify-between bg-blue-50 px-4 py-2 border-b border-blue-200">
          <span className="text-sm text-blue-700">Выбрано: {selectedRows.length}</span>
          <div className="flex space-x-2">
            <button
              className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => onEdit && onEdit(selectedRows[0])}
            >
              ✏️ Редактировать
            </button>
            <button
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => onDelete && onDelete(selectedRows[0])}
            >
              🗑️ Удалить
            </button>
            <button
              className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={() => console.log('Печать...')}
            >
              🖨️ Печать
            </button>
          </div>
        </div>
      )}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-1">
              <input
                type="checkbox"
                checked={selectedRows.length === purchases.length}
                onChange={handleSelectAll}
              />
            </th>
            <th className="px-3 py-1 text-left text-gray-500 uppercase">Дата</th>
            <th className="px-3 py-1 text-left text-gray-500 uppercase">Поставщик</th>
            <th className="px-3 py-1 text-right text-gray-500 uppercase">Сумма</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {purchases.map((purchase) => {
            const supplierName = getSupplierName(purchase.client_id);

            return (
              <PurchasesRow
                key={purchase.id}
                purchase={purchase}
                supplierName={supplierName}
                expanded={expandedRowId === purchase.id}
                onToggle={() => toggleRow(purchase.id)}
                onEdit={() => onEdit && onEdit(purchase.id)}
                onDelete={() => onDelete && onDelete(purchase.id)}
                onView={() => onView && onView(purchase.id)}
                formatDate={formatDate}
                formatAmount={formatAmount}
                isSelected={selectedRows.includes(purchase.id)}
                onSelect={() => handleSelectRow(purchase.id)}
              />
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="px-3 py-2 font-medium text-gray-600">
              Всего:
            </td>
            <td className="px-3 py-2 text-right font-semibold">{formatAmount(totalAmount)} EUR</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default PurchasesTable;