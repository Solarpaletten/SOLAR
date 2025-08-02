// f/src/components/layout/company/CompanySidebar.tsx
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { GripVertical, Star, ChevronLeft } from 'lucide-react';

interface SidebarItem {
  id: string;
  icon: string;
  title: string;
  route: string;
  expandable?: boolean;
  priority: number;
  isActive?: boolean;
  isPinned?: boolean;
  badge?: string | null;
}

interface SubmenuState {
  warehouse: boolean;
  cashier: boolean;
}

const CompanySidebar: React.FC = () => {
  const location = useLocation();
  
  // 📱 РЕАЛЬНЫЕ ДАННЫЕ С DRAG & DROP ФУНКЦИОНАЛЬНОСТЬЮ
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([
    {
      id: 'dashboard',
      icon: "📊",
      title: "Dashboard",
      route: "/dashboard",
      priority: 1,
      isPinned: true, // Всегда первый
      badge: null
    },
    {
      id: 'clients',
      icon: "👥",
      title: "Clients",
      route: "/clients",
      priority: 2,
      isPinned: false,
      badge: null
    },
    {
      id: 'warehouse',
      icon: "📦",
      title: "Warehouse",
      route: "/warehouse",
      expandable: true,
      priority: 3,
      isPinned: false,
      badge: null
    },
    {
      id: 'ledger',
      icon: "📋",
      title: "General ledger",
      route: "/ledger",
      priority: 4,
      isPinned: false,
      badge: null
    },
    {
      id: 'cashier',
      icon: "💰",
      title: "Cashier",
      route: "/cashier",
      expandable: true,
      priority: 5,
      isPinned: false,
      badge: null
    },
    {
      id: 'reports',
      icon: "📊",
      title: "Reports",
      route: "/reports",
      priority: 6,
      isPinned: false,
      badge: null
    },
    {
      id: 'personnel',
      icon: "👨‍💼",
      title: "Personnel",
      route: "/personnel",
      priority: 7,
      isPinned: false,
      badge: null
    },
    {
      id: 'production',
      icon: "🏭",
      title: "Production",
      route: "/production",
      priority: 8,
      isPinned: false,
      badge: null
    },
    {
      id: 'assets',
      icon: "💎",
      title: "Assets",
      route: "/assets",
      priority: 9,
      isPinned: false,
      badge: null
    },
    {
      id: 'documents',
      icon: "📄",
      title: "Documents",
      route: "/documents",
      priority: 10,
      isPinned: false,
      badge: null
    },
    {
      id: 'salary',
      icon: "💸",
      title: "Salary",
      route: "/salary",
      priority: 11,
      isPinned: false,
      badge: null
    },
    {
      id: 'declaration',
      icon: "📋",
      title: "Declaration",
      route: "/declaration",
      priority: 12,
      isPinned: false,
      badge: null
    },
    {
      id: 'settings',
      icon: "⚙️",
      title: "Settings",
      route: "/settings",
      priority: 13,
      isPinned: true, // Всегда последний
      badge: null
    }
  ]);

  // 📱 DRAG & DROP STATE
  const [draggedItem, setDraggedItem] = useState<SidebarItem | null>(null);
  const [dragOverItem, setDragOverItem] = useState<SidebarItem | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // SUBMENU STATE
  const [expandedMenus, setExpandedMenus] = useState<SubmenuState>({
    warehouse: location.pathname.includes('/warehouse'),
    cashier: location.pathname.includes('/cashier'),
  });

  // 💾 ЗАГРУЗКА СОХРАНЁННЫХ ПРИОРИТЕТОВ
  useEffect(() => {
    const savedPriorities = localStorage.getItem('sidebarPriorities');
    if (savedPriorities) {
      try {
        const priorities = JSON.parse(savedPriorities);
        setSidebarItems(prevItems => 
          prevItems.map(item => ({
            ...item,
            priority: priorities[item.id] || item.priority
          }))
        );
      } catch (error) {
        console.error('Error loading sidebar priorities:', error);
      }
    }
  }, []);

  // 💾 СОХРАНЕНИЕ ПРИОРИТЕТОВ
  const savePriorities = (items: SidebarItem[]) => {
    const priorities: { [key: string]: number } = {};
    items.forEach(item => {
      priorities[item.id] = item.priority;
    });
    localStorage.setItem('sidebarPriorities', JSON.stringify(priorities));
  };

  // 📱 DRAG & DROP ОБРАБОТЧИКИ
  const handleDragStart = (e: React.DragEvent, item: SidebarItem) => {
    if (item.isPinned) return; // Нельзя перетаскивать закреплённые
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, item: SidebarItem) => {
    e.preventDefault();
    if (item.isPinned || draggedItem?.isPinned) return;
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(item);
  };

  const handleDrop = (e: React.DragEvent, targetItem: SidebarItem) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetItem.id || targetItem.isPinned) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const newItems = [...sidebarItems];
    const draggedIndex = newItems.findIndex(item => item.id === draggedItem.id);
    const targetIndex = newItems.findIndex(item => item.id === targetItem.id);

    // Удаляем перетаскиваемый элемент
    const [draggedMenuItem