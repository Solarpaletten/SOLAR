#!/bin/bash

echo "🎊🔥🎯 ДЕЛАЕМ АВАТАР КОМПАНИИ DRAGGABLE! 🎯🔥🎊"
echo ""
echo "🎯 ЗАДАЧА: Только аватар компании можно перетаскивать в header"
echo "📁 ИЗМЕНЯЕМ: CompanyHeader.tsx"
echo ""

cd f

echo "1️⃣ BACKUP ТЕКУЩЕГО HEADER:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cp src/components/company/CompanyHeader.tsx src/components/company/CompanyHeader.tsx.before_avatar_drag

echo "✅ Backup создан"

echo ""
echo "2️⃣ СОЗДАЁМ HEADER С DRAGGABLE АВАТАРОМ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Создаём enhanced CompanyHeader с draggable аватаром
cat > src/components/company/CompanyHeader.tsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

const CompanyHeader: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [balance, setBalance] = useState(0);
  
  // 🎯 AVATAR DRAG&DROP STATE
  const [avatarPosition, setAvatarPosition] = useState<'left' | 'center' | 'right'>('right');
  const [isDragging, setIsDragging] = useState(false);
  const [draggedOver, setDraggedOver] = useState<'left' | 'center' | 'right' | null>(null);

  useEffect(() => {
    // Получаем данные из localStorage
    const name = localStorage.getItem('currentCompanyName') || 'Company';
    const id = localStorage.getItem('currentCompanyId') || '0';
    
    setCompanyName(name);
    setCompanyId(id);
    
    // 💾 Загружаем сохранённую позицию аватара
    const savedPosition = localStorage.getItem('headerAvatarPosition') as 'left' | 'center' | 'right';
    if (savedPosition) {
      setAvatarPosition(savedPosition);
    }
    
    console.log('🏢 CompanyHeader loaded:', { name, id, avatarPosition: savedPosition || 'right' });
  }, []);

  // 💾 СОХРАНЕНИЕ ПОЗИЦИИ АВАТАРА
  const saveAvatarPosition = (position: 'left' | 'center' | 'right') => {
    setAvatarPosition(position);
    localStorage.setItem('headerAvatarPosition', position);
  };

  // 🖱️ DRAG HANDLERS
  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedOver(null);
  };

  const handleDragOver = (e: React.DragEvent, zone: 'left' | 'center' | 'right') => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOver(zone);
  };

  const handleDragLeave = () => {
    setDraggedOver(null);
  };

  const handleDrop = (e: React.DragEvent, zone: 'left' | 'center' | 'right') => {
    e.preventDefault();
    if (zone !== avatarPosition) {
      saveAvatarPosition(zone);
    }
    setDraggedOver(null);
  };

  // 🎨 AVATAR COMPONENT
  const CompanyAvatar = () => (
    <div 
      className={`
        flex items-center space-x-3 cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        transition-opacity duration-200
      `}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Drag Handle */}
      <GripVertical className="w-4 h-4 text-white opacity-60 hover:opacity-100 transition-opacity" />
      
      {/* Company Info */}
      <div className="text-right">
        <div className="text-sm font-medium">{companyName}</div>
        <div className="text-xs opacity-75">Company ID: {companyId}</div>
      </div>
      
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-white overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-[#f7931e] font-bold">
          {companyName.charAt(0)}
        </div>
      </div>
    </div>
  );

  // 🎨 DROP ZONE STYLES
  const getDropZoneStyles = (zone: 'left' | 'center' | 'right') => {
    const baseStyles = "flex-1 min-h-[60px] flex items-center transition-colors duration-200";
    const dragOverStyles = draggedOver === zone ? "bg-white bg-opacity-10 border-2 border-white border-dashed" : "";
    return `${baseStyles} ${dragOverStyles}`;
  };

  return (
    <header className="flex justify-between items-center h-15 px-4 bg-[#f7931e] text-white">
      {/* LEFT ZONE */}
      <div 
        className={getDropZoneStyles('left')}
        onDragOver={(e) => handleDragOver(e, 'left')}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, 'left')}
      >
        {avatarPosition === 'left' && <CompanyAvatar />}
        
        {/* Статичные элементы слева (если аватар не здесь) */}
        {avatarPosition !== 'left' && (
          <div className="flex items-center space-x-4">
            <button className="py-1.5 px-3 bg-[#ff6900] rounded hover:bg-[#e05e00] transition-colors">
              Invite users
            </button>
            <button className="py-1.5 px-3 bg-transparent rounded hover:bg-opacity-10 hover:bg-white transition-colors">
              Minimal
            </button>
            <div className="ml-2 text-sm">Balance {balance.toFixed(2)} €</div>
            <div className="ml-2 text-sm">Partnership points 0.00 €</div>
          </div>
        )}
      </div>

      {/* CENTER ZONE */}
      <div 
        className={getDropZoneStyles('center')}
        onDragOver={(e) => handleDragOver(e, 'center')}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, 'center')}
      >
        {avatarPosition === 'center' && (
          <div className="flex justify-center">
            <CompanyAvatar />
          </div>
        )}
      </div>

      {/* RIGHT ZONE */}
      <div 
        className={getDropZoneStyles('right')}
        onDragOver={(e) => handleDragOver(e, 'right')}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, 'right')}
      >
        {avatarPosition === 'right' && (
          <div className="flex justify-end">
            <CompanyAvatar />
          </div>
        )}
        
        {/* Остальные элементы справа (если аватар не здесь) */}
        {avatarPosition !== 'right' && (
          <div className="flex justify-end items-center space-x-4">
            <div className="ml-2 text-sm">Balance {balance.toFixed(2)} €</div>
            <div className="ml-2 text-sm">Partnership points 0.00 €</div>
          </div>
        )}
      </div>
    </header>
  );
};

export default CompanyHeader;
EOF

echo "✅ Header с draggable аватаром создан!"

echo ""
echo "3️⃣ ПРОВЕРЯЕМ РЕЗУЛЬТАТ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "📊 Новый CompanyHeader статистика:"
echo "   📄 Строк кода: $(wc -l src/components/company/CompanyHeader.tsx | cut -d' ' -f1)"
echo "   🖱️ Drag функции: $(grep -c 'handleDrag\|Drag' src/components/company/CompanyHeader.tsx)"
echo "   🎯 Drop zones: $(grep -c 'DROP ZONE\|onDrop' src/components/company/CompanyHeader.tsx)"
echo "   💾 localStorage: $(grep -c 'localStorage' src/components/company/CompanyHeader.tsx)"

echo ""
echo "🎊🔥🚀 DRAGGABLE АВАТАР ГОТОВ! 🚀🔥🎊"
echo ""
echo "✅ РЕЗУЛЬТАТ:"
echo "   🖱️ Аватар компании можно перетаскивать"
echo "   📍 3 зоны: Left | Center | Right"
echo "   💾 Позиция сохраняется в localStorage"
echo "   🎨 Visual feedback при перетаскивании"
echo "   ⚡ GripVertical handle для захвата"
echo ""
echo "🎯 ФУНКЦИОНАЛЬНОСТЬ:"
echo "   📱 Перетащи аватар SWAPOIL GMBH в любую зону"
echo "   💾 Позиция автоматически сохранится"
echo "   🔄 При перезагрузке позиция восстановится"
echo "   🎨 Drop zones подсвечиваются при hover"
echo ""
echo "🚀 ГОТОВО К ТЕСТИРОВАНИЮ!"
echo "💫 ЛОГОТИП SOLAR НЕ ТРОНУТ, ТОЛЬКО АВАТАР DRAGGABLE!"