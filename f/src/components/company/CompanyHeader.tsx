// f/src/components/company/CompanyHeader.tsx
// 📱 Draggable Header Actions с iPhone UX

import React, { useState, useEffect } from 'react';
import { GripVertical, Star } from 'lucide-react';

interface HeaderAction {
  id: string;
  icon: string;
  label: string;
  value?: string;
  priority: number;
  isPinned?: boolean;
  action?: () => void;
  isClickable?: boolean;
}

interface CompanyData {
  name: string;
  id: string;
  balance: number;
  partnershipPoints: number;
}

const CompanyHeader: React.FC = () => {
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: 'Company',
    id: '0',
    balance: 0,
    partnershipPoints: 0
  });

  // 📱 DRAGGABLE HEADER ACTIONS
  const [headerActions, setHeaderActions] = useState<HeaderAction[]>([
    {
      id: 'invite',
      icon: '👥',
      label: 'Invite users',
      priority: 1,
      isPinned: false,
      isClickable: true,
      action: () => console.log('🎯 Opening invite users modal...')
    },
    {
      id: 'minimal',
      icon: '🔧',
      label: 'Minimal',
      priority: 2,
      isPinned: false,
      isClickable: true,
      action: () => console.log('🔧 Minimal mode toggle...')
    },
    {
      id: 'balance',
      icon: '💰',
      label: 'Balance',
      value: '0.00 €',
      priority: 3,
      isPinned: false,
      isClickable: false
    },
    {
      id: 'partnership',
      icon: '🤝',
      label: 'Partnership points',
      value: '0.00 €',
      priority: 4,
      isPinned: false,
      isClickable: false
    },
    {
      id: 'notifications',
      icon: '🔔',
      label: 'Notifications',
      value: '3',
      priority: 5,
      isPinned: false,
      isClickable: true,
      action: () => console.log('🔔 Opening notifications...')
    }
  ]);

  // 📱 DRAG & DROP STATE
  const [draggedItem, setDraggedItem] = useState<HeaderAction | null>(null);
  const [dragOverItem, setDragOverItem] = useState<HeaderAction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Загрузка данных компании
    const loadCompanyData = () => {
      const name = localStorage.getItem('currentCompanyName') || 'SWAPOIL GMBH';
      const id = localStorage.getItem('currentCompanyId') || '2';
      
      setCompanyData({
        name,
        id,
        balance: 45230.00,
        partnershipPoints: 150.50
      });
      
      setIsLoading(false);
      console.log('🏢 CompanyHeader loaded:', { name, id });
    };

    // Загрузка сохранённых приоритетов header actions
    const savedPriorities = localStorage.getItem('headerActionsPriorities');
    if (savedPriorities) {
      try {
        const priorities = JSON.parse(savedPriorities);
        setHeaderActions(prevActions => 
          prevActions.map(action => ({
            ...action,
            priority: priorities[action.id] || action.priority
          }))
        );
      } catch (error) {
        console.error('Error loading header priorities:', error);
      }
    }

    loadCompanyData();
  }, []);

  // Обновление значений в зависимости от данных компании
  useEffect(() => {
    setHeaderActions(prev => prev.map(action => {
      if (action.id === 'balance') {
        return { ...action, value: `${companyData.balance.toFixed(2)} €` };
      }
      if (action.id === 'partnership') {
        return { ...action, value: `${companyData.partnershipPoints.toFixed(2)} €` };
      }
      return action;
    }));
  }, [companyData]);

  // 💾 СОХРАНЕНИЕ ПРИОРИТЕТОВ
  const savePriorities = (actions: HeaderAction[]) => {
    const priorities: { [key: string]: number } = {};
    actions.forEach(action => {
      priorities[action.id] = action.priority;
    });
    localStorage.setItem('headerActionsPriorities', JSON.stringify(priorities));
  };

  // 📱 DRAG & DROP ОБРАБОТЧИКИ
  const handleDragStart = (e: React.DragEvent, action: HeaderAction) => {
    if (action.isPinned) return;
    setDraggedItem(action);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, action: HeaderAction) => {
    e.preventDefault();
    if (action.isPinned || draggedItem?.isPinned) return;
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(action);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetAction: HeaderAction) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetAction.id || targetAction.isPinned) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const newActions = [...headerActions];
    const draggedIndex = newActions.findIndex(action => action.id === draggedItem.id);
    const targetIndex = newActions.findIndex(action => action.id === targetAction.id);

    // Удаляем перетаскиваемый элемент
    const [draggedAction] = newActions.splice(draggedIndex, 1);
    
    // Вставляем в новую позицию
    newActions.splice(targetIndex, 0, draggedAction);

    // Пересчитываем приоритеты
    const updatedActions = newActions.map((action, index) => ({
      ...action,
      priority: index + 1
    }));

    setHeaderActions(updatedActions);
    savePriorities(updatedActions);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  // Обработчик клика по действию
  const handleActionClick = (action: HeaderAction) => {
    if (action.isClickable && action.action) {
      action.action();
    }
  };

  // Получить цвет аватара на основе имени компании
  const getAvatarColor = (name: string) => {
    const colors = ['#f7931e', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const index = name.length % colors.length;
    return colors[index];
  };

  const handleAvatarClick = () => {
    console.log('Navigate to settings');
  };

  // Сортировка действий по приоритету
  const sortedActions = [...headerActions].sort((a, b) => a.priority - b.priority);

  if (isLoading) {
    return (
      <header className="flex justify-between items-center h-15 px-4 bg-[#f7931e] text-white">
        <div className="animate-pulse">Loading...</div>
      </header>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center h-16 px-6 bg-[#f7931e] text-white shadow-lg rounded-lg mb-6">
          {/* Left Section - Draggable Actions */}
          <div className="flex items-center space-x-2">
            {sortedActions.map((action) => {
              const isDragging = draggedItem?.id === action.id;
              const isDragOver = dragOverItem?.id === action.id;
              
              return (
                <div
                  key={action.id}
                  className={`
                    flex items-center space-x-2 px-3 py-1.5 rounded-md transition-all duration-200 group cursor-pointer relative
                    ${action.isClickable ? 'bg-[#ff6900] hover:bg-[#e05e00]' : 'bg-transparent hover:bg-white hover:bg-opacity-10'}
                    ${isDragging ? 'opacity-50 scale-95' : ''}
                    ${isDragOver ? 'bg-blue-500 bg-opacity-20 border border-blue-400' : ''}
                  `}
                  draggable={!action.isPinned}
                  onDragStart={(e) => handleDragStart(e, action)}
                  onDragOver={(e) => handleDragOver(e, action)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, action)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleActionClick(action)}
                  title={`${action.label} - Priority #${action.priority}`}
                >
                  {/* Drag Handle */}
                  {!action.isPinned && (
                    <GripVertical className="h-3 w-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                  
                  {/* Pin Indicator */}
                  {action.isPinned && (
                    <Star className="h-3 w-3 text-yellow-300" fill="currentColor" />
                  )}
                  
                  {/* Priority Number */}
                  <span className="text-xs text-white opacity-75 min-w-[1rem]">
                    #{action.priority}
                  </span>
                  
                  {/* Icon */}
                  <span className="text-sm">{action.icon}</span>
                  
                  {/* Label and Value */}
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium">{action.label}</span>
                    {action.value && (
                      <span className="text-sm opacity-90">{action.value}</span>
                    )}
                  </div>
                  
                  {/* Badge for notifications */}
                  {action.id === 'notifications' && action.value && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.2rem] text-center">
                      {action.value}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Section - Company Info */}
          <div className="flex items-center space-x-3">
            {/* Company Info */}
            <div className="text-right">
              <div className="text-sm font-medium">{companyData.name}</div>
              <div className="text-xs opacity-75">ID: {companyData.id}</div>
            </div>
            
            {/* Avatar */}
            <button
              onClick={handleAvatarClick}
              className="w-10 h-10 rounded-full bg-white overflow-hidden hover:scale-105 transition-transform cursor-pointer shadow-md"
              title={`${companyData.name} Settings`}
            >
              <div 
                className="w-full h-full flex items-center justify-center font-bold text-lg"
                style={{ color: getAvatarColor(companyData.name) }}
              >
                {companyData.name.charAt(0).toUpperCase()}
              </div>
            </button>
            
            {/* Dropdown Menu Indicator */}
            <div className="text-xs opacity-75 cursor-pointer hover:opacity-100">
              ▼
            </div>
          </div>
        </header>

        {/* Demo Instructions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📱 Draggable Header Actions Demo
          </h2>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">🎯 Как использовать:</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p>📱 <strong>Наведи на действие</strong> → увидишь ⋮⋮ drag handle</p>
                <p>🖱️ <strong>Перетащи мышкой</strong> → измени порядок приоритетов</p>
                <p>💾 <strong>Автосохранение</strong> → настройки сохраняются в localStorage</p>
                <p>🔢 <strong>Приоритеты</strong> → автоматическая нумерация #1, #2, #3...</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">🌟 Применения в ERP:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p>📊 <strong>Dashboard Widgets:</strong> KPI метрики по важности</p>
                  <p>🔧 <strong>Toolbar Actions:</strong> часто используемые функции</p>
                </div>
                <div>
                  <p>📈 <strong>Quick Access:</strong> быстрые действия в приоритете</p>
                  <p>💼 <strong>Role-based:</strong> разные приоритеты для разных ролей</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">📱 iPhone UX Features:</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p>✨ <strong>Smooth animations</strong> при drag & drop</p>
                <p>🎨 <strong>Visual feedback</strong> с подсветкой и масштабированием</p>
                <p>📱 <strong>Touch-friendly</strong> дизайн для планшетов</p>
                <p>💾 <strong>Persistent state</strong> настройки для каждого пользователя</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Priority List */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-gray-800 mb-4">📋 Текущие приоритеты:</h3>
          <div className="space-y-2">
            {sortedActions.map((action) => (
              <div key={action.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                <span className="text-sm font-mono text-gray-600">#{action.priority}</span>
                <span className="text-lg">{action.icon}</span>
                <span className="flex-1 text-sm font-medium text-gray-800">{action.label}</span>
                {action.value && (
                  <span className="text-sm text-gray-600">{action.value}</span>
                )}
                {action.isPinned && <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyHeader;