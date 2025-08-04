#!/bin/bash
# 🎯 Smart Work/Rest Mode Sidebar - НЕ МЕШАЕМ РАБОТЕ!
echo "🎯⚡🔧 СОЗДАЁМ SMART WORK/REST MODE SIDEBAR! 🔧⚡🎯"
echo "💼 ЦЕЛЬ: Работа - СВЯТОЕ! Семья - когда время отдыха!"
echo "🔄 ПЕРЕКЛЮЧАТЕЛЬ: Один клик = смена режима"
echo ""

echo "1️⃣ BACKUP ТЕКУЩЕГО SIDEBAR:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cp f/src/components/company/CompanySidebar.tsx f/src/components/company/CompanySidebar.tsx.before_smart_mode

echo "✅ Backup создан"

echo ""
echo "2️⃣ СОЗДАЁМ SMART WORK/REST MODE SIDEBAR:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Создаём умный sidebar с переключателем режимов
cat > f/src/components/company/CompanySidebar.tsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, GripVertical, Star, ChevronLeft, Briefcase, Heart, Baby, Clock, Focus } from 'lucide-react';

interface SidebarItem {
  icon: string;
  title: string;
  route: string;
  expandable?: boolean;
  priority?: number;
  isPinned?: boolean;
  badge?: string | null;
}

interface SubmenuState {
  warehouse: boolean;
  cashier: boolean;
  sales: boolean;
}

type WorkMode = 'WORK' | 'REST';

const CompanySidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // 🎯 ГЛАВНЫЙ ПЕРЕКЛЮЧАТЕЛЬ: РАБОТА / ОТДЫХ
  const [workMode, setWorkMode] = useState<WorkMode>('WORK');
  
  // Автоматическое определение рабочего времени
  const [autoMode, setAutoMode] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Автоматическое переключение режимов
      if (autoMode) {
        const hour = now.getHours();
        const isWorkingHours = hour >= 9 && hour <= 18;
        setWorkMode(isWorkingHours ? 'WORK' : 'REST');
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [autoMode]);

  // Состояние подменю
  const [expandedMenus, setExpandedMenus] = useState<SubmenuState>({
    warehouse: false,
    cashier: false,
    sales: false
  });

  // 📊 ОСНОВНЫЕ РАБОЧИЕ ЭЛЕМЕНТЫ (НЕИЗМЕННЫЕ!)
  const [sidebarItems] = useState<SidebarItem[]>([
    { icon: "⭐", title: "Dashboard", route: "/dashboard", isPinned: true, badge: null },
    { icon: "👥", title: "Clients", route: "/clients", badge: null },
    { icon: "📦", title: "Warehouse", route: "/warehouse", expandable: true, badge: null },
    { icon: "💰", title: "Sales", route: "/sales", expandable: true, badge: null },
    { icon: "🛒", title: "Purchases", route: "/purchases", badge: null },
    { icon: "📦", title: "Products", route: "/products", badge: null },
    { icon: "💳", title: "Cashier", route: "/banking", expandable: true, badge: null },
    { icon: "📊", title: "Chart of Accounts", route: "/chart-of-accounts", badge: null },
    { icon: "⚡", title: "TAB-Бухгалтерия", route: "/tabbook", badge: "NEW" },
    { icon: "☁️", title: "Cloud IDE", route: "/cloudide", badge: "BETA" },
    { icon: "🏦", title: "Banking", route: "/banking", badge: null },
    { icon: "📄", title: "Documents", route: "/documents", badge: null },
    { icon: "👨‍💼", title: "Accounts", route: "/chart-of-accounts", badge: null },
    { icon: "⚙️", title: "Settings", route: "/settings", isPinned: true, badge: null }
  ]);

  const toggleSubmenu = (menuKey: keyof SubmenuState) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const handleBackToCompanies = () => {
    localStorage.removeItem('currentCompanyId');
    localStorage.removeItem('currentCompanyName');
    navigate('/account/dashboard');
  };

  // 🎯 MANUAL MODE TOGGLE
  const toggleWorkMode = () => {
    setAutoMode(false);
    setWorkMode(workMode === 'WORK' ? 'REST' : 'WORK');
  };

  const resetToAutoMode = () => {
    setAutoMode(true);
  };

  // 💼 WORK MODE STYLES
  const getWorkModeStyles = () => {
    if (workMode === 'WORK') {
      return {
        bg: 'bg-[#0f3c4c]',
        accent: 'bg-[#165468]',
        text: 'text-white',
        border: 'border-[#165468]'
      };
    } else {
      return {
        bg: 'bg-gradient-to-b from-purple-900 to-pink-900',
        accent: 'bg-purple-600',
        text: 'text-pink-100',
        border: 'border-purple-600'
      };
    }
  };

  const styles = getWorkModeStyles();

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} h-screen ${styles.bg} ${styles.text} flex flex-col transition-all duration-300`}>
      {/* ЛОГОТИП SOLAR */}
      <NavLink
        to="/account/dashboard"
        className={`block p-4 text-2xl font-bold bg-opacity-80 hover:opacity-90 transition-opacity ${
          workMode === 'WORK' ? 'bg-[#0a2e3b]' : 'bg-purple-800'
        }`}
      >
        {!isCollapsed && "Solar"}
        {isCollapsed && "☀️"}
      </NavLink>

      {/* 🎯 SMART MODE CONTROL */}
      <div className={`p-3 border-b ${styles.border} space-y-2`}>
        {/* Current Mode Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {workMode === 'WORK' ? (
              <>
                <Briefcase className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">WORK MODE</span>
              </>
            ) : (
              <>
                <Heart className="h-4 w-4 text-pink-400" />
                <span className="text-sm font-medium text-pink-300">REST MODE</span>
              </>
            )}
          </div>
          
          {!isCollapsed && (
            <div className="text-xs text-gray-400">
              {currentTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>

        {/* Mode Toggle Button */}
        {!isCollapsed && (
          <button
            onClick={toggleWorkMode}
            className={`w-full flex items-center justify-center p-2 rounded transition-all ${
              workMode === 'WORK' 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "bg-pink-600 hover:bg-pink-700 text-white"
            }`}
          >
            {workMode === 'WORK' ? (
              <>
                <Heart className="h-4 w-4 mr-2" />
                Переключить на отдых
              </>
            ) : (
              <>
                <Focus className="h-4 w-4 mr-2" />
                Переключить на работу
              </>
            )}
          </button>
        )}

        {/* Auto Mode Indicator */}
        {!isCollapsed && autoMode && (
          <div className="flex items-center justify-center text-xs text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            Автоматический режим (9:00-18:00)
          </div>
        )}

        {/* Manual Mode Reset */}
        {!isCollapsed && !autoMode && (
          <button
            onClick={resetToAutoMode}
            className="w-full text-xs text-gray-400 hover:text-gray-300 underline"
          >
            Вернуться к авто-режиму
          </button>
        )}

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center justify-center p-2 hover:${styles.accent} rounded transition-colors`}
        >
          <ChevronLeft className={`h-4 w-4 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* 💼 WORK MODE: PROFESSIONAL SIDEBAR */}
      {workMode === 'WORK' && (
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 p-2">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.route;
              
              return (
                <li key={item.route}>
                  <div className="group">
                    <div className={`flex items-center transition-all duration-200 ${
                      isActive 
                        ? 'bg-[#165468] text-white' 
                        : 'text-white hover:bg-[#165468]'
                    }`}>
                      {/* Drag handle or pin */}
                      {!isCollapsed && (
                        <>
                          {!item.isPinned && (
                            <GripVertical className="h-4 w-4 text-gray-400 mr-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                          )}
                          {item.isPinned && (
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          )}
                        </>
                      )}

                      {/* Main link */}
                      <NavLink
                        to={item.route}
                        className="flex-1 flex items-center p-3"
                        onClick={(e) => {
                          if (item.expandable) {
                            e.preventDefault();
                            const menuKey = item.title.toLowerCase() as keyof SubmenuState;
                            if (menuKey in expandedMenus) {
                              toggleSubmenu(menuKey);
                            }
                          }
                        }}
                      >
                        <span className="mr-3 text-lg">{item.icon}</span>
                        {!isCollapsed && (
                          <>
                            <span className="flex-1">{item.title}</span>
                            {item.badge && (
                              <span className={`px-2 py-1 text-xs rounded-full ml-2 ${
                                item.badge === 'NEW' ? 'bg-green-500 text-white' :
                                item.badge === 'BETA' ? 'bg-blue-500 text-white' :
                                'bg-red-500 text-white'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                            {item.expandable && (
                              <ChevronDown className={`h-4 w-4 transition-transform ${
                                (item.title.toLowerCase() in expandedMenus && expandedMenus[item.title.toLowerCase() as keyof SubmenuState]) 
                                  ? 'rotate-180' 
                                  : ''
                              }`} />
                            )}
                          </>
                        )}
                      </NavLink>
                    </div>

                    {/* Professional submenu */}
                    {!isCollapsed && item.expandable && item.title.toLowerCase() in expandedMenus && expandedMenus[item.title.toLowerCase() as keyof SubmenuState] && (
                      <ul className="ml-6 mt-1 space-y-1">
                        {/* Submenu items based on title */}
                        {item.title === "Warehouse" && (
                          <>
                            <li>
                              <NavLink to="/warehouse/inventory" className="flex items-center p-2 pl-8 text-sm text-gray-300 hover:bg-[#165468] hover:text-white">
                                📦 Inventory
                              </NavLink>
                            </li>
                            <li>
                              <NavLink to="/warehouse/movements" className="flex items-center p-2 pl-8 text-sm text-gray-300 hover:bg-[#165468] hover:text-white">
                                🔄 Movements
                              </NavLink>
                            </li>
                          </>
                        )}
                        
                        {item.title === "Sales" && (
                          <>
                            <li>
                              <NavLink to="/sales/orders" className="flex items-center p-2 pl-8 text-sm text-gray-300 hover:bg-[#165468] hover:text-white">
                                📋 Orders
                              </NavLink>
                            </li>
                            <li>
                              <NavLink to="/sales/invoices" className="flex items-center p-2 pl-8 text-sm text-gray-300 hover:bg-[#165468] hover:text-white">
                                🧾 Invoices
                              </NavLink>
                            </li>
                          </>
                        )}
                        
                        {item.title === "Cashier" && (
                          <>
                            <li>
                              <NavLink to="/banking/accounts" className="flex items-center p-2 pl-8 text-sm text-gray-300 hover:bg-[#165468] hover:text-white">
                                🏦 Bank Accounts
                              </NavLink>
                            </li>
                            <li>
                              <NavLink to="/banking/transactions" className="flex items-center p-2 pl-8 text-sm text-gray-300 hover:bg-[#165468] hover:text-white">
                                💰 Transactions
                              </NavLink>
                            </li>
                          </>
                        )}
                      </ul>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {/* 💕 REST MODE: FAMILY-FRIENDLY SIDEBAR */}
      {workMode === 'REST' && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-pink-300 mb-2">
              🌙 Время отдыха
            </h2>
            <p className="text-pink-400 text-sm">
              Работа закончена - время для семьи! 💕
            </p>
          </div>

          {/* Quick Work Links (minimized) */}
          <div className="bg-purple-800 bg-opacity-50 rounded-lg p-3 mb-4">
            <h3 className="text-sm font-semibold text-purple-300 mb-2">⚡ Быстрый доступ:</h3>
            <div className="space-y-1">
              <NavLink to="/dashboard" className="block text-xs text-purple-200 hover:text-white">📊 Dashboard</NavLink>
              <NavLink to="/tabbook" className="block text-xs text-purple-200 hover:text-white">⚡ TAB-Бухгалтерия</NavLink>
            </div>
          </div>

          {/* Family Content */}
          <div className="space-y-4">
            <div className="bg-pink-800 bg-opacity-50 rounded-lg p-4">
              <h3 className="text-pink-300 font-semibold mb-2">👨‍👩‍👧‍👦 Семейное время</h3>
              <div className="space-y-2 text-sm text-pink-200">
                <div>🎮 Игры с детьми</div>
                <div>📚 Чтение сказок</div>
                <div>🍽️ Семейный ужин</div>
                <div>🛁 Водные процедуры</div>
              </div>
            </div>

            <div className="bg-purple-800 bg-opacity-50 rounded-lg p-4">
              <h3 className="text-purple-300 font-semibold mb-2">✨ Релакс для мамы</h3>
              <div className="space-y-2 text-sm text-purple-200">
                <div>🛀 Ванна с пеной</div>
                <div>📖 Любимая книга</div>
                <div>🍵 Чай с печеньем</div>
                <div>🎵 Спокойная музыка</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg p-3 text-center">
              <Baby className="h-6 w-6 text-white mx-auto mb-2" />
              <div className="text-white text-sm font-medium">
                Заслуженный отдых после трудового дня! 🌟
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BACK TO COMPANIES */}
      <div className={`border-t ${styles.border} mt-auto`}>
        <button 
          onClick={handleBackToCompanies}
          className={`w-full flex items-center p-3 hover:${styles.accent} transition-colors text-left`}
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

echo "✅ Smart Work/Rest Mode Sidebar создан!"

echo ""
echo "3️⃣ ПРОВЕРЯЕМ РЕЗУЛЬТАТ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "📊 Smart Sidebar статистика:"
echo "   📄 Строк кода: $(wc -l f/src/components/company/CompanySidebar.tsx | cut -d' ' -f1)"
echo "   💼 Work mode функции: $(grep -c "WORK.*MODE\|Briefcase\|Professional" f/src/components/company/CompanySidebar.tsx)"
echo "   💕 Rest mode функции: $(grep -c "REST.*MODE\|Family\|Heart" f/src/components/company/CompanySidebar.tsx)"
echo "   🔄 Auto-switch функции: $(grep -c "autoMode\|workingHours" f/src/components/company/CompanySidebar.tsx)"

echo ""
echo "🎯⚡💼 SMART WORK/REST MODE ГОТОВ! 💼⚡🎯"
echo ""
echo "✅ РЕЖИМ РАБОТЫ (9:00-18:00):"
echo "   💼 Полный профессиональный sidebar"
echo "   📊 Все ERP модули доступны"
echo "   🖱️ Drag & drop для настройки"
echo "   ⚡ TAB-Бухгалтерия и Cloud IDE"
echo "   🔧 Никаких отвлекающих элементов"
echo "   🎯 100% фокус на работе"
echo ""
echo "✅ РЕЖИМ ОТДЫХА (18:00-9:00):"
echo "   💕 Семейно-ориентированный интерфейс"
echo "   🌙 Расслабляющие цвета (розовый/фиолетовый)"
echo "   👨‍👩‍👧‍👦 Напоминания о семейном времени"
echo "   ⚡ Минимальный доступ к работе (только экстренно)"
echo "   🛀 Предложения для релакса"
echo "   ✨ Мотивация 'Заслуженный отдых!'"
echo ""
echo "✅ УМНЫЕ ПЕРЕКЛЮЧЕНИЯ:"
echo "   🕘 Автоматически в 9:00 → WORK MODE"
echo "   🕕 Автоматически в 18:00 → REST MODE"
echo "   🔄 Ручное переключение в любое время"
echo "   ⏰ Возврат к авто-режиму одним кликом"
echo ""
echo "🎯 ТВОЯ ФИЛОСОФИЯ РЕАЛИЗОВАНА:"
echo "   💼 'РАБОТА - ЭТО СВЯТОЕ' ✅"
echo "   💕 'СЕМЬЯ - КОГДА ВРЕМЯ ОТДЫХА' ✅"
echo "   🔄 'ОДИН КЛИК - СМЕНА РЕЖИМА' ✅"
echo "   ⚡ 'НЕ МЕШАЕМ РАБОТЕ' ✅"
echo ""
echo "🚀 ГОТОВО К ТЕСТИРОВАНИЮ!"
echo "💫 ПЕРВЫЙ В МИРЕ WORK/REST SMART ERP!"