import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SidebarItem {
  icon: string;
  title: string;
  route: string;
  expandable?: boolean;
}

interface SubmenuState {
  warehouse: boolean;
  banking: boolean;
  purchases: boolean;
  sales: boolean;
}

const CompanySidebar: React.FC = () => {
  const location = useLocation();
  
  // 🎯 ТОЛЬКО РЕАЛЬНЫЕ МАРШРУТЫ - НЕТ MOCK ДАННЫХ
  const sidebarItems: SidebarItem[] = [
    { icon: "📊", title: "Dashboard", route: "/dashboard" },
    { icon: "👥", title: "Clients", route: "/clients" },
    { icon: "📦", title: "Products", route: "/products" },
    { icon: "💰", title: "Sales", route: "/sales", expandable: true },
    { icon: "🛒", title: "Purchases", route: "/purchases", expandable: true },
    { icon: "🏭", title: "Warehouse", route: "/warehouse", expandable: true },
    { icon: "📋", title: "Chart of Accounts", route: "/chart-of-accounts" },
    { icon: "🏦", title: "Banking", route: "/banking", expandable: true },
    { icon: "⚡", title: "TAB-Бухгалтерия", route: "/tabbook" },
    { icon: "☁️", title: "Cloud IDE", route: "/cloudide" },
    { icon: "⚙️", title: "Settings", route: "/settings" }
  ];

  const [expandedMenus, setExpandedMenus] = useState<SubmenuState>({
    warehouse: location.pathname.includes('/warehouse'),
    banking: location.pathname.includes('/banking'),
    purchases: location.pathname.includes('/purchases'),
    sales: location.pathname.includes('/sales')
  });

  const toggleMenu = (itemId: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [itemId]: !prev[itemId as keyof SubmenuState]
    }));
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-3 hover:bg-slate-700 transition-colors ${
      isActive ? 'bg-slate-700 border-r-2 border-orange-500' : ''
    }`;

  return (
    <div className="w-64 bg-slate-800 text-white flex-shrink-0 h-full flex flex-col">
      {/* Header - ссылка на выбор компаний */}
      <div className="p-4">
        <NavLink
          to="/account/dashboard"
          className="text-lg font-bold text-white no-underline hover:opacity-90 transition-opacity"
          title="Go to company selection"
        >
          Solar
        </NavLink>
      </div>

      {/* Navigation - чистые routes без mock данных */}
      <nav className="flex-1 overflow-y-auto">
        {sidebarItems.map((item) => (
          <div key={item.route}>
            {/* Основной пункт меню */}
            <NavLink
              to={item.route}
              className={linkClass}
              onClick={(e) => {
                if (item.expandable) {
                  e.preventDefault();
                  toggleMenu(item.title.toLowerCase());
                }
              }}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="flex-1">{item.title}</span>
              {item.expandable && (
                <span className="ml-2">
                  {expandedMenus[item.title.toLowerCase() as keyof SubmenuState] ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </span>
              )}
            </NavLink>

            {/* Submenu для expandable пунктов */}
            {item.expandable && expandedMenus[item.title.toLowerCase() as keyof SubmenuState] && (
              <div className="bg-slate-900 border-l-2 border-slate-600">
                <div className="pl-8 py-2">
                  <div className="text-slate-400 text-sm">
                    {item.title} модуль готов к работе
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer - возврат к компаниям */}
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
