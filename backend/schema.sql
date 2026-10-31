-- EdTech CRM & Inquiry System Database Schema
-- Compatible with Supabase PostgreSQL and standard PostgreSQL 13+
-- Run this in the Supabase SQL Editor to set up your tables and indexes.

-- Enable pgcrypto for gen_random_uuid() (included by default in modern Postgres)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: admins
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: inquiries
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_type TEXT NOT NULL CHECK (user_type IN ('Parent', 'Student', 'School')),
    category TEXT NOT NULL CHECK (category IN ('Scholarship', 'Concert', 'Admission', 'General Query')),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'In Progress', 'Resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for optimized querying and filtering on high-volume inquiry lookups
CREATE INDEX IF NOT EXISTS idx_inquiries_category ON inquiries (category);
CREATE INDEX IF NOT EXISTS idx_inquiries_user_type ON inquiries (user_type);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries (status);
