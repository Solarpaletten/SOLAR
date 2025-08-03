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
        // По умолчанию дублируем последний приход
        const lastPurchase = getOperation('purchase');
        if (lastPurchase) {
          handleDuplicate('purchase', lastPurchase);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lastOperations]);

  const handleDuplicate = (type, operation) => {
    setEditingOperation(operation);
    setEditingType(type);
  };

  const handleSaveEdit = (editedData) => {
    // Сохраняем операцию
    const newOperation = {
      ...editedData,
      id: Date.now(),
      type: editingType,
      date: new Date().toISOString().split('T')[0],
      isDuplicated: true
    };
    
    setOperations(prev => [newOperation, ...prev]);
    saveOperation(editingType, newOperation);
    
    setEditingOperation(null);
    setEditingType(null);
  };

  const handleCancelEdit = () => {
    setEditingOperation(null);
    setEditingType(null);
  };

  const createSampleOperation = (type) => {
    const samples = {
      purchase: {
        supplier: 'ООО Поставщик',
        product: 'Товар А',
        amount: 1000,
        type: 'purchase'
      },
      sale: {
        client: 'ИП Покупатель',
        product: 'Товар А',
        amount: 1200,
        type: 'sale'
      },
      payment: {
        recipient: 'Налоговая',
        description: 'НДС за март',
        amount: 200,
        type: 'payment'
      }
    };

    const operation = {
      ...samples[type],
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };

    setOperations(prev => [operation, ...prev]);
    saveOperation(type, operation);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔥 TabBook MVP
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            "TAB-Бухгалтерия" - 1 ДЕЙСТВИЕ = 90% РАБОТЫ
          </p>
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-4 inline-block">
            <p className="text-gray-700">
              <kbd className="bg-white px-2 py-1 rounded shadow text-sm">Tab</kbd> → Дублировать → Изменить 2 поля → Готово! ⚡
            </p>
          </div>
        </div>

        {/* TAB Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <h3 className="font-semibold text-gray-900 mb-3 text-center">📦 Приходы</h3>
            <TabDuplicatorButton
              type="purchase"
              lastOperation={lastOperations.purchase}
              onDuplicate={(op) => handleDuplicate('purchase', op)}
            />
            {!lastOperations.purchase && (
              <button
                onClick={() => createSampleOperation('purchase')}
                className="w-full mt-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              >
                Создать пример
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg">
            <h3 className="font-semibold text-gray-900 mb-3 text-center">💰 Продажи</h3>
            <TabDuplicatorButton
              type="sale"
              lastOperation={lastOperations.sale}
              onDuplicate={(op) => handleDuplicate('sale', op)}
            />
            {!lastOperations.sale && (
              <button
                onClick={() => createSampleOperation('sale')}
                className="w-full mt-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              >
                Создать пример
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg">
            <h3 className="font-semibold text-gray-900 mb-3 text-center">🏦 Платежи</h3>
            <TabDuplicatorButton
              type="payment"
              lastOperation={lastOperations.payment}
              onDuplicate={(op) => handleDuplicate('payment', op)}
            />
            {!lastOperations.payment && (
              <button
                onClick={() => createSampleOperation('payment')}
                className="w-full mt-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              >
                Создать пример
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg">
            <h3 className="font-semibold text-gray-900 mb-3 text-center">📋 Статистика</h3>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-green-600">
                {operations.filter(op => op.isDuplicated).length}
              </div>
              <div className="text-sm text-gray-600">Дублированных операций</div>
              <div className="text-xs text-gray-500">
                Экономия времени: ~{operations.filter(op => op.isDuplicated).length * 85}%
              </div>
            </div>
          </div>
        </div>

        {/* Operations List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📋 Последние операции
          </h2>
          
          {operations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Copy className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Создайте первую операцию, чтобы начать дублирование</p>
            </div>
          ) : (
            <div className="space-y-3">
              {operations.slice(0, 10).map((op) => (
                <div
                  key={op.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    op.type === 'purchase' ? 'border-green-500 bg-green-50' :
                    op.type === 'sale' ? 'border-blue-500 bg-blue-50' :
                    'border-purple-500 bg-purple-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">
                          {op.type === 'purchase' ? '📦' : op.type === 'sale' ? '💰' : '🏦'}
                        </span>
                        <div>
                          <div className="font-medium text-gray-900">
                            {op.supplier || op.client || op.recipient}
                          </div>
                          <div className="text-sm text-gray-600">
                            {op.product || op.description}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {op.amount?.toFixed(2)} €
                      </div>
                      <div className="text-xs text-gray-500">
                        {op.date}
                        {op.isDuplicated && (
                          <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-[10px]">
                            TAB
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
            <h3 className="font-semibold text-green-800 mb-3">⚡ Мгновенное дублирование</h3>
            <p className="text-green-700 text-sm">
              Одна кнопка TAB копирует всю операцию. Меняешь только 1-2 поля.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <h3 className="font-semibold text-blue-800 mb-3">🎯 90% автоматизации</h3>
            <p className="text-blue-700 text-sm">
              Дата, валюта, НДС, банк - всё копируется. Редактируешь только суть.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
            <h3 className="font-semibold text-purple-800 mb-3">📱 Мобильная магия</h3>
            <p className="text-purple-700 text-sm">
              Идеально для телефона. Один тап - и операция готова.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Edit Modal */}
      {editingOperation && (
        <QuickEditPanel
          operation={editingOperation}
          type={editingType}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default TabBookDemo;