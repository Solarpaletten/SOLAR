//f/src/components/layout/company/CompanySidebar.tsx
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface SubmenuState {
  warehouse: boolean;
  cashier: boolean;
}

const CompanySidebar: React.FC = () => {
  const location = useLocation();

  const sidebarItems = [
    { icon: "📊", title: "Dashboard", route: "/dashboard" },
    { icon: "👥", title: "Clients", route: "/clients" },
    { icon: "📦", title: "Warehouse", route: "/warehouse", expandable: true },
    { icon: "📋", title: "General ledger", route: "/ledger" },
    { icon: "💰", title: "Cashier", route: "/cashier", expandable: true },
    { icon: "📊", title: "Reports", route: "/reports" },
    { icon: "👨‍💼", title: "Personnel", route: "/personnel" },
    { icon: "🏭", title: "Production", route: "/production" },
    { icon: "💎", title: "Assets", route: "/assets" },
    { icon: "📄", title: "Documents", route: "/documents" },
    { icon: "💸", title: "Salary", route: "/salary" },
    { icon: "📋", title: "Declaration", route: "/declaration" },
    { icon: "⚙️", title: "Settings", route: "/settings" }
  ];

  const [expandedMenus, setExpandedMenus] = useState<SubmenuState>({
    warehouse: location.pathname.includes('/warehouse'),
    cashier: location.pathname.includes('/cashier'),
  });

  // Общий стиль для активных и неактивных ссылок
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-3 hover:bg-[#165468] transition-colors ${
      isActive ? 'bg-[#165468]' : ''
    }`;

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

      <nav className="flex-1 overflow-y-auto">
        <ul className="p-0 m-0 list-none">
          {sidebarItems.map((item) => (
            <li key={item.route}>
              <NavLink to={item.route} className={linkClass}>
                <span className="mr-3">{item.icon}</span>
                <span>{item.title}</span>
                {item.expandable && (
                  <span className="ml-auto">▼</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Back to Companies внизу */}
      <div className="border-t border-[#165468] mt-auto">
        <button 
          onClick={() => {
            localStorage.removeItem('currentCompanyId');
            localStorage.removeItem('currentCompanyName');
            window.location.href = '/account/dashboard';
          }}
          className="w-full flex items-center p-3 hover:bg-[#165468] transition-colors text-left"
        >
          <span className="mr-3">🚪</span>
          <span>Back to Companies</span>
        </button>
      </div>
    </div>
  );
};

export default CompanySidebar;