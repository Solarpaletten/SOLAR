// f/src/components/company/CompanyHeader.tsx
import React, { useState, useEffect } from 'react';

const CompanyHeader: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // Получаем данные из localStorage
    const name = localStorage.getItem('currentCompanyName') || 'Company';
    const id = localStorage.getItem('currentCompanyId') || '0';
    
    setCompanyName(name);
    setCompanyId(id);
    
    console.log('🏢 CompanyHeader loaded:', { name, id });
  }, []);

  return (
    <header className="flex justify-between items-center h-15 px-4 bg-[#f7931e] text-white">
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

      <div className="flex items-center space-x-3">
        {/* 🎯 ДОБАВЛЯЕМ ОТОБРАЖЕНИЕ COMPANY ID ДЛЯ ДИАГНОСТИКИ */}
        <div className="text-right">
          <div className="text-sm font-medium">{companyName}</div>
          <div className="text-xs opacity-75">Company ID: {companyId}</div>
        </div>
        
        <div className="w-9 h-9 rounded-full bg-white overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-[#f7931e] font-bold">
            {companyName.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default CompanyHeader;