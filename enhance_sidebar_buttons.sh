#!/bin/bash
# 🎯 УЛУЧШАЕМ SIDEBAR КНОПКИ - MOCK ДАННЫЕ + EXPANDABLE
# AI IT SOLAR - Доводим до совершенства!

echo "🎊🔥🎯 УЛУЧШАЕМ SIDEBAR КНОПКИ! 🎯🔥🎊"
echo ""
echo "🎯 ЦЕЛЬ: Все кнопки работают + Mock данные + Expandable меню"
echo "📁 ФАЙЛ: f/src/components/company/CompanySidebar.tsx"

# Backup текущей версии
cp f/src/components/company/CompanySidebar.tsx f/src/components/company/CompanySidebar.tsx.before_enhancement
echo "💾 Backup создан: CompanySidebar.tsx.before_enhancement"

echo ""
echo "🔧 СОЗДАЁМ ENHANCED SIDEBAR С MOCK ДАННЫМИ..."

# Создаём улучшенную версию sidebar
cat > f/src/components/company/CompanySidebar.tsx << 'EOF'
// f/src/components/company/CompanySidebar.tsx
// Enhanced версия с работающими кнопками и mock данными

import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Star, Bell, Package, Users, Calculator, CreditCard, ShoppingCart, BarChart3, Settings, Zap } from 'lucide-react';

interface SidebarItem {
  id: string;
  icon: string;
  title: string;
  route: string;
  expandable?: boolean;
  priority: number;
  isActive?: boolean;
  isPinned?: boolean;
  badge?: string | number | null;
  submenu?: SidebarSubmenuItem[];
}

interface SidebarSubmenuItem {
  id: string;
  title: string;
  route: string;
  icon?: string;
  badge?: string | number | null;
}

interface ExpandedMenus {
  [key: string]: boolean;
}

const CompanySidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 🎯 EXPANDED MENUS STATE
  const [expandedMenus, setExpandedMenus] = useState<ExpandedMenus>({
    warehouse: false,
    cashier: false,
    purchases: false,
    sales: false,
    reports: false
  });

  // 📱 SIDEBAR DATA С MOCK ДАННЫМИ
  const [sidebarItems] = useState<SidebarItem[]>([
    {
      id: 'dashboard',
      icon: "📊",
      title: "Dashboard",
      route: "/dashboard",
      priority: 1,
      isPinned: true,
      badge: null
    },
    {
      id: 'clients',
      icon: "👥", 
      title: "Clients",
      route: "/clients",
      priority: 2,
      isPinned: false,
      badge: 234
    },
    {
      id: 'warehouse',
      icon: "📦",
      title: "Warehouse",
      route: "/warehouse",
      expandable: true,
      priority: 3,
      isPinned: false,
      badge: 8,
      submenu: [
        { id: 'inventory', title: 'Inventory', route: '/warehouse/inventory', icon: '📦', badge: 156 },
        { id: 'locations', title: 'Locations', route: '/warehouse/locations', icon: '📍', badge: 12 },
        { id: 'batches', title: 'Batches', route: '/warehouse/batches', icon: '🏷️', badge: 'NEW' },
        { id: 'transfers', title: 'Transfers', route: '/warehouse/transfers', icon: '🔄', badge: 3 }
      ]
    },
    {
      id: 'purchases',
      icon: "🛒",
      title: "Purchases", 
      route: "/purchases",
      expandable: true,
      priority: 4,
      isPinned: false,
      badge: 15,
      submenu: [
        { id: 'purchase-orders', title: 'Orders', route: '/purchases/orders', icon: '📋', badge: 8 },
        { id: 'purchase-invoices', title: 'Invoices', route: '/purchases/invoices', icon: '🧾', badge: 12 },
        { id: 'suppliers', title: 'Suppliers', route: '/purchases/suppliers', icon: '🏭', badge: 45 },
        { id: 'purchase-analytics', title: 'Analytics', route: '/purchases/analytics', icon: '📈' }
      ]
    },
    {
      id: 'sales',
      icon: "💰",
      title: "Sales",
      route: "/sales", 
      expandable: true,
      priority: 5,
      isPinned: false,
      badge: 23,
      submenu: [
        { id: 'sales-orders', title: 'Orders', route: '/sales/orders', icon: '📄', badge: 15 },
        { id: 'sales-invoices', title: 'Invoices', route: '/sales/invoices', icon: '💳', badge: 8 },
        { id: 'quotes', title: 'Quotes', route: '/sales/quotes', icon: '💭', badge: 'HOT' },
        { id: 'sales-analytics', title: 'Analytics', route: '/sales/analytics', icon: '📊' }
      ]
    },
    {
      id: 'cashier',
      icon: "💰", 
      title: "Cashier",
      route: "/banking",
      expandable: true,
      priority: 6,
      isPinned: false,
      badge: 5,
      submenu: [
        { id: 'bank-accounts', title: 'Bank Accounts', route: '/banking/accounts', icon: '🏦', badge: 3 },
        { id: 'transactions', title: 'Transactions', route: '/banking/transactions', icon: '💸', badge: 127 },
        { id: 'reconciliation', title: 'Reconciliation', route: '/banking/reconciliation', icon: '⚖️', badge: 'PENDING' }
      ]
    },
    {
      id: 'reports',
      icon: "📊",
      title: "Reports",
      route: "/reports",
      expandable: true, 
      priority: 7,
      isPinned: false,
      badge: null,
      submenu: [
        { id: 'financial', title: 'Financial', route: '/reports/financial', icon: '💰' },
        { id: 'inventory', title: 'Inventory', route: '/reports/inventory', icon: '📦' },
        { id: 'sales-reports', title: 'Sales', route: '/reports/sales', icon: '📈' },
        { id: 'custom', title: 'Custom', route: '/reports/custom', icon: '🎯', badge: 'PRO' }
      ]
    },
    {
      id: 'tabbook',
      icon: "⚡",
      title: "TAB-Бухгалтерия", 
      route: "/tabbook",
      priority: 8,
      isPinned: false,
      badge: "NEW"
    },
    {
      id: 'cloudide',
      icon: "☁️",
      title: "Cloud IDE",
      route: "/cloudide", 
      priority: 9,
      isPinned: false,
      badge: "BETA"
    },
    {
      id: 'settings',
      icon: "⚙️",
      title: "Settings",
      route: "/settings",
      priority: 10,
      isPinned: true,
      badge: null
    }
  ]);

  // 🔄 TOGGLE EXPANDABLE MENU
  const toggleMenu = (itemId: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // 🎯 RENDER BADGE
  const renderBadge = (badge: string | number | null) => {
    if (!badge) return null;
    
    const badgeColor = typeof badge === 'string' 
      ? badge === 'NEW' ? 'bg-green-500' 
      : badge === 'HOT' ? 'bg-red-500'
      : badge === 'BETA' ? 'bg-blue-500'
      : badge === 'PRO' ? 'bg-purple-500'
      : badge === 'PENDING' ? 'bg-yellow-500'
      : 'bg-gray-500'
      : 'bg-blue-500';

    return (
      <span className={`${badgeColor} text-white text-xs px-2 py-0.5 rounded-full ml-auto`}>
        {badge}
      </span>
    );
  };

  return (
    <div className="bg-[#0c1c2e] text-white w-64 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#165468]">
        <h2 className="text-lg font-semibold">🏢 Company Dashboard</h2>
        <p className="text-sm text-gray-400">Solar ERP System</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 p-2">
          {sidebarItems.map((item) => (
            <li key={item.id}>
              {/* Main menu item */}
              <div
                className={`group flex items-center p-3 rounded-lg transition-colors cursor-pointer ${
                  location.pathname === item.route
                    ? 'bg-[#165468] text-white'
                    : 'hover:bg-[#165468] text-gray-300 hover:text-white'
                }`}
                onClick={() => {
                  if (item.expandable) {
                    toggleMenu(item.id);
                  } else {
                    navigate(item.route);
                  }
                }}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span className="flex-1">{item.title}</span>
                {renderBadge(item.badge)}
                
                {item.expandable && (
                  <span className="ml-2">
                    {expandedMenus[item.id] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </span>
                )}
              </div>

              {/* Submenu */}
              {item.expandable && expandedMenus[item.id] && item.submenu && (
                <ul className="ml-6 mt-1 space-y-1">
                  {item.submenu.map((subItem) => (
                    <li key={subItem.id}>
                      <NavLink
                        to={subItem.route}
                        className={({ isActive }) =>
                          `flex items-center p-2 rounded transition-colors ${
                            isActive
                              ? 'bg-[#165468] text-white'
                              : 'text-gray-400 hover:bg-[#165468] hover:text-white'
                          }`
                        }
                      >
                        {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                        <span className="flex-1">{subItem.title}</span>
                        {renderBadge(subItem.badge)}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-[#165468] p-4">
        <button 
          onClick={() => navigate('/account/dashboard')}
          className="w-full flex items-center p-2 hover:bg-[#165468] transition-colors rounded"
        >
          <span className="mr-3">🚪</span>
          <span>Back to Companies</span>
        </button>
      </div>
    </div>
  );
};

export default CompanySidebar;
EOF

echo "✅ Enhanced Sidebar создан!"

echo ""
echo "🎯 ЧТО ДОБАВЛЕНО:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 РАБОТАЮЩИЕ КНОПКИ:"
echo "   ✅ Expandable меню (Warehouse, Purchases, Sales, Cashier, Reports)"
echo "   ✅ Click handlers для всех элементов"
echo "   ✅ Smooth transitions и hover effects"
echo ""
echo "🎯 MOCK ДАННЫЕ:"
echo "   📊 Dashboard"
echo "   👥 Clients (234 клиента)"
echo "   📦 Warehouse (8 товаров, 4 подменю)"
echo "   🛒 Purchases (15 заказов, 4 подменю)" 
echo "   💰 Sales (23 продажи, 4 подменю)"
echo "   💰 Cashier (5 операций, 3 подменю)"
echo "   📊 Reports (4 типа отчётов)"
echo "   ⚡ TAB-Бухгалтерия (NEW)"
echo "   ☁️ Cloud IDE (BETA)"
echo "   ⚙️ Settings"
echo ""
echo "🏷️ SMART BADGES:"
echo "   🔢 Числовые: показывают количество (234, 15, 8...)"
echo "   🎯 Статусные: NEW, HOT, BETA, PRO, PENDING"
echo "   🎨 Цветовая кодировка по типу badge"
echo ""
echo "📱 iPhone-STYLE UX:"
echo "   ✅ Плавные анимации"
echo "   ✅ Intuitive navigation"
echo "   ✅ Visual feedback на все действия"
echo "   ✅ Professional color scheme"
echo ""
echo "🚀 ГОТОВ К ТЕСТИРОВАНИЮ:"
echo "   1. Frontend перезагрузится автоматически"
echo "   2. Открой: http://localhost:5173/account/dashboard"
echo "   3. Войди в любую компанию"
echo "   4. Тестируй все кнопки и expandable меню!"
echo "   5. Кликни ⚡ TAB-Бухгалтерия и ☁️ Cloud IDE"
echo ""
echo "💫 СЛЕДУЮЩИЙ ШАГ:"
echo "   Создать Mock страницы для всех route чтобы"
echo "   при клике показывались реалистичные интерфейсы!"
echo ""
echo "🎊 SIDEBAR REVOLUTION COMPLETE!"