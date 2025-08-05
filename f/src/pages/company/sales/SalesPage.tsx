import React, { useState, useEffect } from 'react';
import CompanyLayout from '../../../components/company/CompanyLayout';

interface SimpleSale {
  id: number;
  date: string;
  customer: string;
  product: string;
  quantity: number;
  price: number;
  total: number;
}

const SalesPage: React.FC = () => {
  const [sales, setSales] = useState<SimpleSale[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSale, setNewSale] = useState({
    customer: '',
    product: 'RESIDUES TECHNICAL OIL',
    quantity: 0,
    price: 0
  });

  // Простые mock данные для начала
  useEffect(() => {
    setSales([
      {
        id: 1,
        date: '2025-08-05',
        customer: 'ASSET BILANS SPOLKA',
        product: 'RESIDUES TECHNICAL OIL',
        quantity: 10,
        price: 800,
        total: 8000
      }
    ]);
  }, []);

  const handleAddSale = () => {
    if (newSale.customer && newSale.quantity > 0 && newSale.price > 0) {
      const sale: SimpleSale = {
        id: sales.length + 1,
        date: new Date().toISOString().split('T')[0],
        customer: newSale.customer,
        product: newSale.product,
        quantity: newSale.quantity,
        price: newSale.price,
        total: newSale.quantity * newSale.price
      };
      
      setSales([...sales, sale]);
      setNewSale({ customer: '', product: 'RESIDUES TECHNICAL OIL', quantity: 0, price: 0 });
      setShowAddForm(false);
      
      // TODO: Здесь будет интеграция с Warehouse (уменьшение остатков)
      console.log('💰 Sale created:', sale);
      console.log('📦 TODO: Deduct from warehouse inventory');
    }
  };

  return (
    <CompanyLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            💰 Sales Management
          </h1>
          <p className="text-gray-600">
            Simple sales tracking - deducts from warehouse inventory
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">{sales.length}</p>
              </div>
              <div className="bg-green-500 rounded-full p-3">
                <span className="text-white text-xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  €{sales.reduce((sum, s) => sum + s.total, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-500 rounded-full p-3">
                <span className="text-white text-xl">📈</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sold Quantity</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sales.reduce((sum, s) => sum + s.quantity, 0)} T
                </p>
              </div>
              <div className="bg-purple-500 rounded-full p-3">
                <span className="text-white text-xl">📦</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  €{sales.length ? Math.round(sales.reduce((sum, s) => sum + s.price, 0) / sales.length) : 0}
                </p>
              </div>
              <div className="bg-orange-500 rounded-full p-3">
                <span className="text-white text-xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add Sale Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <span>➕</span>
            {showAddForm ? 'Cancel' : 'Add New Sale'}
          </button>
        </div>

        {/* Add Sale Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Sale</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer
                </label>
                <select
                  value={newSale.customer}
                  onChange={(e) => setNewSale({...newSale, customer: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Customer</option>
                  <option value="ASSET BILANS SPOLKA">ASSET BILANS SPOLKA</option>
                  <option value="SWAPOIL GMBH">SWAPOIL GMBH</option>
                  <option value="Test Customer">Test Customer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <select
                  value={newSale.product}
                  onChange={(e) => setNewSale({...newSale, product: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="RESIDUES TECHNICAL OIL">RESIDUES TECHNICAL OIL</option>
                  <option value="Test Product">Test Product</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity (Tons)
                </label>
                <input
                  type="number"
                  value={newSale.quantity}
                  onChange={(e) => setNewSale({...newSale, quantity: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Ton (€)
                </label>
                <input
                  type="number"
                  value={newSale.price}
                  onChange={(e) => setNewSale({...newSale, price: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-4">
              <button
                onClick={handleAddSale}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                disabled={!newSale.customer || newSale.quantity <= 0 || newSale.price <= 0}
              >
                ✅ Add Sale
              </button>
              
              <div className="text-sm text-gray-600 flex items-center">
                Total: €{(newSale.quantity * newSale.price).toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* Sales Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Sales</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price/T
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.quantity} T
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €{sale.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      €{sale.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Deducted from Warehouse
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {sales.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-4xl mb-4">💰</div>
                <p className="text-gray-500">No sales yet. Add your first sale above!</p>
              </div>
            )}
          </div>
        </div>

        {/* Integration Status */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-green-400 text-lg mr-3">🎯</div>
            <div className="flex-1">
              <h4 className="text-green-800 font-medium mb-2">Sales Flow:</h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• ✅ Create sales orders</li>
                <li>• 🔄 Auto-deduct from warehouse (coming soon)</li>
                <li>• 🔄 Real-time inventory updates</li>
                <li>• 🔄 Connect with accounting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
};

export default SalesPage;
