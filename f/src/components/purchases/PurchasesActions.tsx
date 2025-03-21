import React, { useState } from 'react';

interface PurchasesActionsProps {
  onCreateNew: () => void;
  onExport?: () => void;
  onImport?: (file: File) => void;
  onBulkDelete?: (ids: string[]) => void;
  selectedItems?: string[];
  hasExportFeature?: boolean;
  hasImportFeature?: boolean;
  hasBulkActions?: boolean;
}

const PurchasesActions: React.FC<PurchasesActionsProps> = ({
  onCreateNew,
  onExport,
  onImport,
  onBulkDelete,
  selectedItems = [],
  hasExportFeature = true,
  hasImportFeature = true,
  hasBulkActions = false
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImport) {
      onImport(file);
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Bulk actions - only shown when items are selected */}
      {hasBulkActions && selectedItems.length > 0 && (
        <div className="mr-2">
          <button
            onClick={() => onBulkDelete && onBulkDelete(selectedItems)}
            className="inline-flex items-center px-3 py-2 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            title="Delete selected items"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete ({selectedItems.length})
          </button>
        </div>
      )}

      {/* Create new button */}
      <button
        onClick={onCreateNew}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 mr-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        New Purchase
      </button>

      {/* More actions dropdown */}
      {(hasExportFeature || hasImportFeature) && (
        <div className="relative">
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            More
            <svg
              className="ml-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {showDropdown && (
            <div
              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
              onMouseLeave={() => setShowDropdown(false)}
            >
              <div className="py-1" role="menu" aria-orientation="vertical">
                {hasExportFeature && (
                  <button
                    className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => {
                      onExport && onExport();
                      setShowDropdown(false);
                    }}
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Export to CSV
                    </div>
                  </button>
                )}

                {hasImportFeature && (
                  <button
                    className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => {
                      triggerFileInput();
                      setShowDropdown(false);
                    }}
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      Import from CSV
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Hidden file input for import */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".csv"
          />
        </div>
      )}
    </div>
  );
};

export default PurchasesActions;