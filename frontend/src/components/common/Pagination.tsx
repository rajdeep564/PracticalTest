import React from 'react';
import { PaginationInfo } from '../../types/pagination';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange, loading = false }) => {
  const { currentPage, totalPages, totalItems, itemsPerPage, hasNextPage, hasPrevPage } = pagination;

  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage && !loading) {
      onPageChange(page);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
      {/* Items info */}
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{startItem}</span> to{' '}
        <span className="font-medium">{endItem}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-2">
        {/* Previous button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={!hasPrevPage || loading}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            !hasPrevPage || loading
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
          }`}
        >
          Previous
        </button>

        {/* First page */}
        {getPageNumbers()[0] > 1 && (
          <>
            <button
              onClick={() => handlePageClick(1)}
              disabled={loading}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                loading
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              1
            </button>
            {getPageNumbers()[0] > 2 && (
              <span className="px-2 py-2 text-sm text-gray-500">...</span>
            )}
          </>
        )}

        {/* Page numbers */}
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            disabled={loading}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              page === currentPage
                ? 'bg-indigo-600 text-white'
                : loading
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Last page */}
        {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
          <>
            {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
              <span className="px-2 py-2 text-sm text-gray-500">...</span>
            )}
            <button
              onClick={() => handlePageClick(totalPages)}
              disabled={loading}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                loading
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={!hasNextPage || loading}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            !hasNextPage || loading
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const paginationExports = {
  Pagination,
};

export default paginationExports;
