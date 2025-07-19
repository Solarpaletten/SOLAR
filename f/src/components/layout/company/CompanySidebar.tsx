import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FaUsers, FaChartBar } from 'react-icons/fa';

const CompanySidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Общий стиль для активных и неактивных ссылок
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-3 hover:bg-[#165468] transition-colors ${
      isActive ? 'bg-[#165468]' : ''
    }`;

  return (
    <div className="w-64 h-screen bg-[#0f3c4c] text-white flex flex-col">
      {/* ЛОГОТИП - ВОЗВРАТ К ВЫБОРУ КОМПАНИИ */}
      <NavLink
        to="/account/dashboard"
        className="block p-4 text-2xl font-bold bg-[#0a2e3b] cursor-pointer hover:opacity-90 transition-opacity text-white no-underline"
        title="Back to company selection"
      >
        Solar
      </NavLink>

      <nav className="flex-1 overflow-y-auto">
        <ul className="p-0 m-0 list-none">
          {/* Dashboard */}
          <li>
            <NavLink to="/dashboard" className={linkClass}>
              <FaChartBar className="mr-3" />
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* Customers (Clients) */}
          <li>
            <NavLink to="/clients" className={linkClass}>
              <FaUsers className="mr-3" />
              <span>Customers</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default CompanySidebar;
