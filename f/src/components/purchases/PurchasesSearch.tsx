import React from 'react';

interface PurchasesSearchProps {
  searchTerm: string;
  onSearch: (value: string) => void;
  onReset?: () => void;
}

const PurchasesSearch: React.FC<PurchasesSearchProps> = ({ searchTerm, onSearch, onReset }) => {
  return (
    <div className="mb-4 flex items-center space-x-2">
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Поиск по поставщику или номеру счёта..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm text-sm"
        />
      </div>
      {onReset && (
        <button
          onClick={onReset}
          className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300"
        >
          Сбросить
        </button>
      )}
    </div>
  );
};

export default PurchasesSearch;