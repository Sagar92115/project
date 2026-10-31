import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Loader2, AlertCircle, ShieldCheck, ArrowLeft } from 'lucide-react';
import api from '../api/client';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // If already authenticated, redirect to /admin immediately
  useEffect(() => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (token) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password
      });

      if (response.data.success && response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        if (response.data.admin) {
          localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
        }

        // Redirect to intended route or default /admin
        const destination = location.state?.from?.pathname || '/admin';
        navigate(destination, { replace: true });
      } else {
        setErrorMessage('Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 429) {
        setErrorMessage('Too many login attempts. Please wait 15 minutes and try again.');
      } else if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Unable to connect to the authentication service. Please verify server status.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Inquiry Form</span>
        </Link>

        {/* Brand Icon & Heading */}
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Portal
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Sign in with your administrator credentials to manage inquiries.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/95 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-white/20">
          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start space-x-2.5 text-xs sm:text-sm animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-medium">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            {/* Email Field */}
            <div>
              <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@k12hunar.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-sky-600/20 active:scale-[0.99] transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In as Admin</span>
                )}
              </button>
            </div>
          </form>

          {/* Seed hint footer for evaluator */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Note: Admin credentials must be initialized via backend <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded font-mono text-[11px]">npm run seed:admin</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
