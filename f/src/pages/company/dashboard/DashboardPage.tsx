// f/src/pages/company/dashboard/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import companyService from '../../../services/company/companyService';

interface DashboardStats {
  clients: number;
  products: number;
  sales: number;
  orders: number;
  revenue: string;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    clients: 0,
    products: 0,
    sales: 0,
    orders: 0,
    revenue: '$0'
  });
  const [loading, setLoading] = useState(true);
  const [currentCompanyName, setCurrentCompanyName] = useState('');

  // 📡 Загрузка данных dashboard при монтировании
  useEffect(() => {
    fetchDashboardData();
    loadCompanyName();
  }, []);

  // 🏢 Загрузка имени текущей компании
  const loadCompanyName = () => {
    const companyName = localStorage.getItem('currentCompanyName') || 'Company';
    setCurrentCompanyName(companyName);
  };

  // 📊 Загрузка статистики dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      const companyId = localStorage.getItem('currentCompanyId');
      
      if (!token || !companyId) {
        console.warn('Missing auth or company context');
        return;
      }

      console.log('📊 Fetching dashboard data for company:', companyId);

      // 🔄 В реальном проекте здесь будет API вызов
      // const response = await fetch('/api/company/dashboard', { ... });
      
      // 🧪 Моковые данные для демонстрации
      setTimeout(() => {
        setStats({
          clients: 5,
          products: 15,
          sales: 12500,
          orders: 8,
          revenue: '$12,500'
        });
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  // 🏠 Navigation handlers
  const handleNavigateToClients = () => {
    navigate('/clients');
  };

  const handleBackToCompanies = () => {
    // Очищаем company context и возвращаемся к выбору компаний
    localStorage.removeItem('currentCompanyId');
    localStorage.removeItem('currentCompanyName');
    navigate('/account/dashboard');
  };

  const handleNavigateToSection = (section: string) => {
    console.log(`🔄 Navigate to ${section} (будет реализовано в v1.8.0)`);
    // navigate(`/${section}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 📋 Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                🏭 {currentCompanyName} Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Company operations and analytics</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleBackToCompanies}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to Companies
              </button>
              <div className="bg-white rounded-lg shadow-sm px-4 py-2">
                <span className="text-sm text-gray-600">Company ID:</span>
                <span className="ml-2 font-medium text-gray-800">
                  {localStorage.getItem('currentCompanyId')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 📊 Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl">
                👥
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-800">
                  {loading ? '...' : stats.clients}
                </div>
                <div className="text-gray-600">Clients</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xl">
                📦
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-800">
                  {loading ? '...' : stats.products}
                </div>
                <div className="text-gray-600">Products</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white text-xl">
                💰
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-800">
                  {loading ? '...' : stats.revenue}
                </div>
                <div className="text-gray-600">Sales</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                📋
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-800">
                  {loading ? '...' : stats.orders}
                </div>
                <div className="text-gray-600">Orders</div>
              </div>
            </div>
          </div>
        </div>

        {/* 🚀 Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">🚀 Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 👥 Clients Management */}
            <div
              onClick={handleNavigateToClients}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl">
                  👥
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-800">Clients</h3>
                  <p className="text-gray-600 text-sm">Manage your clients</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                View, add, and manage your company clients. Track contact information and client relationships.
              </div>
              <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
                Manage Clients →
              </button>
            </div>

            {/* 📦 Products (Coming Soon) */}
            <div
              onClick={() => handleNavigateToSection('products')}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 opacity-75"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xl">
                  📦
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-800">Products</h3>
                  <p className="text-gray-600 text-sm">Inventory management</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Manage your product catalog, track inventory, and update pricing.
              </div>
              <button className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed">
                Coming in v1.8.0
              </button>
            </div>

            {/* 💰 Sales (Coming Soon) */}
            <div
              onClick={() => handleNavigateToSection('sales')}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 opacity-75"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white text-xl">
                  💰
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-800">Sales</h3>
                  <p className="text-gray-600 text-sm">Track sales & revenue</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Record sales transactions, generate invoices, and track revenue.
              </div>
              <button className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed">
                Coming in v1.9.0
              </button>
            </div>

            {/* 🏪 Warehouse (Coming Soon) */}
            <div
              onClick={() => handleNavigateToSection('warehouse')}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 opacity-75"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                  🏪
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-800">Warehouse</h3>
                  <p className="text-gray-600 text-sm">Stock management</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Track inventory levels, manage stock movements, and optimize storage.
              </div>
              <button className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed">
                Coming in v1.8.0
              </button>
            </div>

            {/* 🏦 Banking (Coming Soon) */}
            <div
              onClick={() => handleNavigateToSection('banking')}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 opacity-75"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl">
                  🏦
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-800">Banking</h3>
                  <p className="text-gray-600 text-sm">Financial operations</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Manage bank accounts, track transactions, and reconcile payments.
              </div>
              <button className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed">
                Coming in v2.0.0
              </button>
            </div>

            {/* 📊 Reports (Coming Soon) */}
            <div
              onClick={() => handleNavigateToSection('reports')}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 opacity-75"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-xl">
                  📊
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-800">Reports</h3>
                  <p className="text-gray-600 text-sm">Analytics & insights</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Generate detailed reports, analyze trends, and get business insights.
              </div>
              <button className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed">
                Coming in v2.0.0
              </button>
            </div>
          </div>
        </div>

        {/* 📈 Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">📈 Recent Activity</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-600">Loading activity...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600">👥</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New client added</p>
                    <p className="text-sm text-gray-500">Desert Solar DMCC was added to clients</p>
                  </div>
                  <div className="text-sm text-gray-500">2 hours ago</div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">💰</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Sale recorded</p>
                    <p className="text-sm text-gray-500">$2,500 sale to Emirates Energy</p>
                  </div>
                  <div className="text-sm text-gray-500">5 hours ago</div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600">📦</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Product updated</p>
                    <p className="text-sm text-gray-500">Solar Panel inventory updated</p>
                  </div>
                  <div className="text-sm text-gray-500">1 day ago</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 🔧 Debug Info */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg shadow-sm p-4 max-w-2xl mx-auto">
            <h4 className="font-medium text-gray-700 mb-2">🔧 Debug Information</h4>
            <div className="space-y-1 text-sm text-left text-gray-600">
              <p>• Current Route: /dashboard</p>
              <p>• Company: {currentCompanyName} (ID: {localStorage.getItem('currentCompanyId')})</p>
              <p>• Navigation: Account → Company → Dashboard ✅</p>
              <p>• Clients Link: Ready for /clients navigation</p>
              <p>• Stats Loading: {loading ? 'Loading...' : 'Loaded'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
