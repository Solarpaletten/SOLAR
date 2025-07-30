// f/src/pages/company/dashboard/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import CompanyLayout from '../../../components/company/CompanyLayout';

const DashboardPage: React.FC = () => {
  const [companyName, setCompanyName] = useState<string>('');
  const [companyId, setCompanyId] = useState<string>('');

  useEffect(() => {
    const name =
      localStorage.getItem('currentCompanyName') || 'Unknown Company';
    const id = localStorage.getItem('currentCompanyId') || '0';
    setCompanyName(name);
    setCompanyId(id);
  }, []);

  return (
    <CompanyLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            📊 Company Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome to {companyName} (ID: {companyId})
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Clients</p>
                <p className="text-3xl font-bold">24</p>
              </div>
              <div className="text-4xl opacity-80">👥</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Monthly Revenue</p>
                <p className="text-3xl font-bold">€45,230</p>
              </div>
              <div className="text-4xl opacity-80">💰</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Active Projects</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="text-4xl opacity-80">📈</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Team Members</p>
                <p className="text-3xl font-bold">8</p>
              </div>
              <div className="text-4xl opacity-80">👨‍💼</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🚀 Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <span className="text-2xl mr-2">👥</span>
                <span className="text-sm font-medium">Add Client</span>
              </button>
              // В секции Quick Actions добавьте:
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    📦 Products
                  </h3>
                  <Link
                    to="/products"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View All →
                  </Link>
                </div>

                <div className="space-y-3">
                  <Link
                    to="/products"
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-green-600">➕</span>
                      <span className="font-medium text-gray-800">
                        Add New Product
                      </span>
                    </div>
                    <span className="text-green-600">→</span>
                  </Link>

                  <Link
                    to="/products"
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-blue-600">📋</span>
                      <span className="font-medium text-gray-800">
                        Manage Catalog
                      </span>
                    </div>
                    <span className="text-blue-600">→</span>
                  </Link>
                </div>
              </div>
              <button className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <span className="text-2xl mr-2">🏦</span>
                <span className="text-sm font-medium">Banking</span>
              </button>
              <button className="flex items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                <span className="text-2xl mr-2">📊</span>
                <span className="text-sm font-medium">Reports</span>
              </button>
              <button className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <span className="text-2xl mr-2">⚙️</span>
                <span className="text-sm font-medium">Settings</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📈 Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                  C
                </div>
                <div>
                  <p className="text-sm font-medium">New client added</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                  €
                </div>
                <div>
                  <p className="text-sm font-medium">Payment received</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                  📋
                </div>
                <div>
                  <p className="text-sm font-medium">Report generated</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🏢 Company Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Company Name</p>
              <p className="font-medium">{companyName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Company ID</p>
              <p className="font-medium">{companyId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className="inline-flex px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
};

export default DashboardPage;
