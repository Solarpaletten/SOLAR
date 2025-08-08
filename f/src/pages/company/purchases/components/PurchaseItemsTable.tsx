// f/src/pages/company/purchases/components/PurchaseItemsTable.tsx
import React, { useState, useMemo } from 'react';
import { PurchaseItem, PurchaseTableColumn } from '../types/purchasesTypes';

interface PurchaseItemsTableProps {
  items: PurchaseItem[];
  onItemsChange: (items: PurchaseItem[]) => void;
  showColumnSettings: () => void;
}

// Default columns for purchase items table
const DEFAULT_ITEM_COLUMNS: PurchaseTableColumn[] = [
  { key: 'row_number', label: 'Row no.', visible: true, sortable: false, type: 'text', width: 80 },
  { key: 'warehouse', label: 'Warehouse', visible: false, sortable: false, type: 'text' },
  { key: 'items', label: 'Items', visible: true, sortable: false, type: 'text', width: 300 },
  { key: 'code', label: 'Code', visible: true, sortable: false, type: 'text', width: 120 },
  { key: 'measurement_unit', label: 'Measurement unit', visible: true, sortable: false, type: 'text', width: 100 },
  { key: 'residue', label: 'Residue', visible: false, sortable: false, type: 'number' },
  { key: 'price_without_vat', label: 'Price without VAT (from product card)', visible: false, sortable: false, type: 'currency' },
  { key: 'price_with_vat', label: 'Price with VAT (from product card)', visible: false, sortable: false, type: 'currency' },
  { key: 'unit_discount', label: 'Unit discount', visible: false, sortable: false, type: 'currency' },
  { key: 'price_excl_vat_with_discount', label: 'Price excl. VAT with discount', visible: false, sortable: false, type: 'currency' },
  { key: 'prime_cost', label: 'Prime cost', visible: false, sortable: false, type: 'currency' },
  { key: 'price_excl_vat', label: 'Price excl. VAT', visible: true, sortable: false, type: 'currency', width: 120 },
  { key: 'unit_discount_amount', label: 'Unit discount, €', visible: false, sortable: false, type: 'currency' },
  { key: 'price_excl_vat_euro', label: 'Price excl. VAT, €', visible: false, sortable: false, type: 'currency' },
  { key: 'cost_sum', label: 'Cost sum', visible: false, sortable: false, type: 'currency' },
  { key: 'price_with_vat_euro', label: 'Price with VAT, €', visible: false, sortable: false, type: 'currency' },
  { key: 'quantity', label: 'Quantity', visible: true, sortable: false, type: 'number', width: 100 },
  { key: 'discount_percent', label: 'Discount, %', visible: false, sortable: false, type: 'number' },
  { key: 'discount_sum', label: 'Discount sum', visible: false, sortable: false, type: 'currency' },
  { key: 'discount_amount_euro', label: 'Discount sum, €', visible: false, sortable: false, type: 'currency' },
  { key: 'price_excl_vat_with_discount_table', label: 'Price excl. VAT with discount', visible: true, sortable: false, type: 'currency', width: 150 },
  { key: 'total_excl_vat_with_discount', label: 'Total excl. VAT with discount', visible: false, sortable: false, type: 'currency' },
  { key: 'total_excl_vat', label: 'Total excl. VAT', visible: true, sortable: false, type: 'currency', width: 120 },
  { key: 'price_incl_vat', label: 'Price incl VAT', visible: false, sortable: false, type: 'currency' },
  { key: 'total_incl_vat_with_discount', label: 'Total excl. VAT with discount, €', visible: false, sortable: false, type: 'currency' },
  { key: 'cor_account', label: 'Cor. account', visible: true, sortable: false, type: 'text', width: 100 },
  { key: 'total_excl_vat_table', label: 'Total excl. VAT', visible: true, sortable: false, type: 'currency', width: 120 },
  { key: 'vat_rate', label: 'VAT rate', visible: true, sortable: false, type: 'number', width: 80 },
  { key: 'vat_sum_euro', label: 'VAT sum, €', visible: false, sortable: false, type: 'currency' },
  { key: 'total_incl_vat', label: 'Total incl VAT', visible: false, sortable: false, type: 'currency' },
  { key: 'vat_sum', label: 'VAT sum', visible: true, sortable: false, type: 'currency', width: 100 },
  { key: 'employee', label: 'Employee', visible: false, sortable: false, type: 'text' },
  { key: 'reg_number', label: 'Reg. number', visible: false, sortable: false, type: 'text' },
  { key: 'fuel_card', label: 'Fuel card', visible: false, sortable: false, type: 'text' },
  { key: 'notes', label: 'Notes', visible: false, sortable: false, type: 'text' },
  { key: 'vat_classification', label: 'VAT classification', visible: false, sortable: false, type: 'text' },
  { key: 'cost_center', label: 'Cost center', visible: false, sortable: false, type: 'text' },
  { key: 'car_model', label: 'Car model', visible: false, sortable: false, type: 'text' },
  { key: 'intr_delivery_terms_code', label: 'Intr. delivery terms code', visible: false, sortable: false, type: 'text' },
  { key: 'intr_delivery_terms_description', label: 'Intr. delivery terms description', visible: false, sortable: false, type: 'text' },
  { key: 'intr_transport_code', label: 'Intr. transport code', visible: false, sortable: false, type: 'text' },
  { key: 'intr_transport_description', label: 'Intr. transport description', visible: false, sortable: false, type: 'text' },
  { key: 'intr_country_of_origin_code', label: 'Intr. country of origin code', visible: false, sortable: false, type: 'text' },
  { key: 'intrastat_weight_netto_kg', label: 'Intrastat weight netto, kg', visible: false, sortable: false, type: 'number' }
];

const PurchaseItemsTable: React.FC<PurchaseItemsTableProps> = ({
  items,
  onItemsChange,
  showColumnSettings
}) => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [columns, setColumns] = useState<PurchaseTableColumn[]>(DEFAULT_ITEM_COLUMNS);
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; column: string } | null>(null);

  // Get visible columns only
  const visibleColumns = useMemo(() => 
    columns.filter(col => col.visible), [columns]
  );

  // Selection handlers
  const toggleRowSelection = (index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const selectAllRows = () => {
    if (selectedRows.size === items.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(items.map((_, index) => index)));
    }
  };

  // Render cell content
  const renderCell = (item: PurchaseItem, column: PurchaseTableColumn, rowIndex: number) => {
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.column === column.key;

    switch (column.key) {
      case 'row_number':
        return rowIndex + 1;
      
      case 'items':
        return item.product?.name || `Product #${item.product_id}`;
      
      case 'code':
        return item.product?.code || '-';
      
      case 'measurement_unit':
        return item.product?.unit || 'pcs';
      
      case 'quantity':
        if (isEditing) {
          return (
            <input
              type="number"
              step="0.001"
              defaultValue={item.quantity.toString()}
              onBlur={(e) => {
                updateItem(rowIndex, 'quantity', parseFloat(e.target.value));
                setEditingCell(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateItem(rowIndex, 'quantity', parseFloat(e.currentTarget.value));
                  setEditingCell(null);
                }
              }}
              className="w-full px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none"
              autoFocus
            />
          );
        }
        return item.quantity.toFixed(3);
      
      case 'price_excl_vat':
        if (isEditing) {
          return (
            <input
              type="number"
              step="0.01"
              defaultValue={item.unit_price_base.toString()}
              onBlur={(e) => {
                updateItem(rowIndex, 'unit_price_base', parseFloat(e.target.value));
                setEditingCell(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateItem(rowIndex, 'unit_price_base', parseFloat(e.currentTarget.value));
                  setEditingCell(null);
                }
              }}
              className="w-full px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none"
              autoFocus
            />
          );
        }
        return item.unit_price_base.toFixed(2);
      
      case 'price_excl_vat_with_discount_table':
        const discountAmount = (item.discount_amount || 0);
        const priceWithDiscount = item.unit_price_base - discountAmount;
        return priceWithDiscount.toFixed(2);
      
      case 'total_excl_vat':
        return item.line_total.toFixed(2);
      
      case 'total_excl_vat_table':
        return item.line_total.toFixed(2);
      
      case 'vat_rate':
        if (isEditing) {
          return (
            <input
              type="number"
              step="0.01"
              defaultValue={(item.vat_rate || 0).toString()}
              onBlur={(e) => {
                updateItem(rowIndex, 'vat_rate', parseFloat(e.target.value));
                setEditingCell(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateItem(rowIndex, 'vat_rate', parseFloat(e.currentTarget.value));
                  setEditingCell(null);
                }
              }}
              className="w-full px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none"
              autoFocus
            />
          );
        }
        return (item.vat_rate || 0).toFixed(2);
      
      case 'vat_sum':
        return (item.vat_amount || 0).toFixed(2);
      
      case 'cor_account':
        return '5500.2040';
      
      default:
        return '-';
    }
  };

  // Update item
  const updateItem = (rowIndex: number, field: keyof PurchaseItem, value: any) => {
    const newItems = [...items];
    newItems[rowIndex] = {
      ...newItems[rowIndex],
      [field]: value
    };

    // Recalculate line total if quantity or price changed
    if (field === 'quantity' || field === 'unit_price_base') {
      const quantity = field === 'quantity' ? value : newItems[rowIndex].quantity;
      const unitPrice = field === 'unit_price_base' ? value : newItems[rowIndex].unit_price_base;
      const discountAmount = newItems[rowIndex].discount_amount || 0;
      
      newItems[rowIndex].line_total = (quantity * unitPrice) - discountAmount;
      
      // Recalculate VAT if VAT rate is set
      if (newItems[rowIndex].vat_rate) {
        newItems[rowIndex].vat_amount = newItems[rowIndex].line_total * (newItems[rowIndex].vat_rate! / 100);
      }
    }

    onItemsChange(newItems);
  };

  // Start cell editing
  const startEditing = (rowIndex: number, column: string) => {
    if (['quantity', 'price_excl_vat', 'vat_rate'].includes(column)) {
      setEditingCell({ rowIndex, column });
    }
  };

  return (
    <div className="h-80 flex flex-col">
      {/* Table Controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">1 / 1</span>
          <button className="p-1 hover:bg-gray-200 rounded text-gray-600">◀</button>
          <button className="p-1 hover:bg-gray-200 rounded text-gray-600">▶</button>
          <select className="text-xs border border-gray-300 rounded px-2 py-1">
            <option>100</option>
            <option>50</option>
            <option>20</option>
          </select>
          <span className="text-sm text-gray-600">of 1</span>
        </div>

        <div className="flex items-center space-x-1">
          <button className="p-1 hover:bg-gray-200 rounded text-gray-600" title="Sort">↕️</button>
          <button className="p-1 hover:bg-gray-200 rounded text-gray-600" title="Refresh">🔄</button>
          <button className="p-1 hover:bg-gray-200 rounded text-gray-600" title="Filter">🔍</button>
          <button 
            onClick={showColumnSettings}
            className="p-1 hover:bg-gray-200 rounded text-gray-600" 
            title="Column Settings"
          >
            ⚙️
          </button>
          <button className="p-1 hover:bg-gray-200 rounded text-gray-600" title="Duplicate">📋</button>
          <button className="p-1 hover:bg-gray-200 rounded text-red-600" title="Delete">🗑️</button>
          <button className="p-1 hover:bg-gray-200 rounded text-gray-600" title="More">⋯</button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="w-8 px-2 py-2 text-left border-r border-gray-300">
                <input
                  type="checkbox"
                  checked={selectedRows.size === items.length && items.length > 0}
                  onChange={selectAllRows}
                  className="h-3 w-3"
                />
              </th>
              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  className="px-2 py-2 text-left border-r border-gray-300 text-xs font-medium text-gray-700 bg-gray-100"
                  style={column.width ? { width: column.width, minWidth: column.width } : undefined}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className={`hover:bg-gray-50 ${selectedRows.has(rowIndex) ? 'bg-blue-50' : rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
              >
                <td className="w-8 px-2 py-2 border-r border-gray-200">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(rowIndex)}
                    onChange={() => toggleRowSelection(rowIndex)}
                    className="h-3 w-3"
                  />
                </td>
                {visibleColumns.map((column) => (
                  <td
                    key={column.key}
                    className="px-2 py-2 border-r border-gray-200 cursor-pointer hover:bg-blue-50"
                    style={column.width ? { width: column.width, minWidth: column.width } : undefined}
                    onDoubleClick={() => startEditing(rowIndex, column.key)}
                  >
                    <div className="truncate" title={renderCell(item, column, rowIndex)?.toString()}>
                      {renderCell(item, column, rowIndex)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
            
            {items.length === 0 && (
              <tr>
                <td colSpan={visibleColumns.length + 1} className="px-6 py-8 text-center text-gray-500">
                  <div className="text-2xl mb-2">📦</div>
                  <div>No items in this purchase</div>
                  <div className="text-sm text-gray-400 mt-1">Add products to get started</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
        <div className="flex justify-between items-center">
          <div>Total: {items.length} items</div>
          {selectedRows.size > 0 && (
            <div>{selectedRows.size} selected</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseItemsTable;