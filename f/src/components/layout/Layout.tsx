import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Outlet /> {/* Здесь будут рендериться дочерние маршруты */}
      </div>
    </div>
  );
};

export default Layout;
