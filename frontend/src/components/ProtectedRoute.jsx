import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Route protection wrapper.
 * Redirects unauthenticated users attempting to access /admin to /admin/login.
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
