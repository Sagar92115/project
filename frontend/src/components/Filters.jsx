import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';

const CATEGORIES = ['Scholarship', 'Concert', 'Admission', 'General Query'];
const USER_TYPES = ['Parent', 'Student', 'School'];

export default function Filters({
  category,
  onCategoryChange,
  userType,
  onUserTypeChange,
  searchTerm,
  onSearchChange,
  onClearFilters,
  totalResults
}) {
  // Local state for debounced search input
  const [localSearch, setLocalSearch] = useState(searchTerm || '');

  // Keep local search synchronized when parent resets search
  useEffect(() => {
    setLocalSearch(searchTerm || '');
  }, [searchTerm]);

  // Debounce search input by 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== searchTerm) {
        onSearchChange(localSearch);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [localSearch, searchTerm, onSearchChange]);

  const hasActiveFilters = Boolean(
    (category && category !== 'All') ||
    (userType && userType !== 'All') ||
    (localSearch && localSearch.trim() !== '')
  );

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-sky-600" />
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
            Filter & Search Inquiries
          </h2>
        </div>
        {typeof totalResults === 'number' && (
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full self-start sm:self-auto">
            {totalResults} {totalResults === 1 ? 'record found' : 'records found'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Search Input (Name or Phone) */}
        <div className="lg:col-span-2 relative">
          <label htmlFor="search" className="block text-xs font-medium text-slate-600 mb-1.5">
            Search Inquiries
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="search"
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by candidate name or phone..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-xs font-medium text-slate-600 mb-1.5">
            Inquiry Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-700"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* User Type Filter */}
        <div>
          <label htmlFor="userType" className="block text-xs font-medium text-slate-600 mb-1.5">
            User Type
          </label>
          <select
            id="userType"
            value={userType}
            onChange={(e) => onUserTypeChange(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-700"
          >
            <option value="All">All User Types</option>
            {USER_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => {
              setLocalSearch('');
              onClearFilters();
            }}
            className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors border border-slate-200/60 hover:border-rose-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
