import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Удаляем токен
    navigate('/auth/login'); // Перенаправляем на страницу логина
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold">SOLAR</div>
      <nav className="flex-1 p-4">
        <ul>
          <li className="mb-2">
            <Link
              to="/dashboard"
              className="block p-2 hover:bg-gray-700 rounded"
            >
              Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/clients" className="block p-2 hover:bg-gray-700 rounded">
              Clients
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full p-2 bg-red-600 hover:bg-red-700 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
