import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
} from 'react-icons/fa';

interface SubmenuState {
  warehouse: boolean;
  cashier: boolean;
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<SubmenuState>({
    warehouse: false,
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

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 h-screen bg-[#0f3c4c] text-white flex flex-col">
      <div className="p-4 text-2xl font-bold bg-[#0a2e3b]">Solar</div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="p-0 m-0 list-none">
          <li>
            <Link
              to="/clients"
              className={`flex items-center p-3 hover:bg-[#165468] transition-colors ${isActive('/clients') ? 'bg-[#165468]' : ''}`}
            >
              <FaUsers className="mr-3" />
              <span>Clients</span>
            </Link>
          </li>

          <li>
  <div
    className={`flex items-center justify-between p-3 hover:bg-[#165468] cursor-pointer transition-colors ${expandedMenus.warehouse || isActive('/warehouse') ? 'bg-[#165468]' : ''}`}
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
      <li><Link to="/warehouse/sales" className="pl-10 pr-3 py-2 block hover:bg-[#165468]">Sales</Link></li>
      <li><Link to="/warehouse/client-prices" className="pl-10 pr-3 py-2 block hover:bg-[#165468]">Client prices</Link></li>
      <li><Link to="/warehouse/automatic-invoicing" className="pl-10 pr-3 py-2 block hover:bg-[#165468]">Automatic invoicing</Link></li>
      <li><Link to="/warehouse/purchases" className="pl-10 pr-3 py-2 block hover:bg-[#165468]">Purchases</Link></li>
      <li><Link to="/warehouse/sales-returns" className="pl-10 pr-3 py-2 block hover:bg-[#165468]">Sales returns</Link></li>
      <li><Link to="/warehouse/remaining-items" className="pl-10 pr-3 py-2 block hover:bg-[#165468]">Remaining items</Link></li>
      <li><Link to="/warehouse/item-movement" className="pl-10 pr-3 py-2 block hover:bg-[#165468]">Item movement</Link></li>
      <li><Link to="/warehouse/consignment-balance" className="pl-10 pr-3 py-2 block hover:bg-[#165468]">Consignment balance</Link></li>
      <li><Link to="/warehouse/stock-taking" className="pl-10 pr-3 py-2 block hover:bg-[#165468]">Stock-taking</Link></li>
      <li><Link to="/warehouse/revaluation" className="pl-10 pr-3 py-2 block hover:bg-[#165468]">Revaluation</Link></li>
      <li><Link to="/warehouse/internal-movement-confirmation" className="pl-10 pr-3 py-2 block hover:bg-[#165468]">Internal movement confirmation</Link></li>
      <li><Link to="/warehouse/e-commerce" className="pl-10 pr-3 py-2 block hover:bg-[#165468]">E-commerce</Link></li>
      <li><Link to="/warehouse/cash-register-sales" className="pl-10 pr-3 py-2 block hover:bg-[#165468]">Cash register sales</Link></li>
    </ul>
  )}
</li>


          <li>
            <Link
              to="/dashboard"
              className={`flex items-center p-3 hover:bg-[#165468] transition-colors ${isActive('/dashboard') ? 'bg-[#165468]' : ''}`}
            >
              <FaChartBar className="mr-3" />
              <span>Dashboard</span>
            </Link>
          </li>

          <li>
            <Link
              to="/general-ledger"
              className={`flex items-center p-3 hover:bg-[#165468] transition-colors ${isActive('/general-ledger') ? 'bg-[#165468]' : ''}`}
            >
              <FaBook className="mr-3" />
              <span>General ledger</span>
            </Link>
          </li>

          <li>
            <div
              className={`flex items-center justify-between p-3 hover:bg-[#165468] cursor-pointer transition-colors ${expandedMenus.cashier || isActive('/cashier') ? 'bg-[#165468]' : ''}`}
              onClick={() => toggleSubmenu('cashier')}
            >
              <div className="flex items-center">
                <FaCashRegister className="mr-3" />
                <span>Cashier</span>
              </div>
              {expandedMenus.cashier ? (
                <FaChevronDown size={12} />
              ) : (
                <FaChevronRight size={12} />
              )}
            </div>
            {expandedMenus.cashier && (
              <ul className="bg-[#0a2e3b] py-1">
                <li>
                  <Link
                    to="/cashier/transactions"
                    className={`pl-10 pr-3 py-2 block hover:bg-[#165468] ${isActive('/cashier/transactions') ? 'bg-[#165468]' : ''}`}
                  >
                    Transactions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cashier/receipts"
                    className={`pl-10 pr-3 py-2 block hover:bg-[#165468] ${isActive('/cashier/receipts') ? 'bg-[#165468]' : ''}`}
                  >
                    Receipts
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link
              to="/reports"
              className={`flex items-center p-3 hover:bg-[#165468] transition-colors ${isActive('/reports') ? 'bg-[#165468]' : ''}`}
            >
              <FaFileAlt className="mr-3" />
              <span>Reports</span>
            </Link>
          </li>

          <li>
            <Link
              to="/personnel"
              className={`flex items-center p-3 hover:bg-[#165468] transition-colors ${isActive('/personnel') ? 'bg-[#165468]' : ''}`}
            >
              <FaUserTie className="mr-3" />
              <span>Personnel</span>
            </Link>
          </li>

          <li>
            <Link
              to="/production"
              className={`flex items-center p-3 hover:bg-[#165468] transition-colors ${isActive('/production') ? 'bg-[#165468]' : ''}`}
            >
              <FaIndustry className="mr-3" />
              <span>Production</span>
            </Link>
          </li>

          <li>
            <Link
              to="/assets"
              className={`flex items-center p-3 hover:bg-[#165468] transition-colors ${isActive('/assets') ? 'bg-[#165468]' : ''}`}
            >
              <FaCoins className="mr-3" />
              <span>Assets</span>
            </Link>
          </li>

          <li>
            <Link
              to="/documents"
              className={`flex items-center p-3 hover:bg-[#165468] transition-colors ${isActive('/documents') ? 'bg-[#165468]' : ''}`}
            >
              <FaFileInvoice className="mr-3" />
              <span>Documents</span>
            </Link>
          </li>

          <li>
            <Link
              to="/salary"
              className={`flex items-center p-3 hover:bg-[#165468] transition-colors ${isActive('/salary') ? 'bg-[#165468]' : ''}`}
            >
              <FaMoneyBillWave className="mr-3" />
              <span>Salary</span>
            </Link>
          </li>

          <li>
            <Link
              to="/declaration"
              className={`flex items-center p-3 hover:bg-[#165468] transition-colors ${isActive('/declaration') ? 'bg-[#165468]' : ''}`}
            >
              <FaFileAlt className="mr-3" />
              <span>Declaration</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-3 border-t border-[#165468]">
        <ul className="p-0 m-0 list-none">
          <li>
            <Link
              to="/admin"
              className={`flex items-center p-3 hover:bg-[#165468] transition-colors ${isActive('/admin') ? 'bg-[#165468]' : ''}`}
            >
              <FaDatabase className="mr-3" />
              <span>Admin Panel</span>
            </Link>
          </li>

          <li>
            <Link
              to="/settings"
              className={`flex items-center p-3 hover:bg-[#165468] transition-colors ${isActive('/settings') ? 'bg-[#165468]' : ''}`}
            >
              <FaCog className="mr-3" />
              <span>Settings</span>
            </Link>
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
