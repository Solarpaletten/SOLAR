import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2">
      <button 
        className={`px-2 py-1 rounded ${i18n.language === 'ru' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => changeLanguage('ru')}
      >
        RU
      </button>
      <button 
        className={`px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => changeLanguage('en')}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;