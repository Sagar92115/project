import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, LogOut, User, FileText, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  let adminEmail = '';
  try {
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
    adminEmail = adminUser.email || '';
  } catch (e) {
    adminEmail = '';
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">K12 Hunar</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  CRM
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Inquiry Management System</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              to="/"
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Inquiry Form</span>
            </Link>

            {token ? (
              <>
                <Link
                  to="/admin"
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === '/admin'
                      ? 'bg-sky-50 text-sky-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <div className="hidden md:flex items-center space-x-2 pl-3 border-l border-slate-200 text-xs text-slate-600">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium truncate max-w-[150px]">{adminEmail || 'Admin'}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors border border-transparent hover:border-rose-200"
                  title="Sign out of Admin Dashboard"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
              >
                <span>Admin Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
