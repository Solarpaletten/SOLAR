import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AccountHeaderProps {
  user?: {
    name: string;
    avatar?: string;
    email?: string;
  };
}

const AccountHeader: React.FC<AccountHeaderProps> = ({
  user = {
    name: 'LEANID SOLAR',
    email: 'admin@solar.swapoil.de',
  },
}) => {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center h-15 px-4 bg-[#f7931e] text-white">
      <div className="flex items-center space-x-4">
        {/* Кнопки управления аккаунтом */}
        <button className="py-1.5 px-3 bg-[#ff6900] rounded hover:bg-[#e05e00] transition-colors">
          Create company
        </button>
        <button className="py-1.5 px-3 bg-transparent rounded hover:bg-opacity-10 hover:bg-white transition-colors">
          Account settings
        </button>

        {/* Информация системы */}
        <div className="ml-2 text-sm">System status: Active</div>
        <div className="ml-2 text-sm">Companies: 3</div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Языковые настройки */}
        <div className="flex space-x-2">
          <span className="text-sm opacity-75">RU</span>
          <span className="text-sm font-semibold">EN</span>
        </div>

        {/* Информация пользователя */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm font-semibold">{user.name}</div>
            <div className="text-xs opacity-75">{user.email}</div>
          </div>

          {/* Аватар пользователя */}
          <div
            className="w-9 h-9 rounded-full bg-white overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            title="Account settings"
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#f7931e] font-bold">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AccountHeader;
