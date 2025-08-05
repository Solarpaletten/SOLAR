import React, { useState, useEffect } from 'react';
import CompanyLayout from '../../../components/company/CompanyLayout';

interface SimplePurchase {
  id: number;
  date: string;
  supplier: string;
  product: string;
  quantity: number;
  price: number;
  total: number;
}

const PurchasesPage: React.FC = () => {
  const [purchases, setPurchases] = useState<SimplePurchase[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPurchase, setNewPurchase] = useState({
    supplier: '',
    product: 'RESIDUES TECHNICAL OIL',
    quantity: 0,
    price: 0
  });

  // Простые mock данные для начала
  useEffect(() => {
    setPurchases([
      {
        id: 1,
        date: '2025-08-05',
        supplier: 'ASSET LOGISTICS GMBH',
        product: 'RESIDUES TECHNICAL OIL',
        quantity: 33,
        price: 700,
        total: 23100
      }
    ]);
  }, []);

  const handleAddPurchase = () => {
    if (newPurchase.supplier && newPurchase.quantity > 0 && newPurchase.price > 0) {
      const purchase: SimplePurchase = {
        id: purchases.length + 1,
        date: new Date().toISOString().split('T')[0],
        supplier: newPurchase.supplier,
        product: newPurchase.product,
        quantity: newPurchase.quantity,
        price: newPurchase.price,
        total: newPurchase.quantity * newPurchase.price
      };
      
      setPurchases([...purchases, purchase]);
      setNewPurchase({ supplier: '', product: 'RESIDUES TECHNICAL OIL', quantity: 0, price: 0 });
      setShowAddForm(false);
      
      // TODO: Здесь будет интеграция с Warehouse
      console.log('🛒 Purchase created:', purchase);
      console.log('📦 TODO: Add to warehouse inventory');
    }
  };

  return (
    
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🛒 Purchases Management
          </h1>
          <p className="text-gray-600">
            Simple purchases tracking - testing Purchases → Warehouse → Sales flow
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Purchases</p>
                <p className="text-2xl font-bold text-gray-900">{purchases.length}</p>
              </div>
              <div className="bg-blue-500 rounded-full p-3">
                <span className="text-white text-xl">🛒</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  €{purchases.reduce((sum, p) => sum + p.total, 0).toLocaleString()}
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
                <p className="text-sm font-medium text-gray-600">Total Quantity</p>
                <p className="text-2xl font-bold text-gray-900">
                  {purchases.reduce((sum, p) => sum + p.quantity, 0)} T
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
                  €{purchases.length ? Math.round(purchases.reduce((sum, p) => sum + p.price, 0) / purchases.length) : 0}
                </p>
              </div>
              <div className="bg-orange-500 rounded-full p-3">
                <span className="text-white text-xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add Purchase Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <span>➕</span>
            {showAddForm ? 'Cancel' : 'Add New Purchase'}
          </button>
        </div>

        {/* Add Purchase Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Purchase</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier
                </label>
                <select
                  value={newPurchase.supplier}
                  onChange={(e) => setNewPurchase({...newPurchase, supplier: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Supplier</option>
                  <option value="ASSET LOGISTICS GMBH">ASSET LOGISTICS GMBH</option>
                  <option value="SWAPOIL GMBH">SWAPOIL GMBH</option>
                  <option value="Test Supplier">Test Supplier</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <select
                  value={newPurchase.product}
                  onChange={(e) => setNewPurchase({...newPurchase, product: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  value={newPurchase.quantity}
                  onChange={(e) => setNewPurchase({...newPurchase, quantity: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  value={newPurchase.price}
                  onChange={(e) => setNewPurchase({...newPurchase, price: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-4">
              <button
                onClick={handleAddPurchase}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                disabled={!newPurchase.supplier || newPurchase.quantity <= 0 || newPurchase.price <= 0}
              >
                ✅ Add Purchase
              </button>
              
              <div className="text-sm text-gray-600 flex items-center">
                Total: €{(newPurchase.quantity * newPurchase.price).toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* Purchases Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Purchases</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
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
                {purchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.supplier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.quantity} T
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €{purchase.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      €{purchase.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Added to Warehouse
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {purchases.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-4xl mb-4">🛒</div>
                <p className="text-gray-500">No purchases yet. Add your first purchase above!</p>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-blue-400 text-lg mr-3">💡</div>
            <div className="flex-1">
              <h4 className="text-blue-800 font-medium mb-2">Next Steps for Full Integration:</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Create purchase → Auto-update warehouse inventory</li>
                <li>• Connect with Products database</li>
                <li>• Link to Sales for inventory deduction</li>
                <li>• Add real supplier management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
   
  );
};

export default PurchasesPage;
