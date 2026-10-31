import React, { useState } from 'react';
import { Mail, Phone, Calendar, Clock, MessageSquare, AlertCircle, ChevronDown, CheckCircle2, Loader2, X } from 'lucide-react';

const STATUS_OPTIONS = ['New', 'In Progress', 'Resolved'];

export default function InquiryTable({
  inquiries,
  loading,
  onStatusChange,
  updatingId
}) {
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/10';
      case 'In Progress':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/10';
    }
  };

  // Category badge styling
  const getCategoryBadge = (category) => {
    switch (category) {
      case 'Scholarship':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Admission':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Concert':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // User type badge styling
  const getUserTypeBadge = (type) => {
    switch (type) {
      case 'Parent':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'Student':
        return 'text-teal-700 bg-teal-50 border-teal-200';
      case 'School':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
        <div className="flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
          <p className="text-sm font-medium text-slate-600">Loading inquiries from database...</p>
        </div>
      </div>
    );
  }

  if (!inquiries || inquiries.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">No Inquiries Found</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          No records match your selected filters or search query. Try resetting filters or submitting a new inquiry.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Responsive Table with horizontal scroll on mobile */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th scope="col" className="py-3.5 px-4 sm:px-6">Candidate / Contact</th>
                <th scope="col" className="py-3.5 px-4">User Type</th>
                <th scope="col" className="py-3.5 px-4">Category</th>
                <th scope="col" className="py-3.5 px-4">Message</th>
                <th scope="col" className="py-3.5 px-4">Date Submitted</th>
                <th scope="col" className="py-3.5 px-4 sm:px-6">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {inquiries.map((inquiry) => {
                const isUpdating = updatingId === inquiry.id;

                return (
                  <tr
                    key={inquiry.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* Name & Contact Details */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-semibold text-slate-900">{inquiry.name}</div>
                      <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-slate-500">
                        <a
                          href={`mailto:${inquiry.email}`}
                          className="inline-flex items-center hover:text-sky-600 transition-colors"
                          title="Send Email"
                        >
                          <Mail className="w-3 h-3 mr-1 text-slate-400" />
                          <span>{inquiry.email}</span>
                        </a>
                        <a
                          href={`tel:${inquiry.phone}`}
                          className="inline-flex items-center hover:text-sky-600 transition-colors"
                          title="Call"
                        >
                          <Phone className="w-3 h-3 mr-1 text-slate-400" />
                          <span>{inquiry.phone}</span>
                        </a>
                      </div>
                    </td>

                    {/* User Type */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getUserTypeBadge(
                          inquiry.user_type
                        )}`}
                      >
                        {inquiry.user_type}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryBadge(
                          inquiry.category
                        )}`}
                      >
                        {inquiry.category}
                      </span>
                    </td>

                    {/* Message Preview with View Button */}
                    <td className="py-4 px-4 max-w-xs">
                      <div className="flex items-start space-x-2">
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {inquiry.message}
                        </p>
                        {inquiry.message && inquiry.message.length > 50 && (
                          <button
                            onClick={() => setSelectedMessage(inquiry)}
                            className="text-xs text-sky-600 hover:text-sky-700 font-medium whitespace-nowrap underline shrink-0"
                          >
                            View
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Date Submitted */}
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(inquiry.created_at)}</span>
                      </div>
                    </td>

                    {/* Inline Status Dropdown */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <div className="relative inline-block text-left">
                        <div className="flex items-center space-x-2">
                          <select
                            disabled={isUpdating}
                            value={inquiry.status}
                            onChange={(e) => onStatusChange(inquiry.id, e.target.value)}
                            className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border appearance-none pr-7 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all ${getStatusBadge(
                              inquiry.status
                            )} ${isUpdating ? 'opacity-50 cursor-wait' : ''}`}
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status} className="bg-white text-slate-800">
                                {status}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute right-2 flex items-center text-current opacity-70">
                            {isUpdating ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal for Reading Full Inquiry */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-semibold text-slate-900">
                  Inquiry Message Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-500">Candidate:</span>{' '}
                  <span className="font-medium text-slate-800">{selectedMessage.name}</span>
                </div>
                <div>
                  <span className="text-slate-500">Category:</span>{' '}
                  <span className="font-medium text-slate-800">{selectedMessage.category}</span>
                </div>
                <div>
                  <span className="text-slate-500">Email:</span>{' '}
                  <span className="font-medium text-slate-800">{selectedMessage.email}</span>
                </div>
                <div>
                  <span className="text-slate-500">Phone:</span>{' '}
                  <span className="font-medium text-slate-800">{selectedMessage.phone}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                  Full Query
                </label>
                <div className="bg-slate-50/80 p-4 rounded-xl text-slate-700 whitespace-pre-wrap leading-relaxed border border-slate-100 max-h-60 overflow-y-auto">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
