import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, GripVertical, Star } from 'lucide-react';

interface SidebarItem {
  id: string;
  icon: string;
  title: string;
  route: string;
  expandable?: boolean;
  priority: number;
  isPinned?: boolean;
  badge?: string | null;
}

interface SubmenuState {
  warehouse: boolean;
  banking: boolean;
  purchases: boolean;  // ← Добавить эту строку
  sales: boolean;      // ← Добавить эту строку
}

const CompanySidebar: React.FC = () => {
  const location = useLocation();

  // 🎯 SIDEBAR ITEMS БЕЗ MOCK ДАННЫХ + DRAG&DROP
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([
    {
      id: 'dashboard',
      icon: '📊',
      title: 'Dashboard',
      route: '/dashboard',
      priority: 1,
      isPinned: true, // Всегда первый
      badge: null,
    },
    {
      id: 'clients',
      icon: '👥',
      title: 'Clients',
      route: '/clients',
      priority: 2,
      isPinned: false,
      badge: null, // БЕЗ mock данных
    },
    {
      id: 'products',
      icon: '📦',
      title: 'Products',
      route: '/products',
      priority: 3,
      isPinned: false,
      badge: null,
    },
    {
      id: 'sales',
      icon: '💰',
      title: 'Sales',
      route: '/sales',
      expandable: true,
      priority: 4,
      isPinned: false,
      badge: null,
    },
    {
      id: 'purchases',
      icon: '🛒',
      title: 'Purchases',
      route: '/purchases',
      expandable: true,
      priority: 5,
      isPinned: false,
      badge: null,
    },
    {
      id: 'warehouse',
      icon: '🏭',
      title: 'Warehouse',
      route: '/warehouse',
      expandable: true,
      priority: 6,
      isPinned: false,
      badge: null,
    },
    {
      id: 'accounts',
      icon: '📋',
      title: 'Chart of Accounts',
      route: '/chart-of-accounts',
      priority: 7,
      isPinned: false,
      badge: null,
    },
    {
      id: 'banking',
      icon: '🏦',
      title: 'Banking',
      route: '/banking',
      expandable: true,
      priority: 8,
      isPinned: false,
      badge: null,
    },
    {
      id: 'tabbook',
      icon: '⚡',
      title: 'TAB-Бухгалтерия',
      route: '/tabbook',
      priority: 9,
      isPinned: false,
      badge: 'NEW',
    },
    {
      id: 'cloudide',
      icon: '☁️',
      title: 'Cloud IDE',
      route: '/cloudide',
      priority: 10,
      isPinned: false,
      badge: 'BETA',
    },
    {
      id: 'settings',
      icon: '⚙️',
      title: 'Settings',
      route: '/settings',
      priority: 11,
      isPinned: true, // Всегда последний
      badge: null,
    },
  ]);

  // 📱 DRAG & DROP STATE
  const [draggedItem, setDraggedItem] = useState<SidebarItem | null>(null);
  const [dragOverItem, setDragOverItem] = useState<SidebarItem | null>(null);

  // 🔄 EXPANDABLE MENUS STATE
  const [expandedMenus, setExpandedMenus] = useState<SubmenuState>({
    warehouse: location.pathname.includes('/warehouse'),
    banking: location.pathname.includes('/banking'),
    purchases: location.pathname.includes('/purchases'),
    sales: location.pathname.includes('/sales'),
  });

  // 💾 ЗАГРУЗКА СОХРАНЁННОГО ПОРЯДКА
  useEffect(() => {
    const savedPriorities = localStorage.getItem('sidebarPriorities');
    if (savedPriorities) {
      try {
        const priorities = JSON.parse(savedPriorities);
        setSidebarItems((prevItems) =>
          prevItems
            .map((item) => ({
              ...item,
              priority: priorities[item.id] || item.priority,
            }))
            .sort((a, b) => a.priority - b.priority)
        );
      } catch (error) {
        console.error('Error loading sidebar priorities:', error);
      }
    }
  }, []);

  // 💾 СОХРАНЕНИЕ ПОРЯДКА
  const savePriorities = (items: SidebarItem[]) => {
    const priorities: { [key: string]: number } = {};
    items.forEach((item, index) => {
      priorities[item.id] = index + 1;
    });
    localStorage.setItem('sidebarPriorities', JSON.stringify(priorities));
  };

  // 🔄 TOGGLE EXPANDABLE MENU
  const toggleMenu = (itemId: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [itemId]: !prev[itemId as keyof SubmenuState],
    }));
  };

  // 📱 DRAG & DROP HANDLERS N
  const handleDragStart = (e: React.DragEvent, item: SidebarItem) => {
    if (item.isPinned) {
      e.preventDefault();
      return;
    }
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, item: SidebarItem) => {
    e.preventDefault();
    if (item.isPinned || draggedItem?.isPinned) return;
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(item);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetItem: SidebarItem) => {
    e.preventDefault();

    if (
      !draggedItem ||
      draggedItem.id === targetItem.id ||
      targetItem.isPinned
    ) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const newItems = [...sidebarItems];
    const draggedIndex = newItems.findIndex(
      (item) => item.id === draggedItem.id
    );
    const targetIndex = newItems.findIndex((item) => item.id === targetItem.id);

    // Удаляем и вставляем
    const [draggedMenuItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedMenuItem);

    // Пересчитываем приоритеты
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      priority: index + 1,
    }));

    setSidebarItems(updatedItems);
    savePriorities(updatedItems);

    setDraggedItem(null);
    setDragOverItem(null);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-3 hover:bg-slate-700 transition-colors ${
      isActive ? 'bg-slate-700 border-r-2 border-orange-500' : ''
    }`;

  // Сортируем по приоритету
  const sortedItems = [...sidebarItems].sort((a, b) => a.priority - b.priority);

  return (
    <div className="w-64 bg-slate-800 text-white flex-shrink-0 h-full flex flex-col">
      {/* Header */}
      <div className="p-4">
        <NavLink
          to="/account/dashboard"
          className="text-lg font-bold text-white no-underline hover:opacity-90 transition-opacity"
          title="Go to company selection"
        >
          Solar
        </NavLink>
      </div>

      {/* Navigation with Drag & Drop */}
      <nav className="flex-1 overflow-y-auto">
        {sortedItems.map((item) => (
          <div
            key={item.id}
            className={`
              ${dragOverItem?.id === item.id ? 'border-t-2 border-orange-500' : ''}
              ${draggedItem?.id === item.id ? 'opacity-50' : ''}
            `}
            draggable={!item.isPinned}
            onDragStart={(e) => handleDragStart(e, item)}
            onDragOver={(e) => handleDragOver(e, item)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, item)}
          >
            <div className="flex items-center">
              {/* Drag Handle */}
              {!item.isPinned && (
                <div className="p-2 cursor-grab active:cursor-grabbing hover:bg-slate-700">
                  <GripVertical className="w-4 h-4 text-slate-400" />
                </div>
              )}

              {/* Pinned Icon */}
              {item.isPinned && (
                <div className="p-2">
                  <Star className="w-4 h-4 text-orange-500 fill-current" />
                </div>
              )}

              {/* Menu Item */}
              <NavLink
                to={item.route}
                className={linkClass}
                style={{ flex: 1 }}
                onClick={(e) => {
                  if (item.expandable) {
                    e.preventDefault();
                    toggleMenu(item.id);
                  }
                }}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="flex-1">{item.title}</span>

                {/* Badge */}
                {item.badge && (
                  <span className="ml-2 px-2 py-1 text-xs bg-orange-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}

                {/* Expandable Arrow */}
                {item.expandable && (
                  <span className="ml-2">
                    {expandedMenus[item.id as keyof SubmenuState] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </span>
                )}
              </NavLink>
            </div>

            {/* Submenu */}
            {item.expandable &&
              expandedMenus[item.id as keyof SubmenuState] && (
                <div className="bg-slate-900 border-l-2 border-slate-600">
                  <div className="pl-8 py-2">
                    <div className="text-slate-400 text-sm">
                      // 2️⃣ ЗАМЕНИ НА ЭТУ ЛОГИКУ:
                      {/* Submenu */}
                      {item.expandable &&
                        expandedMenus[item.id as keyof SubmenuState] && (
                          <div className="bg-slate-900 border-l-2 border-slate-600">
                            <div className="pl-6 py-2">
                              {/* PURCHASES SUBMENU */}
                              {item.id === 'purchases' && (
                                <div className="space-y-1">
                                  <NavLink
                                    to="/purchases/new"
                                    className="flex items-center p-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  >
                                    <span className="mr-3">➕</span>
                                    <span>New Purchase</span>
                                  </NavLink>
                                  <NavLink
                                    to="/purchases/orders"
                                    className="flex items-center p-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  >
                                    <span className="mr-3">📋</span>
                                    <span>Purchase Orders</span>
                                    <span className="ml-auto bg-blue-600 text-xs px-2 py-1 rounded">
                                      8
                                    </span>
                                  </NavLink>
                                  <NavLink
                                    to="/purchases/invoices"
                                    className="flex items-center p-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  >
                                    <span className="mr-3">🧾</span>
                                    <span>Invoices</span>
                                    <span className="ml-auto bg-green-600 text-xs px-2 py-1 rounded">
                                      12
                                    </span>
                                  </NavLink>
                                  <NavLink
                                    to="/purchases/suppliers"
                                    className="flex items-center p-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  >
                                    <span className="mr-3">🏭</span>
                                    <span>Suppliers</span>
                                    <span className="ml-auto bg-gray-600 text-xs px-2 py-1 rounded">
                                      45
                                    </span>
                                  </NavLink>
                                  <NavLink
                                    to="/purchases/analytics"
                                    className="flex items-center p-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  >
                                    <span className="mr-3">📈</span>
                                    <span>Analytics</span>
                                  </NavLink>
                                  <NavLink
                                    to="/purchases/approvals"
                                    className="flex items-center p-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  >
                                    <span className="mr-3">✅</span>
                                    <span>Approvals</span>
                                    <span className="ml-auto bg-red-600 text-xs px-2 py-1 rounded">
                                      HOT
                                    </span>
                                  </NavLink>
                                </div>
                              )}

                              {/* SALES SUBMENU */}
                              {item.id === 'sales' && (
                                <div className="space-y-1">
                                  <NavLink
                                    to="/sales/new"
                                    className="flex items-center p-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  >
                                    <span className="mr-3">➕</span>
                                    <span>New Sale</span>
                                  </NavLink>
                                  <NavLink
                                    to="/sales/orders"
                                    className="flex items-center p-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  >
                                    <span className="mr-3">📄</span>
                                    <span>Sales Orders</span>
                                    <span className="ml-auto bg-blue-600 text-xs px-2 py-1 rounded">
                                      15
                                    </span>
                                  </NavLink>
                                  <NavLink
                                    to="/sales/invoices"
                                    className="flex items-center p-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  >
                                    <span className="mr-3">💳</span>
                                    <span>Invoices</span>
                                    <span className="ml-auto bg-green-600 text-xs px-2 py-1 rounded">
                                      8
                                    </span>
                                  </NavLink>
                                  <NavLink
                                    to="/sales/quotes"
                                    className="flex items-center p-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  >
                                    <span className="mr-3">💭</span>
                                    <span>Quotes</span>
                                    <span className="ml-auto bg-red-600 text-xs px-2 py-1 rounded">
                                      HOT
                                    </span>
                                  </NavLink>
                                  <NavLink
                                    to="/sales/analytics"
                                    className="flex items-center p-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  >
                                    <span className="mr-3">📊</span>
                                    <span>Analytics</span>
                                  </NavLink>
                                  <NavLink
                                    to="/sales/customers"
                                    className="flex items-center p-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  >
                                    <span className="mr-3">👥</span>
                                    <span>Customers</span>
                                    <span className="ml-auto bg-gray-600 text-xs px-2 py-1 rounded">
                                      124
                                    </span>
                                  </NavLink>
                                </div>
                              )}

                              {/* WAREHOUSE SUBMENU */}
                              {item.id === 'warehouse' && (
                                <div className="space-y-1">
                                  <NavLink
                                    to="/warehouse/inventory"
                                    className="flex items-center p-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  >
                                    <span className="mr-3">📦</span>
                                    <span>Inventory</span>
                                    <span className="ml-auto bg-blue-600 text-xs px-2 py-1 rounded">
                                      2.1K
                                    </span>
                                  </NavLink>
                                  <NavLink
                                    to="/warehouse/movements"
                                    className="flex items-center p-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  >
                                    <span className="mr-3">🔄</span>
                                    <span>Stock Movements</span>
                                    <span className="ml-auto bg-green-600 text-xs px-2 py-1 rounded">
                                      127
                                    </span>
                                  </NavLink>
                                  <NavLink
                                    to="/warehouse/batches"
                                    className="flex items-center p-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  >
                                    <span className="mr-3">🏷️</span>
                                    <span>Batch Tracking</span>
                                    <span className="ml-auto bg-purple-600 text-xs px-2 py-1 rounded">
                                      NEW
                                    </span>
                                  </NavLink>
                                  <NavLink
                                    to="/warehouse/reports"
                                    className="flex items-center p-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  >
                                    <span className="mr-3">📊</span>
                                    <span>Reports</span>
                                  </NavLink>
                                  <NavLink
                                    to="/warehouse/adjustments"
                                    className="flex items-center p-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  >
                                    <span className="mr-3">⚖️</span>
                                    <span>Adjustments</span>
                                    <span className="ml-auto bg-yellow-600 text-xs px-2 py-1 rounded">
                                      3
                                    </span>
                                  </NavLink>
                                  <NavLink
                                    to="/warehouse/locations"
                                    className="flex items-center p-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  >
                                    <span className="mr-3">🏭</span>
                                    <span>Locations</span>
                                    <span className="ml-auto bg-gray-600 text-xs px-2 py-1 rounded">
                                      8
                                    </span>
                                  </NavLink>
                                </div>
                              )}

                              {/* BANKING SUBMENU */}
                              {item.id === 'banking' && (
                                <div className="space-y-1">
                                  <NavLink
                                    to="/banking/accounts"
                                    className="flex items-center p-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  >
                                    <span className="mr-3">🏦</span>
                                    <span>Bank Accounts</span>
                                    <span className="ml-auto bg-blue-600 text-xs px-2 py-1 rounded">
                                      3
                                    </span>
                                  </NavLink>
                                  <NavLink
                                    to="/banking/transactions"
                                    className="flex items-center p-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  >
                                    <span className="mr-3">💸</span>
                                    <span>Transactions</span>
                                    <span className="ml-auto bg-green-600 text-xs px-2 py-1 rounded">
                                      127
                                    </span>
                                  </NavLink>
                                  <NavLink
                                    to="/banking/reconcile"
                                    className="flex items-center p-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  >
                                    <span className="mr-3">⚖️</span>
                                    <span>Reconcile</span>
                                    <span className="ml-auto bg-yellow-600 text-xs px-2 py-1 rounded">
                                      5
                                    </span>
                                  </NavLink>
                                  <NavLink
                                    to="/banking/reports"
                                    className="flex items-center p-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  >
                                    <span className="mr-3">📊</span>
                                    <span>Reports</span>
                                  </NavLink>
                                  <NavLink
                                    to="/banking/payments"
                                    className="flex items-center p-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                  >
                                    <span className="mr-3">💳</span>
                                    <span>Payments</span>
                                    <span className="ml-auto bg-red-600 text-xs px-2 py-1 rounded">
                                      HOT
                                    </span>
                                  </NavLink>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700 p-4">
        <button
          onClick={() => {
            localStorage.removeItem('currentCompanyId');
            localStorage.removeItem('currentCompanyName');
            window.location.href = '/account/dashboard';
          }}
          className="text-sm text-slate-400 hover:text-white transition-colors w-full text-left flex items-center"
        >
          <span className="mr-2">🔙</span>
          <span>Back to Companies</span>
        </button>
      </div>
    </div>
  );
};

export default CompanySidebar;
