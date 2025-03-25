import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  FaUsers,
  FaWarehouse,
  FaChartBar,
  FaBook,
  FaCashRegister,
  FaFileAlt,
  FaUserTie,
  FaIndustry,
  FaCoins,
  FaFileInvoice,
  FaMoneyBillWave,
  FaDatabase,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight,
  FaGlobe
} from 'react-icons/fa';

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth/login');
  };

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
      <div className="p-4 text-2xl font-bold bg-[#0a2e3b]">Solar</div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="p-0 m-0 list-none">
          <li>
            <NavLink to="/clients" className={linkClass}>
              <FaUsers className="mr-3" />
              <span>Clients</span>
            </NavLink>
          </li>

          <li>
            <div
              className={`flex items-center justify-between p-3 hover:bg-[#165468] cursor-pointer transition-colors ${
                expandedMenus.warehouse || location.pathname.startsWith('/warehouse') ? 'bg-[#165468]' : ''
              }`}
              onClick={() => toggleSubmenu('warehouse')}
            >
              <div className="flex items-center">
                <FaWarehouse className="mr-3" />
                <span>Warehouse</span>
              </div>
              {expandedMenus.warehouse ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
            </div>
            {expandedMenus.warehouse && (
              <ul className="bg-[#0a2e3b] py-1">
                <li><NavLink to="/warehouse/sales" className={submenuLinkClass}>Sales</NavLink></li>
                <li><NavLink to="/warehouse/client-prices" className={submenuLinkClass}>Client prices</NavLink></li>
                <li><NavLink to="/warehouse/automatic-invoicing" className={submenuLinkClass}>Automatic invoicing</NavLink></li>
                <li><NavLink to="/warehouse/purchases" className={submenuLinkClass}>Purchases</NavLink></li>
                <li><NavLink to="/warehouse/sales-returns" className={submenuLinkClass}>Sales returns</NavLink></li>
                <li><NavLink to="/warehouse/remaining-items" className={submenuLinkClass}>Remaining items</NavLink></li>
                <li><NavLink to="/warehouse/item-movement" className={submenuLinkClass}>Item movement</NavLink></li>
                <li><NavLink to="/warehouse/consignment-balance" className={submenuLinkClass}>Consignment balance</NavLink></li>
                <li><NavLink to="/warehouse/stock-taking" className={submenuLinkClass}>Stock-taking</NavLink></li>
                <li><NavLink to="/warehouse/revaluation" className={submenuLinkClass}>Revaluation</NavLink></li>
                <li><NavLink to="/warehouse/internal-movement-confirmation" className={submenuLinkClass}>Internal movement confirmation</NavLink></li>
                <li><NavLink to="/warehouse/e-commerce" className={submenuLinkClass}>E-commerce</NavLink></li>
                <li><NavLink to="/warehouse/cash-register-sales" className={submenuLinkClass}>Cash register sales</NavLink></li>
              </ul>
            )}
          </li>

          <li>
            <NavLink to="/solar" className={linkClass}>
              <FaGlobe className="mr-3" />
              <span>SOLAR Ассистент</span>
            </NavLink>
          </li>
            
          <li>
            <NavLink to="/dashboard" className={linkClass}>
              <FaChartBar className="mr-3" />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/general-ledger" className={linkClass}>
              <FaBook className="mr-3" />
              <span>General ledger</span>
            </NavLink>
          </li>

          <li>
            <div
              className={`flex items-center justify-between p-3 hover:bg-[#165468] cursor-pointer transition-colors ${
                expandedMenus.cashier || location.pathname.startsWith('/cashier') ? 'bg-[#165468]' : ''
              }`}
              onClick={() => toggleSubmenu('cashier')}
            >
              <div className="flex items-center">
                <FaCashRegister className="mr-3" />
                <span>Cashier</span>
              </div>
              {expandedMenus.cashier ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
            </div>
            {expandedMenus.cashier && (
              <ul className="bg-[#0a2e3b] py-1">
                <li>
                  <NavLink to="/cashier/transactions" className={submenuLinkClass}>
                    Transactions
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/cashier/receipts" className={submenuLinkClass}>
                    Receipts
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          <li>
            <NavLink to="/reports" className={linkClass}>
              <FaFileAlt className="mr-3" />
              <span>Reports</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/personnel" className={linkClass}>
              <FaUserTie className="mr-3" />
              <span>Personnel</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/production" className={linkClass}>
              <FaIndustry className="mr-3" />
              <span>Production</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/assets" className={linkClass}>
              <FaCoins className="mr-3" />
              <span>Assets</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/documents" className={linkClass}>
              <FaFileInvoice className="mr-3" />
              <span>Documents</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/salary" className={linkClass}>
              <FaMoneyBillWave className="mr-3" />
              <span>Salary</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/declaration" className={linkClass}>
              <FaFileAlt className="mr-3" />
              <span>Declaration</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="p-3 border-t border-[#165468]">
        <ul className="p-0 m-0 list-none">
          <li>
            <NavLink to="/admin" className={linkClass}>
              <FaDatabase className="mr-3" />
              <span>Admin Panel</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/settings" className={linkClass}>
              <FaCog className="mr-3" />
              <span>Settings</span>
            </NavLink>
          </li>

          <li>
            <button
              onClick={handleLogout}
              className="w-full flex items-center p-3 hover:bg-[#165468] transition-colors text-left"
            >
              <FaSignOutAlt className="mr-3" />
              <span>Log Out</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;