# Quick Company Sidebar Replacement Script
#!/bin/bash

echo "🔄 Replacing Company Sidebar with iPhone Drag & Drop version..."

# Backup current sidebar
cp f/src/components/company/CompanySidebar.tsx f/src/components/company/CompanySidebar.tsx.backup

# Create the enhanced sidebar
cat > f/src/components/company/CompanySidebar.tsx << 'EOF'
// f/src/components/company/CompanySidebar.tsx
// Финальная версия: готова к интеграции в проект

import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { GripVertical, Star, ChevronLeft, ChevronDown } from 'lucide-react';

interface SidebarItem {
  id: string;
  icon: string;
  title: string;
  route: string;
  expandable?: boolean;
  priority: number;
  isActive?: boolean;
  isPinned?: boolean;
  badge?: string | null;
}

interface SubmenuState {
  warehouse: boolean;
  cashier: boolean;
}

const CompanySidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 📱 РЕАЛЬНЫЕ ДАННЫЕ С DRAG & DROP ФУНКЦИОНАЛЬНОСТЬЮ
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([
    {
      id: 'dashboard',
      icon: "📊",
      title: "Dashboard",
      route: "/dashboard",
      priority: 1,
      isPinned: true, // Всегда первый
      badge: null
    },
    {
      id: 'clients',
      icon: "👥",
      title: "Clients",
      route: "/clients",
      priority: 2,
      isPinned: false,
      badge: "234"
    },
    {
      id: 'warehouse',
      icon: "📦",
      title: "Warehouse",
      route: "/warehouse",
      expandable: true,
      priority: 3,
      isPinned: false,
      badge: "3"
    },
    {
      id: 'ledger',
      icon: "📋",
      title: "General ledger",
      route: "/chart-of-accounts",
      priority: 4,
      isPinned: false,
      badge: null
    },
    {
      id: 'cashier',
      icon: "💰",
      title: "Cashier",
      route: "/banking",
      expandable: true,
      priority: 5,
      isPinned: false,
      badge: "2"
    },
    {
      id: 'purchases',
      icon: "🛒",
      title: "Purchases",
      route: "/purchases",
      priority: 6,
      isPinned: false,
      badge: "5"
    },
    {
      id: 'sales',
      icon: "💰",
      title: "Sales",
      route: "/sales",
      priority: 7,
      isPinned: false,
      badge: "12"
    },
    {
      id: 'products',
      icon: "📦",
      title: "Products",
      route: "/products",
      priority: 8,
      isPinned: false,
      badge: null
    },
    {
      id: 'reports',
      icon: "📊",
      title: "Reports",
      route: "/reports",
      priority: 9,
      isPinned: false,
      badge: null
    },
    {
      id: 'settings',
      icon: "⚙️",
      title: "Settings",
      route: "/settings",
      priority: 10,
      isPinned: true, // Всегда последний
      badge: null
    }
  ]);

  // 📱 DRAG & DROP STATE
  const [draggedItem, setDraggedItem] = useState<SidebarItem | null>(null);
  const [dragOverItem, setDragOverItem] = useState<SidebarItem | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // SUBMENU STATE
  const [expandedMenus, setExpandedMenus] = useState<SubmenuState>({
    warehouse: location.pathname.includes('/warehouse'),
    cashier: location.pathname.includes('/banking'),
  });

  // 💾 ЗАГРУЗКА СОХРАНЁННЫХ ПРИОРИТЕТОВ
  useEffect(() => {
    const savedPriorities = localStorage.getItem('companySidebarPriorities');
    if (savedPriorities) {
      try {
        const priorities = JSON.parse(savedPriorities);
        setSidebarItems(prevItems => 
          prevItems.map(item => ({
            ...item,
            priority: priorities[item.id] || item.priority
          }))
        );
      } catch (error) {
        console.error('Error loading sidebar priorities:', error);
      }
    }
  }, []);

  // 💾 СОХРАНЕНИЕ ПРИОРИТЕТОВ
  const savePriorities = (items: SidebarItem[]) => {
    const priorities: { [key: string]: number } = {};
    items.forEach(item => {
      priorities[item.id] = item.priority;
    });
    localStorage.setItem('companySidebarPriorities', JSON.stringify(priorities));
  };

  // 📱 DRAG & DROP ОБРАБОТЧИКИ
  const handleDragStart = (e: React.DragEvent, item: SidebarItem) => {
    if (item.isPinned) return; // Нельзя перетаскивать закреплённые
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
    
    if (!draggedItem || draggedItem.id === targetItem.id || targetItem.isPinned) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const newItems = [...sidebarItems];
    const draggedIndex = newItems.findIndex(item => item.id === draggedItem.id);
    const targetIndex = newItems.findIndex(item => item.id === targetItem.id);

    // Удаляем перетаскиваемый элемент
    const [draggedMenuItem] = newItems.splice(draggedIndex, 1);
    
    // Вставляем в новую позицию
    newItems.splice(targetIndex, 0, draggedMenuItem);

    // Пересчитываем приоритеты (исключая закреплённые)
    const nonPinnedItems = newItems.filter(item => !item.isPinned);
    
    // Устанавливаем новые приоритеты
    const updatedItems = newItems.map((item) => {
      if (item.isPinned) {
        return item; // Оставляем приоритеты закреплённых как есть
      } else {
        const nonPinnedIndex = nonPinnedItems.findIndex(npi => npi.id === item.id);
        return {
          ...item,
          priority: nonPinnedIndex + 2 // +2 потому что Dashboard = 1
        };
      }
    });

    setSidebarItems(updatedItems);
    savePriorities(updatedItems);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  // SUBMENU TOGGLE
  const toggleSubmenu = (menuKey: keyof SubmenuState) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  // ОБРАБОТЧИК КЛИКА ПО ЭЛЕМЕНТУ
  const handleItemClick = (item: SidebarItem) => {
    if (item.expandable) {
      const menuKey = item.id as keyof SubmenuState;
      if (menuKey in expandedMenus) {
        toggleSubmenu(menuKey);
      }
    } else {
      navigate(item.route);
    }
  };

  // HANDLE BACK TO COMPANIES
  const handleBackToCompanies = () => {
    localStorage.removeItem('currentCompanyId');
    localStorage.removeItem('currentCompanyName');
    navigate('/account/dashboard');
  };

  // СОРТИРОВКА ПО ПРИОРИТЕТАМ
  const sortedItems = [...sidebarItems].sort((a, b) => a.priority - b.priority);

  // ОБЩИЙ СТИЛЬ ДЛЯ ССЫЛОК
  const getLinkClass = (item: SidebarItem, isActive: boolean) => {
    const baseClass = "flex items-center p-3 transition-all duration-200 cursor-pointer group relative";
    const activeClass = isActive ? 'bg-[#165468] text-white' : 'text-white hover:bg-[#165468]';
    const dragClass = draggedItem?.id === item.id ? 'opacity-50 scale-95' : '';
    const dragOverClass = dragOverItem?.id === item.id ? 'bg-blue-500 bg-opacity-20 border-l-4 border-blue-400' : '';
    
    return `${baseClass} ${activeClass} ${dragClass} ${dragOverClass}`.trim();
  };

  return (
    <div className="w-64 h-screen bg-[#0f3c4c] text-white flex flex-col">
      {/* ЛОГОТИП - ССЫЛКА НА ВЫБОР КОМПАНИИ */}
      <NavLink
        to="/account/dashboard"
        className="block p-4 text-2xl font-bold bg-[#0a2e3b] cursor-pointer hover:opacity-90 transition-opacity text-white no-underline"
        title="Go to company selection"
      >
        Solar
      </NavLink>

      {/* COLLAPSE TOGGLE */}
      <div className="p-2 border-b border-[#165468]">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 hover:bg-[#165468] rounded transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft 
            className={`h-4 w-4 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} 
          />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="p-0 m-0 list-none">
          {sortedItems.map((item) => {
            const isActive = location.pathname === item.route || 
                           (item.route !== '/dashboard' && location.pathname.startsWith(item.route));
            
            return (
              <li key={item.id} className="relative">
                <div
                  className={getLinkClass(item, isActive)}
                  draggable={!item.isPinned}
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragOver={(e) => handleDragOver(e, item)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, item)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleItemClick(item)}
                >
                  {/* DRAG HANDLE */}
                  {!item.isPinned && (
                    <GripVertical 
                      className="h-4 w-4 mr-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing" 
                    />
                  )}
                  
                  {/* PIN INDICATOR */}
                  {item.isPinned && (
                    <Star className="h-4 w-4 mr-2 text-yellow-400" fill="currentColor" />
                  )}
                  
                  {/* PRIORITY NUMBER */}
                  <span className="text-xs text-gray-300 mr-2 min-w-[1.5rem] text-center">
                    #{item.priority}
                  </span>

                  {/* ICON */}
                  <span className="mr-3">{item.icon}</span>

                  {/* TITLE */}
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.title}</span>
                      
                      {/* BADGE */}
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2 min-w-[1.5rem] text-center">
                          {item.badge}
                        </span>
                      )}
                      
                      {/* EXPANDABLE ARROW */}
                      {item.expandable && (
                        <ChevronDown 
                          className={`h-4 w-4 ml-2 transition-transform duration-200 ${
                            expandedMenus[item.id as keyof SubmenuState] ? 'rotate-180' : ''
                          }`} 
                        />
                      )}
                    </>
                  )}
                </div>

                {/* SUBMENU */}
                {item.expandable && expandedMenus[item.id as keyof SubmenuState] && !isCollapsed && (
                  <ul className="bg-[#0a2e3b] border-l-2 border-[#165468] ml-4">
                    {item.id === 'warehouse' && (
                      <>
                        <li>
                          <NavLink
                            to="/warehouse/inventory"
                            className={({ isActive }) => 
                              `flex items-center p-2 pl-8 text-sm transition-colors ${
                                isActive ? 'bg-[#165468] text-white' : 'text-gray-300 hover:bg-[#165468] hover:text-white'
                              }`
                            }
                          >
                            📦 Inventory
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/warehouse/locations"
                            className={({ isActive }) => 
                              `flex items-center p-2 pl-8 text-sm transition-colors ${
                                isActive ? 'bg-[#165468] text-white' : 'text-gray-300 hover:bg-[#165468] hover:text-white'
                              }`
                            }
                          >
                            📍 Locations
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/warehouse/batches"
                            className={({ isActive }) => 
                              `flex items-center p-2 pl-8 text-sm transition-colors ${
                                isActive ? 'bg-[#165468] text-white' : 'text-gray-300 hover:bg-[#165468] hover:text-white'
                              }`
                            }
                          >
                            🏷️ Batches
                          </NavLink>
                        </li>
                      </>
                    )}
                    
                    {item.id === 'cashier' && (
                      <>
                        <li>
                          <NavLink
                            to="/banking/accounts"
                            className={({ isActive }) => 
                              `flex items-center p-2 pl-8 text-sm transition-colors ${
                                isActive ? 'bg-[#165468] text-white' : 'text-gray-300 hover:bg-[#165468] hover:text-white'
                              }`
                            }
                          >
                            🏦 Bank Accounts
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/banking/transactions"
                            className={({ isActive }) => 
                              `flex items-center p-2 pl-8 text-sm transition-colors ${
                                isActive ? 'bg-[#165468] text-white' : 'text-gray-300 hover:bg-[#165468] hover:text-white'
                              }`
                            }
                          >
                            💰 Transactions
                          </NavLink>
                        </li>
                      </>
                    )}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Back to Companies внизу */}
      <div className="border-t border-[#165468] mt-auto">
        <button 
          onClick={handleBackToCompanies}
          className="w-full flex items-center p-3 hover:bg-[#165468] transition-colors text-left"
        >
          <span className="mr-3">🚪</span>
          {!isCollapsed && <span>Back to Companies</span>}
        </button>
      </div>
    </div>
  );
};

export default CompanySidebar;
EOF

echo "✅ Enhanced Company Sidebar installed!"
echo ""
echo "🎯 Features added:"
echo "   📱 iPhone-style drag & drop"
echo "   🔢 Priority numbers #1, #2, #3..."
echo "   📌 Smart pinning (Dashboard & Settings)"
echo "   🎨 Visual feedback during drag"
echo "   💾 Persistent settings in localStorage"
echo "   📊 Badges for notifications"
echo ""
echo "🚀 Restart frontend to see changes:"
echo "   cd f && npm run dev"