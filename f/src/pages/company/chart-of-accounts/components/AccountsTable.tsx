// f/src/pages/company/chart-of-accounts/components/AccountsTable.tsx
import React, { useState } from 'react';
import { AccountsTableProps, ChartAccount, ACCOUNT_TYPES } from '../types/chartTypes';

const AccountsTable: React.FC<AccountsTableProps> = ({
  accounts,
  loading,
  onRefresh,
  onEdit,
  onDelete
}) => {
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);
  const [sortField, setSortField] = useState<keyof ChartAccount>('account_code');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Handle sorting
  const handleSort = (field: keyof ChartAccount) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort accounts
  const sortedAccounts = [...accounts].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === 'asc' ? comparison : -comparison;
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle selection
  const handleSelectAccount = (id: number) => {
    setSelectedAccounts(prev => 
      prev.includes(id) 
        ? prev.filter(accountId => accountId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedAccounts.length === accounts.length) {
      setSelectedAccounts([]);
    } else {
      setSelectedAccounts(accounts.map(account => account.id));
    }
  };

  // Get account type info
  const getAccountTypeInfo = (type: string) => {
    const typeInfo = ACCOUNT_TYPES.find(t => t.value === type);
    return typeInfo || { label: type, color: 'bg-gray-100 text-gray-800' };
  };

  // Get Lithuanian class
  const getLithuanianClass = (code: string) => {
    const firstDigit = code.charAt(0);
    const classNames: { [key: string]: string } = {
      '1': 'Non-current Assets',
      '2': 'Current Assets',
      '4': 'Equity',
      '5': 'Liabilities',
      '6': 'Expenses',
      '7': 'Income',
      '8': 'Results',
      '9': 'Management'
    };
    return classNames[firstDigit] || 'Other';
  };

  const SortIcon = ({ field }: { field: keyof ChartAccount }) => {
    if (sortField !== field) {
      return <span className="text-gray-400">↕️</span>;
    }
    return sortDirection === 'asc' ? <span className="text-blue-600">↑</span> : <span className="text-blue-600">↓</span>;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <div className="text-gray-600">Loading chart of accounts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white overflow-hidden flex flex-col">
      {/* Table Header Actions */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedAccounts.length > 0 && (
              <>
                <span className="text-sm text-gray-600">
                  {selectedAccounts.length} selected
                </span>
                <button className="text-sm text-red-600 hover:text-red-800 font-medium">
                  Delete Selected
                </button>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Export Selected
                </button>
                <button 
                  onClick={() => setSelectedAccounts([])}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear Selection
                </button>
              </>
            )}
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center text-sm text-gray-600 hover:text-gray-800"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {/* Select All */}
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedAccounts.length === accounts.length && accounts.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>

              {/* Account Code */}
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('account_code')}
              >
                <div className="flex items-center gap-1">
                  Code <SortIcon field="account_code" />
                </div>
              </th>

              {/* Account Name */}
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('account_name')}
              >
                <div className="flex items-center gap-1">
                  Account Name <SortIcon field="account_name" />
                </div>
              </th>

              {/* Type */}
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('account_type')}
              >
                <div className="flex items-center gap-1">
                  Type <SortIcon field="account_type" />
                </div>
              </th>

              {/* Lithuanian Class */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lithuanian Class
              </th>

              {/* Currency */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Currency
              </th>

              {/* Status */}
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('is_active')}
              >
                <div className="flex items-center gap-1">
                  Status <SortIcon field="is_active" />
                </div>
              </th>

              {/* Created */}
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center gap-1">
                  Created <SortIcon field="created_at" />
                </div>
              </th>

              {/* Actions */}
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {sortedAccounts.map((account) => {
              const typeInfo = getAccountTypeInfo(account.account_type);
              const lithuanianClass = getLithuanianClass(account.account_code);
              
              return (
                <tr 
                  key={account.id}
                  className={`hover:bg-gray-50 ${
                    selectedAccounts.includes(account.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  {/* Select */}
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedAccounts.includes(account.id)}
                      onChange={() => handleSelectAccount(account.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>

                  {/* Account Code */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono font-bold text-gray-900">
                      {account.account_code}
                    </div>
                  </td>

                  {/* Account Name */}
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {account.account_name}
                    </div>
                    {account.creator && (
                      <div className="text-xs text-gray-500 mt-1">
                        Created by: {account.creator.username}
                      </div>
                    )}
                  </td>

                  {/* Type */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeInfo.color}`}>
                      {account.account_type}
                    </span>
                  </td>

                  {/* Lithuanian Class */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="font-mono font-bold text-purple-600">
                        {account.account_code.charAt(0)}
                      </span>
                      <span className="text-gray-500 ml-1">
                        {lithuanianClass}
                      </span>
                    </div>
                  </td>

                  {/* Currency */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.currency || '—'}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      account.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {account.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* Created */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(account.created_at).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(account)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100"
                        title="Edit account"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete(account.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
                        title="Delete account"
                      >
                        🗑️
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                        title="View details"
                      >
                        👁️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Empty State */}
        {accounts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📊</div>
            <div className="text-gray-500 text-lg mb-2">No accounts found</div>
            <div className="text-gray-400 text-sm mb-4">
              Get started by importing the Lithuanian chart of accounts or creating your first account
            </div>
            <button
              onClick={onRefresh}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              🔄 Refresh
            </button>
          </div>
        )}
      </div>

      {/* Table Footer */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing {accounts.length} account{accounts.length !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-4">
            <span>Lithuanian IFRS Standard</span>
            <span className="text-green-600">✅ EU Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsTable;