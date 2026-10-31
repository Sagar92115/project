import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange
}) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers array (with ellipsis if many pages)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
      <div className="text-xs sm:text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-800">{startItem}</span> to{' '}
        <span className="font-semibold text-slate-800">{endItem}</span> of{' '}
        <span className="font-semibold text-slate-800">{totalItems}</span> inquiries
      </div>

      <div className="flex items-center space-x-1.5">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`inline-flex items-center justify-center px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border transition-colors ${
            currentPage <= 1
              ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
              : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100'
          }`}
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span>Prev</span>
        </button>

        {/* Page Number Buttons */}
        <div className="hidden sm:flex items-center space-x-1">
          {getPageNumbers().map((pageNum, idx) => {
            if (pageNum === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 py-1 text-slate-400 text-xs">
                  ...
                </span>
              );
            }

            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[32px] h-8 text-xs font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-sky-600 text-white font-semibold shadow-sm shadow-sky-500/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Mobile simple page indicator */}
        <span className="sm:hidden text-xs text-slate-600 px-2 font-medium">
          {currentPage} / {totalPages}
        </span>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`inline-flex items-center justify-center px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border transition-colors ${
            currentPage >= totalPages
              ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
              : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100'
          }`}
          aria-label="Next Page"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
