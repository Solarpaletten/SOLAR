// src/components/layout/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import AppHeader from './AppHeader';
import LanguageSwitcher from '../common/LanguageSwitcher';
import AssistantPanel from '@/components/assistant/AssistantPanel';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header user={{ name: 'LEANID SOLAR' }} />
        <div className="flex justify-between items-center px-4 py-2 bg-white border-b border-gray-200">
          <AppHeader /> {/* Our app header component */}
          <LanguageSwitcher /> {/* Added language switcher */}
          <AssistantPanel />
        </div>
        <main className="flex-1 p-5 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
