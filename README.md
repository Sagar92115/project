# EdTech CRM & Inquiry Management System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://edtech-crm-three.vercel.app/)
[![Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Sagar92115/project)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

An enterprise-grade, full-stack Inquiry Management and CRM platform engineered for educational institutions and platforms. The system provides an intuitive, accessible public portal for prospective students, parents, and schools to submit queries across academic and extracurricular programs. An authenticated administrative dashboard allows admissions and operations teams to review, search, filter, paginate, and track inquiry lifecycles in real time.

Built as a production monorepo adhering strictly to clean architectural principles, secure custom JWT authentication, parameterized SQL query practices, and responsive modern UI design.

---

## 🔗 Project Links & Deployments

| Component | Platform | URL |
| :--- | :--- | :--- |
| **Frontend Web Application** | Vercel | [https://edtech-crm-three.vercel.app/](https://edtech-crm-three.vercel.app/) |
| **Backend REST API** | Render | `https://<your-render-service-name>.onrender.com` *(Render Web Service)* |
| **API Health Check** | Render | `https://<your-render-service-name>.onrender.com/api/health` |
| **Source Code Repository** | GitHub | [https://github.com/Sagar92115/project](https://github.com/Sagar92115/project) |

---

## 📸 Application Screenshots

| Public Inquiry Submission Form | Admin Authentication Portal |
| :---: | :---: |
| ![Public Inquiry Form](https://raw.githubusercontent.com/Sagar92115/project/main/docs/screenshots/inquiry-form.png)<br>*Accessible public portal with real-time field validation* | ![Admin Login](https://raw.githubusercontent.com/Sagar92115/project/main/docs/screenshots/admin-login.png)<br>*Secure administrative authentication with custom JWT* |

| Admin CRM Inquiry Management | Inquiry Inspection & Status Lifecycle |
| :---: | :---: |
| ![Admin Dashboard](https://raw.githubusercontent.com/Sagar92115/project/main/docs/screenshots/admin-dashboard.png)<br>*Filterable, searchable inquiry table with metric cards* | ![Status Modal](https://raw.githubusercontent.com/Sagar92115/project/main/docs/screenshots/status-modal.png)<br>*Real-time status updater & full inquiry message view* |

> *Note: Place your screenshot image files inside a `/docs/screenshots/` directory to render them directly in the repository.*

---

## 🚀 Key Features

### 1. Public Inquiry Portal (`/`)
- **Responsive Card Layout**: Polished, mobile-friendly interface designed with accessible form elements and high-contrast typography.
- **Categorization & Profiling**:
  - **User Types**: `Parent`, `Student`, `School`.
  - **Inquiry Categories**: `Scholarship`, `Concert`, `Admission`, `General Query`.
- **Strict Client-Side & Server-Side Validation**:
  - **Full Name**: Required, trimmed, minimum 2 characters.
  - **Email Address**: Validated against standard email formats and normalized.
  - **Phone Number**: Strictly validated to exactly 10 numeric digits.
  - **Query Message**: Required, multiline textarea (5–2000 characters) with a live character counter.
- **Interactive UX States**:
  - Contextual inline error messages underneath invalidated fields.
  - Submission button displays an animated spinner and is disabled during pending requests to prevent duplicate submissions.
  - Success banner upon submission with automated form state reset.
  - Informative server error banners when network or database issues occur.
- **Abuse Prevention**: Public POST inquiries endpoint is protected by an IP-based rate limiter (20 requests per 15 minutes).

### 2. Admin Authentication & Security (`/admin/login`)
- **Custom JWT Implementation**: Complete token-based authentication implemented from scratch using `jsonwebtoken` and `bcrypt`.
- **Zero Third-Party Auth Dependencies**: Built without reliance on Supabase Auth, client SDKs, or Supabase Row-Level Security (RLS) for authentication. Supabase functions strictly as standard PostgreSQL.
- **Bcrypt Password Hashing**: Cryptographic password hashing utilizing 10 salt rounds.
- **Timing-Safe Responses**: Protects against user enumeration by returning a generic `"Invalid credentials"` message on any authentication failure.
- **Brute-Force Rate Limiting**: The login endpoint is capped at 10 requests per 15-minute window per IP.
- **Session Verification**: Express middleware (`authenticateToken`) validates the `Authorization: Bearer <token>` header, while client-side `ProtectedRoute` guards private routes and automatically destroys stale tokens on `401 Unauthorized`.

### 3. Admin CRM Dashboard (`/admin`)
- **Comprehensive Tabular View**: Displays Candidate Name, Contact Information (clickable email and phone links), User Type badge, Category badge, Formatted Submission Timestamp, and Current Status.
- **Real-Time Lifecycle Tracking**: Inline dropdown allows instant switching between `New`, `In Progress`, and `Resolved` statuses via `PATCH /api/inquiries/:id/status` with optimistic UI updates and rollback protection.
- **Multi-Parameter Filtering**:
  - Filter by Category (`Scholarship`, `Concert`, `Admission`, `General Query`).
  - Filter by User Type (`Parent`, `Student`, `School`).
  - **Debounced Search**: Search input with a 400ms debounce that matches candidate names or phone numbers using case-insensitive SQL `ILIKE`.
  - **One-Click Filter Reset**: Quickly clears all filters and returns to the unfiltered view.
- **Server-Side Pagination**: Efficient database-level pagination supporting configurable limits, total counts, and page indicators.
- **Detailed Inquiry Modal**: Dedicated inspection modal allowing administrators to read lengthy inquiry texts without breaking tabular layout.
- **Metric Cards**: Real-time summary tiles showcasing total inquiries along with active counts on the current view.

---

## 🛠️ Complete Technology Stack

```
Frontend:   React 18 + Vite 6 + Tailwind CSS 3 + React Router v6 + Axios + Lucide Icons
Backend:    Node.js (v18+) + Express.js 4 + PostgreSQL Driver (pg)
Security:   Custom JWT (jsonwebtoken) + Bcrypt + Helmet + Express Rate Limit + Express Validator + CORS
Database:   PostgreSQL (Supabase-hosted, accessed via standard connection pooler with SSL)
Hosting:    Vercel (Frontend SPA) + Render (Backend Web Service)
```

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 (Vite 6) | Component-based, lightning-fast client interface with Hot Module Replacement |
| **Styling & Icons** | Tailwind CSS 3, Lucide React | Utility-first responsive styling and modern SVG iconography |
| **Routing & Client API** | React Router v6, Axios | SPA client routing, Axios interceptors for JWT injection and 401 redirection |
| **Server Framework** | Node.js, Express.js | Scalable REST API architecture with modular routers and controllers |
| **Database & Client** | PostgreSQL, `pg` (node-postgres) | Relational persistence, connection pooling, SSL enforcement |
| **Authentication** | `jsonwebtoken`, `bcrypt` | Custom JWT generation/verification, 10-round salted password hashing |
| **Validation & Security** | `express-validator`, `helmet`, `cors`, `express-rate-limit` | Input sanitization, HTTP security headers, CORS origin whitelisting, IP rate limiting |
| **Monorepo Tooling** | `concurrently` | Unified parallel development script running backend and frontend simultaneously |

---

## 📂 Project Architecture & Monorepo Structure

```text
edtech-crm/
├── .gitignore                     # Ignores node_modules, local .env, dist, build, logs
├── package.json                   # Root monorepo orchestration scripts
├── package-lock.json
├── README.md                      # Project documentation and developer guide
├── backend/
│   ├── .env.example               # Backend environment variable template
│   ├── package.json               # Backend dependencies and execution scripts
│   ├── schema.sql                 # PostgreSQL DDL table definitions, CHECK constraints, and indexes
│   ├── server.js                  # Main Express application initialization and middleware chain
│   └── src/
│       ├── config/
│       │   └── db.js              # PostgreSQL connection pool with robust SSL configuration
│       ├── controllers/
│       │   ├── auth.controller.js # Authentication controller (login, token issuance, session check)
│       │   └── inquiry.controller.js # Public submission, parameterized filtering, status update
│       ├── middleware/
│       │   ├── auth.middleware.js # Authorization Bearer token validation middleware
│       │   ├── error.middleware.js# Centralized 404 and global 500 error handlers
│       │   └── validate.middleware.js # express-validator error extractor
│       ├── routes/
│       │   ├── auth.routes.js     # /api/auth route definitions
│       │   └── inquiry.routes.js  # /api/inquiries route definitions
│       └── scripts/
│           ├── initDb.js          # Automated database schema execution script
│           ├── seedAdmin.js       # Admin account creation script using bcrypt
│           └── verifyBackend.js   # Automated API verification test suite
└── frontend/
    ├── .env.example               # Frontend environment variable template
    ├── index.html                 # Single Page Application HTML shell
    ├── package.json               # Frontend dependencies and Vite build scripts
    ├── postcss.config.js          # PostCSS configuration for Tailwind CSS
    ├── tailwind.config.js         # Tailwind styling and custom palette extensions
    ├── vercel.json                # SPA rewrite rule for client-side routing
    ├── vite.config.js             # Vite configuration and React plugin setup
    └── src/
        ├── api/
        │   └── client.js          # Axios client with request & response interceptors
        ├── components/
        │   ├── Filters.jsx        # Category, user type, and debounced search filter bar
        │   ├── InquiryTable.jsx   # Data table with inline status dropdown and inquiry modal
        │   ├── Navbar.jsx         # Header navigation bar with session details and logout
        │   ├── Pagination.jsx     # Dynamic pagination controls with range calculation
        │   └── ProtectedRoute.jsx # Authentication guard for private administrative routes
        ├── pages/
        │   ├── AdminDashboard.jsx # Protected inquiry management portal
        │   ├── AdminLogin.jsx     # Admin authentication portal with visibility toggling
        │   └── InquiryForm.jsx    # Public-facing inquiry submission portal
        ├── App.jsx                # React Router hierarchy
        ├── index.css              # Tailwind base imports and scrollbar styles
        └── main.jsx               # React DOM entry point
```

---

## 🗄️ Database Setup (Supabase PostgreSQL)

The application utilizes PostgreSQL. While hosted on Supabase, the application interacts with it strictly as a standard relational database through standard TCP connection strings using the `pg` client.

### 1. Database Creation
1. Create a project at [Supabase](https://supabase.com).
2. Note your database password and retrieve your **PostgreSQL Connection String (URI)** from **Project Settings → Database → Connection String**.

### 2. Schema Definition (`backend/schema.sql`)
The database contains two core tables, custom CHECK constraints, and optimized B-Tree indexes:

```sql
-- Enable pgcrypto for UUID generation
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

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_inquiries_category ON inquiries (category);
CREATE INDEX IF NOT EXISTS idx_inquiries_user_type ON inquiries (user_type);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries (status);
```

### 3. Initializing the Database
You can initialize the database using either of the following methods:
- **Automated CLI Execution**: Set `DATABASE_URL` in `backend/.env` and execute:
  ```bash
  npm run db:init
  ```
- **Supabase SQL Editor**: Open the Supabase dashboard, navigate to the **SQL Editor**, paste the contents of `backend/schema.sql`, and click **Run**.

---

## 💻 Local Installation & Execution

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- Access to a PostgreSQL instance (Supabase or local)

### Step 1: Clone Repository
```bash
git clone https://github.com/Sagar92115/project.git
cd project
```

### Step 2: Configure Environment Variables
Create the environment files in both the `backend/` and `frontend/` directories:

**Backend (`backend/.env`):**
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:5432/<DB_NAME>?sslmode=require
JWT_SECRET=your_custom_jwt_secret_min_32_characters_long
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Install Dependencies
Install dependencies for both projects in one step from the root directory:
```bash
npm run install:all
```
*(Alternatively, run `npm install` inside `/backend` and `/frontend` individually).*

### Step 4: Initialize Database & Seed Administrator
Run the automated schema initializer and admin seeding scripts:
```bash
# Creates the database tables, constraints, and indexes
npm run db:init

# Hashes the password using bcrypt and registers the admin
npm run seed:admin
```

### Step 5: Run Automated Tests
Verify that all API routes, validation rules, and authentication middlewares function correctly:
```bash
npm test
```

### Step 6: Start Development Environment
Launch both backend and frontend concurrently with a single command from the monorepo root:
```bash
npm run dev
```
- **Frontend Portal**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **API Health Check**: `http://localhost:5000/api/health`

---

## ⚙️ Environment Variables Documentation

### Backend (`/backend/.env`)

| Variable | Required | Type | Description | Safe Example Placeholder |
| :--- | :---: | :---: | :--- | :--- |
| `PORT` | Optional | Number | Port on which the Express server listens (default: `5000`) | `5000` |
| `NODE_ENV` | Optional | String | Runtime environment (`development`, `production`, `test`) | `development` |
| `DATABASE_URL` | **Yes** | String | PostgreSQL connection URI with SSL configuration | `postgresql://<username>:<password>@<host>:5432/<database>?sslmode=require` |
| `JWT_SECRET` | **Yes** | String | Cryptographic secret key used to sign and verify JWT tokens | `generate_a_random_32_char_secret_key` |
| `JWT_EXPIRES_IN` | Optional | String | Expiration duration for issued JWT tokens | `1d` |
| `FRONTEND_URL` | **Yes** | String | Whitelisted CORS origin(s), comma-separated for multiple | `http://localhost:5173,https://<your-app>.vercel.app` |
| `ADMIN_EMAIL` | **Yes** | String | Administrative email account used by `npm run seed:admin` | `admin@example.com` |
| `ADMIN_PASSWORD` | **Yes** | String | Plaintext password to hash and store during admin seeding | `your_strong_admin_password` |

### Frontend (`/frontend/.env`)

| Variable | Required | Type | Description | Safe Example Placeholder |
| :--- | :---: | :---: | :--- | :--- |
| `VITE_API_URL` | **Yes** | String | Base URL of the backend API endpoints | `http://localhost:5000/api` |

---

## 📡 Complete REST API Documentation

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Access**: Public
- **Description**: Verifies API availability and returns server timestamp.
- **Response** (`200 OK`):
  ```json
  {
    "status": "ok",
    "service": "EdTech CRM & Inquiry System API",
    "timestamp": "2026-10-31T14:30:00.000Z"
  }
  ```

---

### 2. Submit Public Inquiry
- **Endpoint**: `POST /api/inquiries`
- **Access**: Public (Rate-limited: 20 requests per 15 min per IP)
- **Request Body**:
  ```json
  {
    "user_type": "Parent",
    "category": "Admission",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "9876543210",
    "message": "Inquiring about admission criteria for the upcoming academic session."
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "message": "Inquiry submitted successfully. Our team will contact you shortly.",
    "data": {
      "id": "b78b549c-36bc-49a8-971c-17c417f60a12",
      "user_type": "Parent",
      "category": "Admission",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "phone": "9876543210",
      "message": "Inquiring about admission criteria for the upcoming academic session.",
      "status": "New",
      "created_at": "2026-10-31T14:31:00.000Z"
    }
  }
  ```

---

### 3. Admin Authentication (Login)
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public (Rate-limited: 10 attempts per 15 min per IP)
- **Request Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "your_admin_password"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "971c9feb-bbac-44bc-9e81-c3817c417f60",
      "email": "admin@example.com"
    }
  }
  ```

---

### 4. Verify Admin Session
- **Endpoint**: `GET /api/auth/me`
- **Access**: Protected (Requires `Authorization: Bearer <token>`)
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "admin": {
      "id": "971c9feb-bbac-44bc-9e81-c3817c417f60",
      "email": "admin@example.com"
    }
  }
  ```

---

### 5. Fetch Inquiries with Filtering, Search & Pagination
- **Endpoint**: `GET /api/inquiries`
- **Access**: Protected (Requires `Authorization: Bearer <token>`)
- **Query Parameters**:
  - `page` *(optional, default: 1)*: Current page number.
  - `limit` *(optional, default: 10, max: 100)*: Records per page.
  - `category` *(optional)*: Filter by `Scholarship`, `Concert`, `Admission`, or `General Query`.
  - `userType` *(optional)*: Filter by `Parent`, `Student`, or `School`.
  - `search` *(optional)*: Case-insensitive search on candidate name or phone.
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "b78b549c-36bc-49a8-971c-17c417f60a12",
        "user_type": "Parent",
        "category": "Admission",
        "name": "Jane Doe",
        "email": "jane.doe@example.com",
        "phone": "9876543210",
        "message": "Inquiring about admission criteria...",
        "status": "New",
        "created_at": "2026-10-31T14:31:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "totalPages": 1,
    "limit": 10
  }
  ```

---

### 6. Update Inquiry Status
- **Endpoint**: `PATCH /api/inquiries/:id/status`
- **Access**: Protected (Requires `Authorization: Bearer <token>`)
- **URL Parameter**: `id` (UUID)
- **Request Body**:
  ```json
  {
    "status": "In Progress"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Inquiry status updated to In Progress",
    "data": {
      "id": "b78b549c-36bc-49a8-971c-17c417f60a12",
      "status": "In Progress"
    }
  }
  ```

---

## 🧪 Testing & Verification Guide

### 1. Automated Test Suite
The repository includes an automated testing script (`backend/src/scripts/verifyBackend.js`) validating health endpoints, authentication middleware, validation guards, 10-digit phone enforcement, and 404 responses.
```bash
npm test
```

### 2. Manual Verification using `curl`

#### Step A: Health Check
```bash
curl -X GET http://localhost:5000/api/health
```

#### Step B: Public Inquiry Submission
```bash
curl -X POST http://localhost:5000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "user_type": "Student",
    "category": "Scholarship",
    "name": "Alex Smith",
    "email": "alex@example.com",
    "phone": "9876543210",
    "message": "Applying for the merit-based scholarship."
  }'
```

#### Step C: Protected Endpoint Without Token (Expect `401 Unauthorized`)
```bash
curl -X GET http://localhost:5000/api/inquiries
```

#### Step D: Admin Authentication (Retrieve JWT)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your_secure_admin_password"
  }'
```

#### Step E: Fetch Inquiries with Bearer Token
```bash
curl -X GET "http://localhost:5000/api/inquiries?page=1&limit=10" \
  -H "Authorization: Bearer <PASTE_TOKEN_HERE>"
```

#### Step F: Update Status of an Inquiry
```bash
curl -X PATCH http://localhost:5000/api/inquiries/<INQUIRY_UUID>/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <PASTE_TOKEN_HERE>" \
  -d '{"status": "Resolved"}'
```

---

## ☁️ Production Deployment Instructions

### A. Deploy Backend to Render

1. Log into your account on [Render](https://render.com).
2. Click **New +** → **Web Service**.
3. Select and connect your repository: `https://github.com/Sagar92115/project`.
4. Configure service settings:
   - **Name**: `edtech-crm-api` *(or preferred identifier)*
   - **Root Directory**: `backend` *(Critical: specifies the backend subfolder)*
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Configure Environment Variables in Render:
   - `DATABASE_URL`: `postgresql://<user>:<password>@<host>:5432/<database>?sslmode=require`
   - `JWT_SECRET`: *(Generate a secure random string of 32+ characters)*
   - `JWT_EXPIRES_IN`: `1d`
   - `FRONTEND_URL`: `https://edtech-crm-three.vercel.app` *(Include localhost for local dev if desired)*
   - `ADMIN_EMAIL`: `admin@example.com`
   - `ADMIN_PASSWORD`: `your_secure_admin_password`
6. Click **Create Web Service**.
7. Once deployed, open Render's **Shell** tab and run:
   ```bash
   npm run seed:admin
   ```
8. Copy your live Render API URL: `https://<your-backend-app>.onrender.com`.

---

### B. Deploy Frontend to Vercel

1. Log into [Vercel](https://vercel.com).
2. Click **Add New...** → **Project** and import `Sagar92115/project`.
3. Configure the build parameters:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Edit and set to `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables**:
   - `VITE_API_URL`: `https://<your-backend-app>.onrender.com/api` *(Render URL + `/api`)*
5. Click **Deploy**.
6. The bundled [`frontend/vercel.json`](file:///frontend/vercel.json) automatically directs all SPA routes back to `/index.html`.

---

## 🔒 Security Best Practices

> [!CAUTION]
> **Credential & Secret Protection**:
> - Never commit `.env`, `.env.local`, or any file containing real database passwords, secret keys, or authentication tokens to version control.
> - The root `.gitignore` file explicitly excludes `.env`, `node_modules/`, `dist/`, and build artifacts.
> - Always utilize `.env.example` templates with generic placeholders for public repositories.
> - If any credential or database URI is accidentally exposed, immediately rotate the password in the database dashboard and invalidate previous tokens.

---

## 👨‍💻 Author & Project Information

- **Developer**: Sagar Patel
- **Contact Email**: ss5310785@gmail.com
- **GitHub Profile**: [@Sagar92115](https://github.com/Sagar92115)
- **Project Role**: Full-Stack Developer Assessment Submission
- **Target Organization**: K12 Hunar
- **License**: MIT
