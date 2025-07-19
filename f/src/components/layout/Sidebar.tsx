import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FaUsers, FaChartBar, FaBars, FaLayerGroup } from 'react-icons/fa';

interface SubmenuState {
  warehouse: boolean;
  cashier: boolean;
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [expandedMenus, setExpandedMenus] = useState<SubmenuState>({
    warehouse: location.pathname.includes('/warehouse'),
    cashier: location.pathname.includes('/cashier'),
  });

  const toggleSubmenu = (menu: keyof SubmenuState) => {
    setExpandedMenus({
      ...expandedMenus,
      [menu]: !expandedMenus[menu],
    });
  };

  // Общий стиль для активных и неактивных ссылок
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-3 hover:bg-[#165468] transition-colors ${
      isActive ? 'bg-[#165468]' : ''
    }`;

  // Стиль для подменю
  const submenuLinkClass = ({ isActive }: { isActive: boolean }) =>
    `pl-10 pr-3 py-2 block hover:bg-[#165468] ${
      isActive ? 'bg-[#165468]' : ''
    }`;

  return (
    <div className="w-64 h-screen bg-[#0f3c4c] text-white flex flex-col">
      {/* ЛОГОТИП - ССЫЛКА НА ВЫБОР КОМПАНИИ */}
      <NavLink
        to="/"
        className="block p-4 text-2xl font-bold bg-[#0a2e3b] cursor-pointer hover:opacity-90 transition-opacity text-white no-underline"
        title="Go to company selection"
      >
        Solar
      </NavLink>

      <nav className="flex-1 overflow-y-auto">
        <ul className="p-0 m-0 list-none">
          <li>
            <NavLink to="dashboard" className={linkClass}>
              <FaChartBar className="mr-3" />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="clients" className={linkClass}>
              <FaUsers className="mr-3" />
              <span>Clients</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
