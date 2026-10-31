import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import InquiryForm from './pages/InquiryForm';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Inquiry Submission Route */}
        <Route path="/" element={<InquiryForm />} />

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Dashboard Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect to public page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
