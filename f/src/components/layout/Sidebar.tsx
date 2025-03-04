import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaSignOutAlt } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth/login');
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold">SOLAR</div>
      <nav className="flex-1 p-4">
        <ul>
          <li className="mb-2">
            <Link
              to="/dashboard"
              className="flex items-center p-2 hover:bg-gray-700 rounded"
            >
              <FaHome className="mr-2" />
              Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/clients"
              className="flex items-center p-2 hover:bg-gray-700 rounded"
            >
              <FaUsers className="mr-2" />
              Clients
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-2 bg-red-600 hover:bg-red-700 rounded"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
