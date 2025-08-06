#!/bin/bash
# 🎯 СОЗДАНИЕ ПОЛНОЙ ИНТЕГРАЦИИ ПЛАН СЧЕТОВ + ТОВАРЫ
# Используем готовые компоненты из project knowledge + твою гениальную концепцию

echo "🎊🔥🎯 СОЗДАНИЕ ПОЛНОЙ ERP ИНТЕГРАЦИИ! 🎯🔥🎊"
echo ""
echo "📊 ИСПОЛЬЗУЕМ ГОТОВЫЕ КОМПОНЕНТЫ:"
echo "   ✅ ChartOfAccountsController (51 счёт литовского плана)"
echo "   ✅ AccountingIntegrationService (автопроводки)"
echo "   ✅ ChartOfAccountsPage компоненты"
echo "   ✅ ImportLithuanianModal"
echo ""

# 1. Создаём полную страницу плана счетов
echo "1️⃣ СОЗДАЁМ CHART OF ACCOUNTS PAGE:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

mkdir -p f/src/pages/company/chart-of-accounts
mkdir -p f/src/pages/company/chart-of-accounts/components
mkdir -p f/src/pages/company/chart-of-accounts/types

# Главная страница плана счетов
cat > f/src/pages/company/chart-of-accounts/ChartOfAccountsPage.tsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { useCompanyContext } from '../../../contexts/CompanyContext';
import AccountsTable from './components/AccountsTable';
import AccountForm from './components/AccountForm';
import ImportLithuanianModal from './components/ImportLithuanianModal';
import { ChartAccount, AccountsStats } from './types/chartTypes';

const ChartOfAccountsPage: React.FC = () => {
  const { companyId, company } = useCompanyContext();
  const [accounts, setAccounts] = useState<ChartAccount[]>([]);
  const [stats, setStats] = useState<AccountsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<ChartAccount | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    if (companyId) {
      fetchAccounts();
      fetchStats();
    }
  }, [companyId]);

  const fetchAccounts = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterType) params.append('account_type', filterType);
      params.append('is_active', 'true');

      const response = await fetch(`/api/company/chart-of-accounts?${params}`, {
        headers: { 'Company-ID': companyId.toString() }
      });
      
      const data = await response.json();
      if (data.success) {
        setAccounts(data.accounts);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/company/chart-of-accounts/stats`, {
        headers: { 'Company-ID': companyId.toString() }
      });
      
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleImportSuccess = (imported: number) => {
    fetchAccounts();
    fetchStats();
    setShowImportModal(false);
    // Уведомление об успехе
    alert(`✅ Успешно импортировано ${imported} счетов литовского плана!`);
  };

  const handleAccountSaved = () => {
    fetchAccounts();
    fetchStats();
    setShowAddForm(false);
    setEditingAccount(null);
  };

  const handleDeleteAccount = async (accountId: number) => {
    if (confirm('Удалить счёт из плана счетов?')) {
      try {
        const response = await fetch(`/api/company/chart-of-accounts/${accountId}`, {
          method: 'DELETE',
          headers: { 'Company-ID': companyId.toString() }
        });
        
        if (response.ok) {
          fetchAccounts();
          fetchStats();
        }
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
              <span className="text-3xl mr-3">📊</span>
              План счетов
            </h1>
            <p className="text-gray-600 mt-1">
              {company?.name} • Литовский план счетов (LAS)
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {stats && (
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  Активы: {stats.ASSET || 0}
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  Пассивы: {stats.LIABILITY || 0}
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></span>
                  Доходы: {stats.INCOME || 0}
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                  Расходы: {stats.EXPENSE || 0}
                </div>
              </div>
            )}
            
            <button
              onClick={() => setShowImportModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm"
            >
              <span className="mr-2">📤</span>
              Импорт литовского плана
            </button>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center text-sm"
            >
              <span className="mr-2">➕</span>
              Добавить счёт
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white px-6 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Поиск по коду или названию счёта..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchAccounts()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Все типы</option>
            <option value="ASSET">Активы</option>
            <option value="LIABILITY">Обязательства</option>
            <option value="EQUITY">Капитал</option>
            <option value="INCOME">Доходы</option>
            <option value="EXPENSE">Расходы</option>
          </select>
          
          <button
            onClick={fetchAccounts}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm"
          >
            🔍 Найти
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">⏳ Загрузка плана счетов...</div>
          </div>
        ) : accounts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <span className="text-6xl block mb-4">📊</span>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                План счетов пуст
              </h3>
              <p className="text-gray-600 mb-6">
                Импортируйте стандартный литовский план счетов или создайте счета вручную
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowImportModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  📤 Импортировать литовский план
                </button>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                >
                  ➕ Создать счёт вручную
                </button>
              </div>
            </div>
          </div>
        ) : (
          <AccountsTable
            accounts={accounts}
            onEdit={setEditingAccount}
            onDelete={handleDeleteAccount}
          />
        )}
      </div>

      {/* Modals */}
      {showAddForm && (
        <AccountForm
          companyId={companyId}
          account={editingAccount}
          onClose={() => {
            setShowAddForm(false);
            setEditingAccount(null);
          }}
          onSaved={handleAccountSaved}
        />
      )}

      {showImportModal && (
        <ImportLithuanianModal
          companyId={companyId}
          onClose={() => setShowImportModal(false)}
          onImportSuccess={handleImportSuccess}
        />
      )}
    </div>
  );
};

export default ChartOfAccountsPage;
EOF

# 2. Таблица счетов
echo ""
echo "2️⃣ СОЗДАЁМ ACCOUNTS TABLE:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat > f/src/pages/company/chart-of-accounts/components/AccountsTable.tsx << 'EOF'
import React from 'react';
import { ChartAccount } from '../types/chartTypes';

interface AccountsTableProps {
  accounts: ChartAccount[];
  onEdit: (account: ChartAccount) => void;
  onDelete: (accountId: number) => void;
}

const AccountsTable: React.FC<AccountsTableProps> = ({ accounts, onEdit, onDelete }) => {
  const getTypeColor = (type: string) => {
    const colors = {
      'ASSET': 'bg-blue-100 text-blue-800',
      'LIABILITY': 'bg-red-100 text-red-800',
      'EQUITY': 'bg-green-100 text-green-800',
      'INCOME': 'bg-emerald-100 text-emerald-800',
      'EXPENSE': 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getAccountIcon = (type: string, code: string) => {
    if (code.startsWith('20') || code.startsWith('203')) return '📦'; // Товары
    if (code.startsWith('24') || code.startsWith('240')) return '💰'; // Дебиторы
    if (code.startsWith('27') || code.startsWith('280')) return '🏦'; // Банк
    if (code.startsWith('44') || code.startsWith('56')) return '🏪'; // Поставщики
    if (code.startsWith('70') || code.startsWith('701')) return '💎'; // Выручка
    if (code.startsWith('60') || code.startsWith('601')) return '📉'; // Расходы
    if (type === 'ASSET') return '📊';
    if (type === 'LIABILITY') return '📋';
    if (type === 'INCOME') return '📈';
    if (type === 'EXPENSE') return '📉';
    return '📄';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Счёт
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Тип
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Валюта
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {accounts.map((account) => (
              <tr key={account.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">
                      {getAccountIcon(account.account_type, account.account_code)}
                    </span>
                    <span className="text-sm font-mono font-medium text-gray-900">
                      {account.account_code}
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {account.account_name}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(account.account_type)}`}>
                    {account.account_type}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {account.currency || 'EUR'}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    account.is_active 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {account.is_active ? 'Активен' : 'Неактивен'}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(account)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded"
                      title="Редактировать"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(account.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded"
                      title="Удалить"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {accounts.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Всего счетов: {accounts.length}</span>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Активы
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Пассивы
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                Доходы
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                Расходы
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsTable;
EOF

# 3. Интеграция с товарами - расширенный InventoryStore
echo ""
echo "3️⃣ СОЗДАЁМ ИНТЕГРАЦИЮ ТОВАРЫ + ПЛАН СЧЕТОВ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat > f/src/store/inventoryWithAccountsStore.ts << 'EOF'
// 🎯 INVENTORY STORE С ИНТЕГРАЦИЕЙ ПЛАНА СЧЕТОВ
// Каждый товар привязывается к счёту плана счетов

interface InventoryItem {
  id: string;
  productCode: string;
  productName: string;
  quantity: number;
  unit: string;
  costPrice: number;
  totalValue: number;
  lastUpdated: string;
  
  // 🔗 ПРИВЯЗКА К ПЛАНУ СЧЕТОВ
  inventoryAccount: string;  // Счёт товаров (203, 2040, etc.)
  accountName: string;       // Название счёта
  
  batches: InventoryBatch[];
}

interface InventoryBatch {
  batchId: string;
  purchaseDate: string;
  quantity: number;
  costPrice: number;
  supplierId?: string;
  supplierName?: string;
  remainingQuantity: number;
}

interface AccountingEntry {
  id: string;
  date: string;
  debitAccount: string;
  debitAccountName: string;
  creditAccount: string;
  creditAccountName: string;
  amount: number;
  description: string;
  documentType: 'PURCHASE' | 'SALE';
  documentNumber: string;
  productCode?: string;
}

// 🇱🇹 ПЛАН СЧЕТОВ ЛИТВЫ (расширенный)
export const LITHUANIAN_ACCOUNTS = {
  // Товары (класс 2)
  '2030': { name: 'Сырьё и материалы', type: 'ASSET' },
  '2040': { name: 'Товары для перепродажи', type: 'ASSET' },
  '2041': { name: 'Нефтепродукты', type: 'ASSET' },
  '2042': { name: 'Химические товары', type: 'ASSET' },
  '2043': { name: 'Строительные материалы', type: 'ASSET' },
  
  // Дебиторы/Кредиторы
  '2410': { name: 'Дебиторская задолженность покупателей', type: 'ASSET' },
  '4430': { name: 'Кредиторская задолженность поставщикам', type: 'LIABILITY' },
  
  // Банк
  '2710': { name: 'Банковские счета', type: 'ASSET' },
  
  // Доходы/Расходы
  '6001': { name: 'Себестоимость продаж', type: 'EXPENSE' },
  '7001': { name: 'Выручка от продаж', type: 'INCOME' }
};

class InventoryWithAccountsStore {
  private inventory: Map<string, InventoryItem> = new Map();
  private accountingEntries: AccountingEntry[] = [];

  // 🛒 ПРИХОД ТОВАРА С ПРИВЯЗКОЙ К СЧЁТУ
  addPurchaseWithAccount(purchase: {
    productCode: string;
    productName: string;
    quantity: number;
    unit: string;
    costPrice: number;
    supplierId: string;
    supplierName: string;
    documentNumber: string;
    inventoryAccount: string;  // ← СЧЁТ ТОВАРОВ!
    payableAccount: string;
  }) {
    const batchId = `BATCH-${Date.now()}`;
    const totalAmount = purchase.quantity * purchase.costPrice;

    // Создаём партию
    const newBatch: InventoryBatch = {
      batchId,
      purchaseDate: new Date().toISOString(),
      quantity: purchase.quantity,
      costPrice: purchase.costPrice,
      supplierId: purchase.supplierId,
      supplierName: purchase.supplierName,
      remainingQuantity: purchase.quantity
    };

    // Обновляем остатки
    const existing = this.inventory.get(purchase.productCode);
    if (existing) {
      existing.quantity += purchase.quantity;
      existing.totalValue += totalAmount;
      existing.costPrice = existing.totalValue / existing.quantity; // Средневзвешенная
      existing.batches.push(newBatch);
      existing.lastUpdated = new Date().toISOString();
    } else {
      const newItem: InventoryItem = {
        id: `INV-${purchase.productCode}`,
        productCode: purchase.productCode,
        productName: purchase.productName,
        quantity: purchase.quantity,
        unit: purchase.unit,
        costPrice: purchase.costPrice,
        totalValue: totalAmount,
        lastUpdated: new Date().toISOString(),
        inventoryAccount: purchase.inventoryAccount,  // ← ПРИВЯЗКА К СЧЁТУ!
        accountName: LITHUANIAN_ACCOUNTS[purchase.inventoryAccount]?.name || 'Неизвестный счёт',
        batches: [newBatch]
      };
      this.inventory.set(purchase.productCode, newItem);
    }

    // Создаём проводку
    this.addAccountingEntry({
      id: `ACC-${Date.now()}`,
      date: new Date().toISOString(),
      debitAccount: purchase.inventoryAccount,
      debitAccountName: LITHUANIAN_ACCOUNTS[purchase.inventoryAccount]?.name || '',
      creditAccount: purchase.payableAccount,
      creditAccountName: LITHUANIAN_ACCOUNTS[purchase.payableAccount]?.name || '',
      amount: totalAmount,
      description: `Приход товара: ${purchase.productName} от ${purchase.supplierName}`,
      documentType: 'PURCHASE',
      documentNumber: purchase.documentNumber,
      productCode: purchase.productCode
    });

    this.saveToStorage();
    return { success: true, batchId, totalAmount };
  }

  // 💰 ПРОДАЖА ТОВАРА (FIFO + проводки)
  addSaleWithAccounting(sale: {
    productCode: string;
    quantity: number;
    salePrice: number;
    customerId: string;
    customerName: string;
    documentNumber: string;
    cogsAccount?: string;       // Себестоимость
    revenueAccount?: string;    // Выручка
    receivableAccount?: string; // Дебиторка
  }) {
    const item = this.inventory.get(sale.productCode);
    if (!item) {
      throw new Error(`Товар ${sale.productCode} не найден на складе`);
    }

    if (item.quantity < sale.quantity) {
      throw new Error(`Недостаточно товара. Доступно: ${item.quantity}, требуется: ${sale.quantity}`);
    }

    // FIFO списание
    let remainingToSell = sale.quantity;
    let totalCostPrice = 0;

    for (const batch of item.batches) {
      if (remainingToSell <= 0) break;
      
      if (batch.remainingQuantity > 0) {
        const quantityFromBatch = Math.min(batch.remainingQuantity, remainingToSell);
        totalCostPrice += quantityFromBatch * batch.costPrice;
        batch.remainingQuantity -= quantityFromBatch;
        remainingToSell -= quantityFromBatch;
      }
    }

    // Обновляем остатки
    item.quantity -= sale.quantity;
    item.totalValue -= totalCostPrice;
    item.lastUpdated = new Date().toISOString();
    item.batches = item.batches.filter(b => b.remainingQuantity > 0);

    const saleAmount = sale.quantity * sale.salePrice;
    const profit = saleAmount - totalCostPrice;

    // Проводка 1: Dт Себестоимость Кт Товары
    this.addAccountingEntry({
      id: `ACC-${Date.now()}-1`,
      date: new Date().toISOString(),
      debitAccount: sale.cogsAccount || '6001',
      debitAccountName: LITHUANIAN_ACCOUNTS[sale.cogsAccount || '6001']?.name || '',
      creditAccount: item.inventoryAccount,
      creditAccountName: item.accountName,
      amount: totalCostPrice,
      description: `Себестоимость продажи: ${item.productName}`,
      documentType: 'SALE',
      documentNumber: sale.documentNumber,
      productCode: sale.productCode
    });

    // Проводка 2: Dт Дебиторка Кт Выручка
    this.addAccountingEntry({
      id: `ACC-${Date.now()}-2`,
      date: new Date().toISOString(),
      debitAccount: sale.receivableAccount || '2410',
      debitAccountName: LITHUANIAN_ACCOUNTS[sale.receivableAccount || '2410']?.name || '',
      creditAccount: sale.revenueAccount || '7001',
      creditAccountName: LITHUANIAN_ACCOUNTS[sale.revenueAccount || '7001']?.name || '',
      amount: saleAmount,
      description: `Выручка от продажи: ${sale.customerName}`,
      documentType: 'SALE',
      documentNumber: sale.documentNumber,
      productCode: sale.productCode
    });

    this.saveToStorage();

    return {
      costPrice: totalCostPrice,
      saleAmount,
      profit,
      remainingStock: item.quantity
    };
  }

  // 📊 ПОЛУЧЕНИЕ ДАННЫХ
  getInventory(): InventoryItem[] {
    return Array.from(this.inventory.values()).sort((a, b) => a.productName.localeCompare(b.productName));
  }

  getInventoryByProduct(productCode: string): InventoryItem | undefined {
    return this.inventory.get