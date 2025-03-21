import React from 'react';

interface PurchasesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

const PurchasesPagination: React.FC<PurchasesPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // Maximum number of page buttons to show
    
    if (totalPages <= maxPagesToShow) {
      // If total pages is less than max, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);
      
      // Calculate start and end of page range
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if current page is near the beginning
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, maxPagesToShow - 1);
      }
      
      // Adjust if current page is near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - (maxPagesToShow - 2));
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always include last page if it's not already included
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };
  
  // Handle items per page change
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onItemsPerPageChange) {
      onItemsPerPageChange(parseInt(e.target.value, 10));
      // Reset to first page when changing items per page
      onPageChange(1);
    }
  };
  
  // Don't show pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
      {/* Items per page selector */}
      <div className="flex items-center text-sm text-gray-700">
        <span className="mr-2">Записей на странице:</span>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      
      {/* Pagination navigation */}
      <nav className="flex justify-center">
        <ul className="inline-flex items-center">
          {/* Previous page button */}
          <li>
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`inline-flex items-center px-2 py-2 rounded-l-md border ${
                currentPage === 1
                  ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
              }`}
              aria-label="Предыдущая"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
          
          {/* Page numbers */}
          {getPageNumbers().map((page, index) => (
            <li key={`page-${index}`}>
              {page === '...' ? (
                <span className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700">
                  ...
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handlePageChange(page as number)}
                  className={`inline-flex items-center px-4 py-2 border ${
                    currentPage === page
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600 z-10'
                      : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </li>
          ))}
          
          {/* Next page button */}
          <li>
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center px-2 py-2 rounded-r-md border ${
                currentPage === totalPages
                  ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
              }`}
              aria-label="Следующая"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default PurchasesPagination;