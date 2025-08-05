import React, { useState, useEffect } from 'react';
import CompanyLayout from '../../../components/company/CompanyLayout';

interface InventoryItem {
  id: number;
  product: string;
  quantity: number;
  unit: string;
  lastUpdate: string;
  status: 'OK' | 'LOW' | 'OUT';
}

const WarehousePage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    // Простой mock для начала
    setInventory([
      {
        id: 1,
        product: 'RESIDUES TECHNICAL OIL',
        quantity: 33,
        unit: 'T',
        lastUpdate: '2025-08-05',
        status: 'OK'
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK': return 'bg-green-100 text-green-800';
      case 'LOW': return 'bg-yellow-100 text-yellow-800';
      case 'OUT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * 700), 0); // Assuming €700/T

  return (
  
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🏭 Warehouse Inventory
          </h1>
          <p className="text-gray-600">
            Real-time inventory tracking - updated by Purchases, reduced by Sales
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
              </div>
              <div className="bg-blue-500 rounded-full p-3">
                <span className="text-white text-xl">📦</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Quantity</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inventory.reduce((sum, item) => sum + item.quantity, 0)} T
                </p>
              </div>
              <div className="bg-purple-500 rounded-full p-3">
                <span className="text-white text-xl">⚖️</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  €{totalValue.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-500 rounded-full p-3">
                <span className="text-white text-xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-2xl font-bold text-green-600">Good</p>
              </div>
              <div className="bg-orange-500 rounded-full p-3">
                <span className="text-white text-xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Current Inventory</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value (€700/T)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Update
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €{(item.quantity * 700).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.lastUpdate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {inventory.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-4xl mb-4">📦</div>
                <p className="text-gray-500">No inventory items. Add purchases to see inventory here!</p>
              </div>
            )}
          </div>
        </div>

        {/* Integration Status */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-yellow-400 text-lg mr-3">🔄</div>
            <div className="flex-1">
              <h4 className="text-yellow-800 font-medium mb-2">Integration Status:</h4>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• ✅ Display current inventory</li>
                <li>• 🔄 Auto-update from Purchases (coming soon)</li>
                <li>• 🔄 Auto-deduct from Sales (coming soon)</li>
                <li>• 🔄 Real-time sync with database</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default WarehousePage;
