import React, { useState, useEffect, useCallback } from 'react';
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Layers,
  Check
} from 'lucide-react';
import api from '../api/client';
import Navbar from '../components/Navbar';
import Filters from '../components/Filters';
import InquiryTable from '../components/InquiryTable';
import Pagination from '../components/Pagination';

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Filter states
  const [category, setCategory] = useState('All');
  const [userType, setUserType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // UI status states
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Fetch inquiries from backend
  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit
      };

      if (category && category !== 'All') {
        params.category = category;
      }
      if (userType && userType !== 'All') {
        params.userType = userType;
      }
      if (searchTerm && searchTerm.trim() !== '') {
        params.search = searchTerm.trim();
      }

      const response = await api.get('/inquiries', { params });

      if (response.data && response.data.data) {
        setInquiries(response.data.data);
        setTotal(response.data.total || 0);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      showNotification('Failed to load inquiries. Please check your connection.', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, category, userType, searchTerm]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Display toast notification for 4 seconds
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  // Status Change Handler with optimistic updates
  const handleStatusChange = async (inquiryId, newStatus) => {
    const previousInquiries = [...inquiries];

    // Optimistically update status in state
    setInquiries((prev) =>
      prev.map((item) => (item.id === inquiryId ? { ...item, status: newStatus } : item))
    );
    setUpdatingId(inquiryId);

    try {
      const response = await api.patch(`/inquiries/${inquiryId}/status`, {
        status: newStatus
      });

      if (response.data?.success) {
        showNotification(`Inquiry status updated to "${newStatus}"`, 'success');
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      // Revert optimistic update on failure
      setInquiries(previousInquiries);
      showNotification(
        err.response?.data?.message || 'Failed to update status. Please try again.',
        'error'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter change handlers (reset to page 1)
  const handleCategoryChange = (val) => {
    setCategory(val);
    setPage(1);
  };

  const handleUserTypeChange = (val) => {
    setUserType(val);
    setPage(1);
  };

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setPage(1);
  };

  const handleClearFilters = () => {
    setCategory('All');
    setUserType('All');
    setSearchTerm('');
    setPage(1);
  };

  // Count metrics for quick overview
  const countNew = inquiries.filter((i) => i.status === 'New').length;
  const countInProgress = inquiries.filter((i) => i.status === 'In Progress').length;
  const countResolved = inquiries.filter((i) => i.status === 'Resolved').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Floating Notification Toast */}
        {notification && (
          <div
            className={`fixed bottom-5 right-5 z-50 max-w-md px-4 py-3 rounded-2xl shadow-xl border flex items-center space-x-3 transition-all animate-fadeIn ${
              notification.type === 'success'
                ? 'bg-slate-900 text-white border-slate-700'
                : 'bg-rose-900 text-white border-rose-700'
            }`}
          >
            {notification.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
            )}
            <p className="text-xs sm:text-sm font-medium">{notification.message}</p>
          </div>
        )}

        {/* Dashboard Title & Overview Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Inquiry Management
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                Admin
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Review, filter, and update the status of public admissions, scholarships, and queries.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => fetchInquiries()}
              disabled={loading}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
              title="Refresh Inquiries"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Quick Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {/* Total Inquiries */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total Inquiries</p>
              <p className="text-lg sm:text-xl font-bold text-slate-900">{total}</p>
            </div>
          </div>

          {/* New Inquiries */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">New (Current Page)</p>
              <p className="text-lg sm:text-xl font-bold text-blue-700">{countNew}</p>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">In Progress</p>
              <p className="text-lg sm:text-xl font-bold text-amber-700">{countInProgress}</p>
            </div>
          </div>

          {/* Resolved */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Resolved</p>
              <p className="text-lg sm:text-xl font-bold text-emerald-700">{countResolved}</p>
            </div>
          </div>
        </div>

        {/* Filters and Search Component */}
        <Filters
          category={category}
          onCategoryChange={handleCategoryChange}
          userType={userType}
          onUserTypeChange={handleUserTypeChange}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onClearFilters={handleClearFilters}
          totalResults={total}
        />

        {/* Inquiry Table */}
        <InquiryTable
          inquiries={inquiries}
          loading={loading}
          onStatusChange={handleStatusChange}
          updatingId={updatingId}
        />

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          pageSize={limit}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </main>
    </div>
  );
}
