import React, { useState, useEffect } from 'react';

interface PurchasesSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  debounceTime?: number;
}

const PurchasesSearch: React.FC<PurchasesSearchProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = 'Search by vendor, invoice number, or description...',
  debounceTime = 300
}) => {
  const [inputValue, setInputValue] = useState(searchTerm);

  // Debounce search input to avoid excessive filtering
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(inputValue);
    }, debounceTime);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, onSearchChange, debounceTime]);

  // Update local state when searchTerm prop changes
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  const handleClear = () => {
    setInputValue('');
    onSearchChange('');
  };

  return (
    <div className="relative w-full sm:max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 text-gray-900 placeholder-gray-500 sm:text-sm"
          placeholder={placeholder}
          aria-label="Search purchases"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label="Clear search"
          >
            <svg
              className="h-5 w-5 text-gray-400 hover:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default PurchasesSearch;