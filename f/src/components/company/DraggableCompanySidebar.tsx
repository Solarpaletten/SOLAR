import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  Package, 
  ShoppingCart, 
  ShoppingBag, 
  Warehouse,
  Calculator,
  CreditCard,
  BarChart3,
  Settings,
  GripVertical,
  Star,
  ChevronLeft,
  Building2
} from 'lucide-react';

const DraggableCompanySidebar = () => {
  const [sidebarItems, setSidebarItems] = useState([
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: Home,
      priority: 1,
      isActive: true,
      isPinned: true, // Всегда первый
      badge: null
    },
    {
      id: 'sales',
      name: 'Sales',
      icon: ShoppingCart,
      priority: 2,
      isActive: false,
      isPinned: false,
      badge: '12'
    },
    {
      id: 'purchases',
      name: 'Purchases', 
      icon: ShoppingBag,
      priority: 3,
      isActive: false,
      isPinned: false,
      badge: '5'
    },
    {
      id: 'inventory',
      name: 'Inventory',
      icon: Package,
      priority: 4,
      isActive: false,
      isPinned: false,
      badge: '847'
    },
    {
      id: 'clients',
      name: 'Clients',
      icon: Users,
      priority: 5,
      isActive: false,
      isPinned: false,
      badge: '234'
    },
    {
      id: 'warehouses',
      name: 'Warehouses',
      icon: Warehouse,
      priority: 6,
      isActive: false,
      isPinned: false,
      badge: '3'
    },
    {
      id: 'accounting',
      name: 'Accounting',
      icon: Calculator,
      priority: 7,
      isActive: false,
      isPinned: false,
      badge: null
    },
    {
      id: 'banking',
      name: 'Banking',
      icon: CreditCard,
      priority: 8,
      isActive: false,
      isPinned: false,
      badge: '2'
    },
    {
      id: 'reports',
      name: 'Reports',
      icon: BarChart3,
      priority: 9,
      isActive: false,
      isPinned: false,
      badge: null
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: Settings,
      priority: 10,
      isActive: false,
      isPinned: true, // Всегда последний
      badge: null
    }
  ]);

  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleDragStart = (e, item) => {
    if (item.isPinned) return; // Нельзя перетаскивать закреплённые
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, item) => {
    e.preventDefault();
    if (item.isPinned || draggedItem?.isPinned) return;
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(item);
  };

  const handleDrop = (e, targetItem) => {
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

    // Обновляем приоритеты только для непин्नed элементов
    let priority = 1;
    const updatedItems = newItems.map((item) => {
      if (item.isPinned) {
        if (item.id === 'dashboard') return { ...item, priority: 1 };
        if (item.id === 'settings') return { ...item, priority: 999 };
        return item;
      }
      return { ...item, priority: ++priority };
    });

    setSidebarItems(updatedItems);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleItemClick = (clickedItem) => {
    setSidebarItems(items => 
      items.map(item => ({
        ...item,
        isActive: item.id === clickedItem.id
      }))
    );
  };

  const sortedItems = [...sidebarItems].sort((a, b) => {
    if (a.id === 'dashboard') return -1;
    if (b.id === 'dashboard') return 1;
    if (a.id === 'settings') return 1;
    if (b.id === 'settings') return -1;
    return a.priority - b.priority;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <Building2 className="w-8 h-8 text-blue-600" />
                <div>
                  <h2 className="font-bold text-gray-800">SWAPOIL GMBH</h2>
                  <p className="text-xs text-gray-500">Company Dashboard</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className={`w-5 h-5 text-gray-600 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Priority Info */}
        {!isCollapsed && (
          <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
            <div className="text-xs text-gray-600 mb-1">📱 Drag & Drop Priority</div>
            <div className="text-xs text-blue-600">Customize your workflow order</div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 p-2 space-y-1">
          {sortedItems.map((item, index) => {
            const Icon = item.icon;
            const isDraggable = !item.isPinned;
            const isBeingDragged = draggedItem?.id === item.id;
            const isDraggedOver = dragOverItem?.id === item.id;

            return (
              <div
                key={item.id}
                draggable={isDraggable}
                onDragStart={(e) => handleDragStart(e, item)}
                onDragOver={(e) => handleDragOver(e, item)}
                onDrop={(e) => handleDrop(e, item)}
                onDragEnd={() => {
                  setDraggedItem(null);
                  setDragOverItem(null);
                }}
                onClick={() => handleItemClick(item)}
                className={`
                  group flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-200
                  ${item.isActive 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                  ${isBeingDragged ? 'opacity-50 scale-95' : ''}
                  ${isDraggedOver ? 'ring-2 ring-blue-400 scale-105' : ''}
                  ${isDraggable ? 'cursor-move' : 'cursor-pointer'}
                `}
              >
                {/* Priority Number & Drag Handle */}
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  {!isCollapsed && (
                    <div className="flex items-center space-x-2">
                      {isDraggable && (
                        <GripVertical className={`w-4 h-4 ${item.isActive ? 'text-white' : 'text-gray-400'} group-hover:text-gray-600`} />
                      )}
                      {item.isPinned && (
                        <Star className={`w-4 h-4 ${item.isActive ? 'text-white' : 'text-yellow-500'}`} />
                      )}
                      <div className={`text-xs px-1.5 py-0.5 rounded ${
                        item.isActive ? 'bg-blue-400 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {item.isPinned ? (item.id === 'dashboard' ? '📌' : '⚙️') : `#${item.priority}`}
                      </div>
                    </div>
                  )}
                  
                  <Icon className={`w-5 h-5 ${item.isActive ? 'text-white' : 'text-gray-500'} group-hover:text-gray-700`} />
                  
                  {!isCollapsed && (
                    <span className={`font-medium ${item.isActive ? 'text-white' : 'text-gray-700'} truncate`}>
                      {item.name}
                    </span>
                  )}
                </div>

                {/* Badge */}
                {!isCollapsed && item.badge && (
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.isActive 
                      ? 'bg-white text-blue-500' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {item.badge}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Instructions */}
        {!isCollapsed && (
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex items-center space-x-1">
                <GripVertical className="w-3 h-3" />
                <span>Drag to reorder</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span>Pinned items</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              🏆 Приоритеты модулей для IT бухгалтерии
            </h1>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  💡 Концепция персонализации
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>✨ <strong>Каждый клиент</strong> может настроить приоритеты под свой бизнес</p>
                  <p>📊 <strong>Торговая компания:</strong> Sales → Purchases → Inventory</p>
                  <p>🏭 <strong>Производство:</strong> Inventory → Purchases → Sales</p>
                  <p>📋 <strong>Услуги:</strong> Clients → Accounting → Reports</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  🎯 Умные функции
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <p>📌 <strong>Закреплённые:</strong> Dashboard (верх), Settings (низ)</p>
                    <p>🔢 <strong>Нумерация:</strong> Автоматические приоритеты #1, #2, #3...</p>
                  </div>
                  <div>
                    <p>📱 <strong>Drag & Drop:</strong> Как на iPhone</p>
                    <p>💾 <strong>Сохранение:</strong> Настройки для каждой компании</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  🚀 Для IT бухгалтерии это означает:
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>⚡ <strong>Быстрый доступ</strong> к важным модулям</p>
                  <p>🎨 <strong>Персонализация</strong> интерфейса под задачи</p>
                  <p>📈 <strong>Повышение эффективности</strong> работы</p>
                  <p>💼 <strong>Разные настройки</strong> для разных компаний</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraggableCompanySidebar;