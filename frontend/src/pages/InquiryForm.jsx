import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, User, Mail, Phone, MessageSquare, Sparkles, Building, Loader2 } from 'lucide-react';
import api from '../api/client';
import Navbar from '../components/Navbar';

const USER_TYPES = ['Parent', 'Student', 'School'];
const CATEGORIES = ['Scholarship', 'Concert', 'Admission', 'General Query'];

export default function InquiryForm() {
  const [formData, setFormData] = useState({
    user_type: 'Student',
    category: 'Admission',
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverSuccess, setServerSuccess] = useState(null);
  const [serverError, setServerError] = useState(null);

  // Validate fields on client-side before submission
  const validateForm = () => {
    const errors = {};

    if (!formData.user_type || !USER_TYPES.includes(formData.user_type)) {
      errors.user_type = 'Please select a valid user type.';
    }

    if (!formData.category || !CATEGORIES.includes(formData.category)) {
      errors.category = 'Please select a valid inquiry category.';
    }

    if (!formData.name.trim()) {
      errors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }

    const cleanPhone = formData.phone.trim();
    if (!cleanPhone) {
      errors.phone = 'Phone number is required.';
    } else if (!/^[0-9]{10}$/.test(cleanPhone)) {
      errors.phone = 'Phone number must be exactly 10 digits.';
    }

    if (!formData.message.trim()) {
      errors.message = 'Inquiry message is required.';
    } else if (formData.message.trim().length < 5) {
      errors.message = 'Message must be at least 5 characters.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-level error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerSuccess(null);
    setServerError(null);

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const response = await api.post('/inquiries', formData);

      setServerSuccess(
        response.data.message || 'Your inquiry has been submitted successfully! Our counseling team will reach out soon.'
      );

      // Reset form on success
      setFormData({
        user_type: 'Student',
        category: 'Admission',
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      setFieldErrors({});
    } catch (err) {
      console.error('Inquiry submission error:', err);

      if (err.response?.data?.errors) {
        // Map backend express-validator errors to fields
        const mappedErrors = {};
        err.response.data.errors.forEach((e) => {
          mappedErrors[e.field] = e.message;
        });
        setFieldErrors(mappedErrors);
        setServerError(err.response.data.message || 'Please correct the highlighted fields.');
      } else {
        setServerError(
          err.response?.data?.message || 'Failed to submit inquiry. Please check your network connection and try again.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50/20 to-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Hero Section */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-sky-100/80 border border-sky-200 text-sky-800 text-xs font-semibold mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>K12 Hunar Education Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Submit an Inquiry
          </h1>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Have questions regarding scholarships, upcoming musical concerts, student admissions, or general queries?
            Fill out the form below and our advisors will get back to you within 24 hours.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 sm:p-10 transition-all">
          {/* Success Banner */}
          {serverSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start space-x-3 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Thank you for contacting us!</p>
                <p className="text-xs text-emerald-700 mt-0.5">{serverSuccess}</p>
              </div>
            </div>
          )}

          {/* General Server Error Banner */}
          {serverError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start space-x-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Submission Error</p>
                <p className="text-xs text-rose-700 mt-0.5">{serverError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Row 1: User Type & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {/* User Type */}
              <div>
                <label htmlFor="user_type" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  I am a <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="user_type"
                    name="user_type"
                    value={formData.user_type}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      fieldErrors.user_type
                        ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                        : 'border-slate-300 focus:ring-sky-500/20 focus:border-sky-500'
                    }`}
                  >
                    {USER_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                {fieldErrors.user_type && (
                  <p className="mt-1.5 text-xs text-rose-600 font-medium">{fieldErrors.user_type}</p>
                )}
              </div>

              {/* Inquiry Category */}
              <div>
                <label htmlFor="category" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Inquiry Category <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      fieldErrors.category
                        ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                        : 'border-slate-300 focus:ring-sky-500/20 focus:border-sky-500'
                    }`}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                {fieldErrors.category && (
                  <p className="mt-1.5 text-xs text-rose-600 font-medium">{fieldErrors.category}</p>
                )}
              </div>
            </div>

            {/* Row 2: Full Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Priya Sharma"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.name
                      ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                      : 'border-slate-300 focus:ring-sky-500/20 focus:border-sky-500'
                  }`}
                />
              </div>
              {fieldErrors.name && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">{fieldErrors.name}</p>
              )}
            </div>

            {/* Row 3: Email & Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      fieldErrors.email
                        ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                        : 'border-slate-300 focus:ring-sky-500/20 focus:border-sky-500'
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1.5 text-xs text-rose-600 font-medium">{fieldErrors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Phone Number (10 Digits) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      fieldErrors.phone
                        ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                        : 'border-slate-300 focus:ring-sky-500/20 focus:border-sky-500'
                    }`}
                  />
                </div>
                {fieldErrors.phone ? (
                  <p className="mt-1.5 text-xs text-rose-600 font-medium">{fieldErrors.phone}</p>
                ) : (
                  <p className="mt-1 text-xs text-slate-400">Enter a 10-digit mobile number</p>
                )}
              </div>
            </div>

            {/* Row 4: Message */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="message" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Your Message / Query <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs text-slate-400">
                  {formData.message.length}/2000 chars
                </span>
              </div>
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  maxLength={2000}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please describe your query in detail so we can best assist you..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 transition-all leading-relaxed ${
                    fieldErrors.message
                      ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                      : 'border-slate-300 focus:ring-sky-500/20 focus:border-sky-500'
                  }`}
                />
              </div>
              {fieldErrors.message && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">{fieldErrors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto min-w-[200px] inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-sky-600/25 hover:shadow-sky-600/35 active:scale-[0.99] transition-all"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <p>© 2026 K12 Hunar. All rights reserved. EdTech CRM & Inquiry System.</p>
      </footer>
    </div>
  );
}
