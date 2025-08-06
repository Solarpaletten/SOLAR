import React, { useState, useEffect } from 'react';

interface Purchase {
  id: number;
  date: string;
  supplier: string;
  product: string;
  quantity: number;
  price: number;
  total: number;
  status: string;
}

const PurchasesPage: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPurchases([
        {
          id: 1,
          date: '2025-08-06',
          supplier: 'ASSET LOGISTICS GMBH',
          product: 'RESIDUES TECHNICAL OIL',
          quantity: 25,
          price: 700,
          total: 17500,
          status: 'Completed'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddPurchase = () => {
    const newPurchase: Purchase = {
      id: purchases.length + 1,
      date: new Date().toISOString().split('T')[0],
      supplier: 'New Supplier',
      product: 'RESIDUES TECHNICAL OIL',
      quantity: 10,
      price: 750,
      total: 7500,
      status: 'Pending'
    };
    
    setPurchases([...purchases, newPurchase]);
    console.log('🛒 Purchase added - should update warehouse!');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-bold mb-2">🛒 Purchases Management</h1>
        <p className="text-blue-100">Manage purchase orders - clean & simple</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{purchases.length}</p>
            </div>
            <div className="text-blue-500 text-2xl">🛒</div>
          </div>
        </div>
      </div>

      {/* Add Button */}
      <div className="mb-6">
        <button
          onClick={handleAddPurchase}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          ➕ Add Purchase
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{purchase.date}</td>
                <td className="px-6 py-4 text-sm">{purchase.supplier}</td>
                <td className="px-6 py-4 text-sm">{purchase.product}</td>
                <td className="px-6 py-4 text-sm">{purchase.quantity} T</td>
                <td className="px-6 py-4 text-sm font-medium">€{purchase.total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    purchase.status === 'Completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {purchase.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchasesPage;
