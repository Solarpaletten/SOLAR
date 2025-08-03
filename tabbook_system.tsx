// TabBook MVP - Революционная TAB-Бухгалтерия
// "1 ДЕЙСТВИЕ = 90% БУХГАЛТЕРИИ"

import React, { useState, useEffect } from 'react';
import { Copy, Zap, RefreshCw, Save, Edit3 } from 'lucide-react';

// Hook для управления последними операциями
const useLastOperation = () => {
  const [lastOperations, setLastOperations] = useState({
    purchase: null,
    sale: null,
    payment: null,
    tax: null
  });

  const saveOperation = (type, data) => {
    const operationWithDate = {
      ...data,
      originalDate: data.date,
      id: Date.now(), // Для tracking
      timestamp: new Date().toISOString()
    };
    
    setLastOperations(prev => ({
      ...prev,
      [type]: operationWithDate
    }));
    
    // Сохранить в localStorage для персистентности
    localStorage.setItem('tabbook_last_ops', JSON.stringify({
      ...lastOperations,
      [type]: operationWithDate
    }));
  };

  const getOperation = (type) => {
    const lastOp = lastOperations[type];
    if (!lastOp) return null;
    
    return {
      ...lastOp,
      date: new Date().toISOString().split('T')[0], // Сегодняшняя дата
      id: Date.now(), // Новый ID
      duplicatedFrom: lastOp.id // Tracking откуда дублировано
    };
  };

  // Загрузка из localStorage при инициализации
  useEffect(() => {
    const saved = localStorage.getItem('tabbook_last_ops');
    if (saved) {
      try {
        setLastOperations(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading TabBook operations:', error);
      }
    }
  }, []);

  return { saveOperation, getOperation, lastOperations };
};

// Компонент TAB Duplicator Button
const TabDuplicatorButton = ({ type, onDuplicate, lastOperation, disabled = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [justClicked, setJustClicked] = useState(false);

  const handleClick = () => {
    if (!lastOperation || disabled) return;
    
    setJustClicked(true);
    setTimeout(() => setJustClicked(false), 600);
    
    onDuplicate(lastOperation);
  };

  const getTypeInfo = (type) => {
    const types = {
      purchase: { icon: '📦', label: 'Приход', color: 'from-green-500 to-green-600' },
      sale: { icon: '💰', label: 'Продажа', color: 'from-blue-500 to-blue-600' },
      payment: { icon: '🏦', label: 'Платёж', color: 'from-purple-500 to-purple-600' },
      tax: { icon: '📋', label: 'Налог', color: 'from-orange-500 to-orange-600' }
    };
    return types[type] || types.purchase;
  };

  const typeInfo = getTypeInfo(type);

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={!lastOperation || disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative overflow-hidden px-6 py-3 rounded-xl font-semibold text-white
          transition-all duration-300 transform
          ${!lastOperation || disabled 
            ? 'bg-gray-400 cursor-not-allowed opacity-50' 
            : `bg-gradient-to-r ${typeInfo.color} hover:scale-105 hover:shadow-lg active:scale-95`
          }
          ${justClicked ? 'animate-pulse' : ''}
        `}
      >
        {/* Анимация при клике */}
        {justClicked && (
          <div className="absolute inset-0 bg-white opacity-30 animate-ping rounded-xl"></div>
        )}
        
        <div className="flex items-center space-x-2 relative z-10">
          <Copy className={`h-5 w-5 transition-transform ${isHovered ? 'rotate-12' : ''}`} />
          <span className="text-lg">{typeInfo.icon}</span>
          <span>TAB</span>
          <span className="text-sm opacity-90">{typeInfo.label}</span>
        </div>
        
        {/* Keyboard hint */}
        <div className="absolute -top-1 -right-1 bg-white text-gray-700 text-xs px-1 py-0.5 rounded text-[10px]">
          Tab
        </div>
      </button>
      
      {/* Tooltip с информацией о последней операции */}
      {isHovered && lastOperation && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white px-3 py-2 rounded-lg text-sm z-20 whitespace-nowrap">
          <div className="text-center">
            <div className="font-medium">Дублировать:</div>
            <div className="text-xs opacity-75">
              {lastOperation.supplier || lastOperation.client || lastOperation.description || 'Операция'}
            </div>
            <div className="text-xs text-green-300">
              {lastOperation.amount ? `${lastOperation.amount} €` : ''}
            </div>
          </div>
          {/* Треугольник */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
        </div>
      )}
    </div>
  );
};

// Компонент Quick Edit для быстрого редактирования дублированной записи
const QuickEditPanel = ({ operation, onSave, onCancel, type }) => {
  const [editData, setEditData] = useState(operation || {});

  const handleSave = () => {
    onSave(editData);
  };

  const getEditFields = () => {
    switch (type) {
      case 'purchase':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Поставщик</label>
                <input
                  type="text"
                  value={editData.supplier || ''}
                  onChange={(e) => setEditData({...editData, supplier: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Название поставщика"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Сумма €</label>
                <input
                  type="number"
                  value={editData.amount || ''}
                  onChange={(e) => setEditData({...editData, amount: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Товар</label>
              <input
                type="text"
                value={editData.product || ''}
                onChange={(e) => setEditData({...editData, product: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Название товара"
              />
            </div>
          </>
        );
      case 'sale':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Покупатель</label>
                <input
                  type="text"
                  value={editData.client || ''}
                  onChange={(e) => setEditData({...editData, client: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Название покупателя"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Сумма €</label>
                <input
                  type="number"
                  value={editData.amount || ''}
                  onChange={(e) => setEditData({...editData, amount: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
          </>
        );
      case 'payment':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Получатель</label>
                <input
                  type="text"
                  value={editData.recipient || ''}
                  onChange={(e) => setEditData({...editData, recipient: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Кому платим"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Сумма €</label>
                <input
                  type="number"
                  value={editData.amount || ''}
                  onChange={(e) => setEditData({...editData, amount: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            ⚡ Быстрое редактирование
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          {getEditFields()}
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <Save className="h-4 w-4 inline mr-2" />
            Сохранить
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

// Главный компонент TabBook Demo
const TabBookDemo = () => {
  const { saveOperation, getOperation, lastOperations } = useLastOperation();
  const [operations, setOperations] = useState([]);
  const [editingOperation, setEditingOperation] = useState(null);
  const [editingType, setEditingType] = useState(null);

  // Обработка TAB клавиши
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        // По умолчанию дублируем последний