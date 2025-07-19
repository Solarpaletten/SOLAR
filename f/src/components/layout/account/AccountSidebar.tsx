import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  FaChartBar,
  FaUsers,
  FaUserTie,
  FaDatabase,
  FaHandshake,
  FaEnvelope,
  FaBell,
  FaQuestionCircle,
  FaChartLine,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';

interface SubmenuState {
  employeeAccount: boolean;
  myData: boolean;
}

const AccountSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [expandedMenus, setExpandedMenus] = useState<SubmenuState>({
    employeeAccount: location.pathname.includes('/account/employee'),
    myData: location.pathname.includes('/account/data'),
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

  // Стиль для кнопки раскрытия подменю
  const submenuButtonClass =
    'flex items-center justify-between w-full p-3 hover:bg-[#165468] transition-colors';

  return (
    <div className="w-64 h-screen bg-[#0f3c4c] text-white flex flex-col">
      {/* ЛОГОТИП - ОСТАЕТСЯ НА ACCOUNT DASHBOARD */}
      <NavLink
        to="/account/dashboard"
        className="block p-4 text-2xl font-bold bg-[#0a2e3b] cursor-pointer hover:opacity-90 transition-opacity text-white no-underline"
        title="Solar ERP Dashboard"
      >
        Solar
      </NavLink>

      <nav className="flex-1 overflow-y-auto">
        <ul className="p-0 m-0 list-none">
          {/* Dashboard */}
          <li>
            <NavLink to="/account/dashboard" className={linkClass}>
              <FaChartBar className="mr-3" />
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* Companies and users */}
          <li>
            <NavLink to="/account/companies" className={linkClass}>
              <FaUsers className="mr-3" />
              <span>Companies and users</span>
            </NavLink>
          </li>

          {/* Employee account (с подменю) */}
          <li>
            <button
              onClick={() => toggleSubmenu('employeeAccount')}
              className={submenuButtonClass}
            >
              <div className="flex items-center">
                <FaUserTie className="mr-3" />
                <span>Employee account</span>
              </div>
              {expandedMenus.employeeAccount ? (
                <FaChevronUp />
              ) : (
                <FaChevronDown />
              )}
            </button>
            {expandedMenus.employeeAccount && (
              <ul className="bg-[#0a2e3b]">
                <li>
                  <NavLink
                    to="/account/employee/profile"
                    className={submenuLinkClass}
                  >
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/account/employee/permissions"
                    className={submenuLinkClass}
                  >
                    Permissions
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* My data (с подменю) */}
          <li>
            <button
              onClick={() => toggleSubmenu('myData')}
              className={submenuButtonClass}
            >
              <div className="flex items-center">
                <FaDatabase className="mr-3" />
                <span>My data</span>
              </div>
              {expandedMenus.myData ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {expandedMenus.myData && (
              <ul className="bg-[#0a2e3b]">
                <li>
                  <NavLink
                    to="/account/data/export"
                    className={submenuLinkClass}
                  >
                    Export data
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/account/data/backup"
                    className={submenuLinkClass}
                  >
                    Backup
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Affiliate program */}
          <li>
            <NavLink to="/account/affiliate" className={linkClass}>
              <FaHandshake className="mr-3" />
              <span>Affiliate program</span>
            </NavLink>
          </li>

          {/* Invites */}
          <li>
            <NavLink to="/account/invites" className={linkClass}>
              <FaEnvelope className="mr-3" />
              <span>Invites</span>
            </NavLink>
          </li>

          {/* Reminders */}
          <li>
            <NavLink to="/account/reminders" className={linkClass}>
              <FaBell className="mr-3" />
              <span>Reminders</span>
            </NavLink>
          </li>

          {/* Support */}
          <li>
            <NavLink to="/account/support" className={linkClass}>
              <FaQuestionCircle className="mr-3" />
              <span>Support</span>
            </NavLink>
          </li>

          {/* Statistics */}
          <li>
            <NavLink to="/account/statistics" className={linkClass}>
              <FaChartLine className="mr-3" />
              <span>Statistics</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AccountSidebar;
