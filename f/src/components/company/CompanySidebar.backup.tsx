import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, GripVertical, Star, Moon, Sun, Clock } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

// ... (сохраняем все интерфейсы и основную логику)

interface SidebarItem {
  id: string;
  icon: string;
  title: string;
  route: string;
  expandable?: boolean;
  priority: number;
  isPinned?: boolean;
  badge?: string | null;
}

interface SubmenuState {
  warehouse: boolean;
  banking: boolean;
  purchases: boolean;
  sales: boolean;
}

const CompanySidebar: React.FC = () => {
  const location = useLocation();
  const { theme, currentMode, setTheme, toggleTheme, isDarkMode } = useTheme();
  
  // 🎯 SIDEBAR ITEMS (сохраняем существующую логику)
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([
    { id: 'dashboard', icon: "📊", title: "Dashboard", route: "/dashboard", priority: 1, isPinned: true, badge: null },
    { id: 'clients', icon: "👥", title: "Clients", route: "/clients", priority: 2, isPinned: false, badge: null },
    { id: 'products', icon: "📦", title: "Products", route: "/products", priority: 3, isPinned: false, badge: null },
    { id: 'sales', icon: "💰", title: "Sales", route: "/sales", expandable: true, priority: 4, isPinned: false, badge: null },
    { id: 'purchases', icon: "🛒", title: "Purchases", route: "/purchases", expandable: true, priority: 5, isPinned: false, badge: null },
    { id: 'warehouse', icon: "🏭", title: "Warehouse", route: "/warehouse", expandable: true, priority: 6, isPinned: false, badge: null },
    { id: 'accounts', icon: "📋", title: "Chart of Accounts", route: "/chart-of-accounts", priority: 7, isPinned: false, badge: null },
    { id: 'banking', icon: "🏦", title: "Banking", route: "/banking", expandable: true, priority: 8, isPinned: false, badge: null },
    { id: 'tabbook', icon: "⚡", title: "TAB-Бухгалтерия", route: "/tabbook", priority: 9, isPinned: false, badge: "NEW" },
    { id: 'cloudide', icon: "☁️", title: "Cloud IDE", route: "/cloudide", priority: 10, isPinned: false, badge: "BETA" },
    { id: 'settings', icon: "⚙️", title: "Settings", route: "/settings", priority: 11, isPinned: true, badge: null }
  ]);

  // ... (сохраняем всю логику drag&drop)

  // 🎨 THEME TOGGLE COMPONENT
  const ThemeToggle = () => (
    <div className="border-t border-slate-700 p-4 space-y-3">
      <div className="text-xs text-slate-400 font-medium">THEME FOR TIRED EYES</div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm">
          {theme === 'light' && <Sun className="w-4 h-4 text-yellow-400" />}
          {theme === 'dark' && <Moon className="w-4 h-4 text-blue-400" />}
          {theme === 'auto' && <Clock className="w-4 h-4 text-purple-400" />}
          <span className="text-slate-300">
            {theme === 'light' && 'Энергичное утро'}
            {theme === 'dark' && 'Комфорт для глаз'}
            {theme === 'auto' && 'Авто (18:00-06:00)'}
          </span>
        </div>
        
        <button
          onClick={() => {
            const themes: ('light' | 'dark' | 'auto')[] = ['light', 'dark', 'auto'];
            const currentIndex = themes.indexOf(theme);
            const nextTheme = themes[(currentIndex + 1) % themes.length];
            setTheme(nextTheme);
          }}
          className="p-1 rounded hover:bg-slate-700 transition-colors"
          title="Переключить тему"
        >
          <div className="w-6 h-6 rounded border-2 border-slate-600 flex items-center justify-center">
            {theme === 'light' && '☀️'}
            {theme === 'dark' && '🌙'}
            {theme === 'auto' && '🕐'}
          </div>
        </button>
      </div>
      
      <div className="text-xs text-slate-500">
        {isDarkMode ? '🌙 Мягкие цвета для уставших глаз' : '☀️ Яркие цвета для продуктивности'}
      </div>
    </div>
  );

  return (
    <div className={`w-64 flex-shrink-0 h-full flex flex-col ${isDarkMode ? 'theme-bg-sidebar' : 'bg-slate-800'} text-white`}>
      {/* ... (сохраняем header и navigation) */}
      
      {/* 🌙 THEME TOGGLE */}
      <ThemeToggle />
      
      {/* Footer */}
      <div className="border-t border-slate-700 p-4">
        <button
          onClick={() => {
            localStorage.removeItem('currentCompanyId');
            localStorage.removeItem('currentCompanyName');
            window.location.href = '/account/dashboard';
          }}
          className="text-sm text-slate-400 hover:text-white transition-colors w-full text-left flex items-center"
        >
          <span className="mr-2">🔙</span>
          <span>Back to Companies</span>
        </button>
      </div>
    </div>
  );
};

export default CompanySidebar;
