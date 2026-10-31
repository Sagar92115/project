# EdTech CRM & Inquiry System

A full-stack, production-ready Inquiry Management & CRM system designed for **K12 Hunar** (Internship Assessment). Anyone can submit inquiries across multiple categories and user types, while authorized administrators can securely log in, search, filter, paginate, and manage inquiry statuses in real time.

---

## 🔗 Live Links

| Service | Deployment Platform | URL |
| :--- | :--- | :--- |
| **GitHub Repository** | GitHub | [https://github.com/Sagar92115/project](https://github.com/Sagar92115/project) |
| **Frontend Application** | Vercel | `https://your-frontend-deployment.vercel.app` *(Placeholder)* |
| **Backend REST API** | Render | `https://your-backend-deployment.onrender.com` *(Placeholder)* |
| **API Health Check** | Render | `https://your-backend-deployment.onrender.com/api/health` *(Placeholder)* |

---

## 🔑 Demo Admin Credentials

> [!NOTE]  
> After running the seed command (`npm run seed:admin`), use these credentials to log into the Admin Portal at `/admin/login`:

- **Admin Email**: `admin@k12hunar.com` *(Configurable via `.env`)*
- **Admin Password**: `Admin@Secure2026!` *(Configurable via `.env`)*

---

## ✨ Features

### 1. Public Inquiry Portal (`/`)
- **Responsive Form**: Modern, accessible card interface with responsive layout.
- **Categorization**: Dropdowns for User Type (`Parent`, `Student`, `School`) and Category (`Scholarship`, `Concert`, `Admission`, `General Query`).
- **Validation**:
  - Full Name (required, min 2 chars).
  - Email (standard email regex validation & normalization).
  - Phone Number (strictly validated to exactly 10 numeric digits).
  - Query Message (required, 5–2000 chars with live counter).
- **UX States**: Inline field error highlights, disabled submit button with animated loader while submitting, success notification with automatic form reset, and backend error alerts.
- **Rate Limiting**: Public endpoint rate-limited to 20 inquiries per 15 minutes per IP to mitigate spam/abuse.

### 2. Admin Authentication & Security (`/admin/login`)
- **Custom JWT Authentication**: Implemented entirely from scratch in Node.js/Express with `jsonwebtoken` and `bcrypt`.
- **Zero Third-Party Auth Lock-in**: **Strictly NO Supabase Auth, SDK, or RLS** is used. Supabase is used purely as a PostgreSQL database via standard connection strings.
- **Timing-Safe Login**: Generic `"Invalid credentials"` response for any non-existent email or mismatched password.
- **Brute-Force Protection**: Strict rate limiter (10 attempts per 15 minutes per IP) on the login endpoint.
- **Protected Routes**: Custom Express middleware `authenticateToken` validates the `Authorization: Bearer <token>` header; React `ProtectedRoute` guards frontend routes and automatically clears expired sessions on `401 Unauthorized`.

### 3. Admin CRM Dashboard (`/admin`)
- **Tabular View**: Displays Candidate Name, Phone, Email, User Type, Category, Formatted Submission Date, and Current Status.
- **Live Status Updates**: Inline select dropdown (`New`, `In Progress`, `Resolved`) with color-coded status badges that triggers a `PATCH /api/inquiries/:id/status` update with optimistic UI feedback.
- **Search & Filtering**:
  - Filter by Category (`Scholarship`, `Concert`, `Admission`, `General Query`).
  - Filter by User Type (`Parent`, `Student`, `School`).
  - Search bar with **400ms debounce** matching Candidate Name or Phone number.
  - "Reset All Filters" button.
- **Pagination**: Server-side pagination with configurable page limits and item range metrics (`Showing 1 to 10 of X`).
- **Responsive Design**: Clean mobile responsiveness with horizontal table scrolling and a quick message inspection modal.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Axios, Lucide React |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (hosted on Supabase, connected via `pg` library) |
| **Security & Auth** | Custom JWT (`jsonwebtoken`), `bcrypt` (10 salt rounds), `helmet`, `express-rate-limit`, `express-validator`, `cors` |

---

## 📂 Project Structure

```text
edtech-crm/
├── .gitignore
├── README.md
├── backend/
│   ├── .env.example               # Backend environment template
│   ├── package.json
│   ├── schema.sql                 # Supabase PostgreSQL schema & indexes
│   ├── server.js                  # Main Express application entrypoint
│   └── src/
│       ├── config/
│       │   └── db.js              # pg connection pool (SSL enabled)
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   └── inquiry.controller.js
│       ├── middleware/
│       │   ├── auth.middleware.js # Bearer token verification
│       │   ├── error.middleware.js# Global error & 404 handler
│       │   └── validate.middleware.js # express-validator wrapper
│       ├── routes/
│       │   ├── auth.routes.js     # /api/auth/login, /api/auth/me
│       │   └── inquiry.routes.js  # /api/inquiries, status patch
│       └── scripts/
│           ├── seedAdmin.js       # Admin bcrypt seeding script
│           └── verifyBackend.js   # Automated API verification test suite
└── frontend/
    ├── .env.example               # Frontend environment template
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vercel.json                # SPA rewrite rule for client-side routing
    ├── vite.config.js
    └── src/
        ├── api/
        │   └── client.js          # Axios instance + interceptors (auth & 401 redirect)
        ├── components/
        │   ├── Filters.jsx        # Search + Category + UserType filter bar
        │   ├── InquiryTable.jsx   # Interactive table + inline status updater
        │   ├── Navbar.jsx         # Header navigation & logout
        │   ├── Pagination.jsx     # Dynamic pagination controls
        │   └── ProtectedRoute.jsx # Client-side route protection
        ├── pages/
        │   ├── AdminDashboard.jsx # Admin management portal
        │   ├── AdminLogin.jsx     # Admin authentication page
        │   └── InquiryForm.jsx    # Public submission form
        ├── App.jsx
        ├── index.css
        └── main.jsx
```

---

## 🚀 Full Local Setup Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v20/v24)
- **npm** v9+
- A free **Supabase** account (or local PostgreSQL)

### 2. Database Setup (Supabase)
1. Log in to [Supabase](https://supabase.com) and click **New project**.
2. Give your project a name (e.g. `k12-hunar-crm`) and set a strong database password.
3. Once provisioned, open the **SQL Editor** tab from the left sidebar.
4. Open the [`backend/schema.sql`](file:///backend/schema.sql) file from this repository, copy its content, paste it into the Supabase SQL editor, and click **Run**.
   - This creates the `admins` table, `inquiries` table, CHECK constraints, and performance indexes (`idx_inquiries_category`, `idx_inquiries_user_type`, `idx_inquiries_created_at`, `idx_inquiries_status`).
5. In Supabase, go to **Project Settings** -> **Database** -> **Connection String** -> select **URI** (or Transaction / Session Pooler) and copy your connection string:
   ```text
   postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
   ```

### 3. Backend Setup
1. Open a terminal and navigate to `/backend`:
   ```bash
   cd backend
   ```
2. Copy the sample environment file:
   ```bash
   cp .env.example .env
   ```
3. Edit `backend/.env` with your values:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://postgres.your-project-ref:your-db-password@aws-0-region.pooler.supabase.com:6543/postgres?sslmode=require
   JWT_SECRET=super_secret_jwt_random_key_min_32_characters_long
   JWT_EXPIRES_IN=1d
   FRONTEND_URL=http://localhost:5173
   ADMIN_EMAIL=admin@k12hunar.com
   ADMIN_PASSWORD=Admin@Secure2026!
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Seed the initial admin account (hashes password using `bcrypt` and upserts admin into PostgreSQL):
   ```bash
   npm run seed:admin
   ```
6. Run the automated backend verification test suite:
   ```bash
   npm test
   ```
7. Start the backend server in development mode:
   ```bash
   npm run dev
   # Server runs at http://localhost:5000
   ```

### 4. Frontend Setup
1. Open a second terminal and navigate to `/frontend`:
   ```bash
   cd frontend
   ```
2. Copy the sample environment file:
   ```bash
   cp .env.example .env
   ```
3. Edit `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Verify production build:
   ```bash
   npm run build
   ```
6. Start the frontend development server:
   ```bash
   npm run dev
   # App runs at http://localhost:5173
   ```

---

## ⚙️ Environment Variables Reference

### Backend (`/backend/.env`)

| Variable | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `PORT` | No | Port on which Express server listens (default: `5000`) | `5000` |
| `DATABASE_URL` | **Yes** | Supabase/PostgreSQL connection URI with SSL enabled | `postgresql://postgres.xxx:pass@aws-0-xx.pooler.supabase.com:6543/postgres?sslmode=require` |
| `JWT_SECRET` | **Yes** | Secret string used to sign and verify custom JWTs | `a_secure_random_key_min_32_chars` |
| `JWT_EXPIRES_IN` | No | JWT token expiration lifespan | `1d` |
| `FRONTEND_URL` | **Yes** | Allowed CORS origin(s). Supports comma-separated list | `http://localhost:5173,https://your-app.vercel.app` |
| `ADMIN_EMAIL` | **Yes** | Email used by `npm run seed:admin` | `admin@k12hunar.com` |
| `ADMIN_PASSWORD` | **Yes** | Plaintext password to hash during admin seeding | `Admin@Secure2026!` |

### Frontend (`/frontend/.env`)

| Variable | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | **Yes** | Base URL for backend API calls | `http://localhost:5000/api` |

---

## 🔒 How to Test Custom JWT Authentication

### A. Testing via Browser UI
1. Navigate to `http://localhost:5173/admin` directly in an incognito window.
   - **Result**: You are immediately intercepted and redirected to `/admin/login`.
2. On `/admin/login`, attempt to sign in with incorrect credentials (`wrong@test.com` / `123456`).
   - **Result**: A red error banner appears displaying `"Invalid credentials"`.
3. Sign in with the seeded credentials:
   - **Email**: `admin@k12hunar.com`
   - **Password**: `Admin@Secure2026!`
   - **Result**: Redirected to `/admin`. In browser DevTools -> Application -> Local Storage, inspect `adminToken`.
4. Click the **Logout** button in the top navbar.
   - **Result**: `adminToken` is destroyed and you are redirected to `/admin/login`.

---

### B. Testing via `curl`

#### 1. Public Inquiry Submission (No Auth Required)
```bash
curl -X POST http://localhost:5000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "user_type": "Parent",
    "category": "Admission",
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "phone": "9876543210",
    "message": "Looking for grade 8 admission process and fee structure."
  }'
```
**Expected Response** (`201 Created`):
```json
{
  "success": true,
  "message": "Inquiry submitted successfully. Our team will contact you shortly.",
  "data": {
    "id": "UUID-...",
    "user_type": "Parent",
    "category": "Admission",
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "phone": "9876543210",
    "message": "Looking for grade 8 admission process and fee structure.",
    "status": "New",
    "created_at": "..."
  }
}
```

#### 2. Access Protected Route Without Token (Expect `401 Unauthorized`)
```bash
curl -X GET http://localhost:5000/api/inquiries
```
**Expected Response** (`401 Unauthorized`):
```json
{
  "success": false,
  "message": "Access denied. No authentication token provided."
}
```

#### 3. Admin Login (Retrieve JWT Token)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@k12hunar.com",
    "password": "Admin@Secure2026!"
  }'
```
**Expected Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "...",
    "email": "admin@k12hunar.com"
  }
}
```

#### 4. Access Protected Route With JWT Token (Expect `200 OK`)
```bash
curl -X GET "http://localhost:5000/api/inquiries?page=1&limit=10" \
  -H "Authorization: Bearer <PASTE_TOKEN_HERE>"
```
**Expected Response** (`200 OK`):
```json
{
  "success": true,
  "data": [ ... ],
  "total": 1,
  "page": 1,
  "totalPages": 1,
  "limit": 10
}
```

#### 5. Update Inquiry Status (Protected Route)
```bash
curl -X PATCH http://localhost:5000/api/inquiries/<INQUIRY_UUID>/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <PASTE_TOKEN_HERE>" \
  -d '{
    "status": "In Progress"
  }'
```
**Expected Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Inquiry status updated to In Progress",
  "data": {
    "id": "<INQUIRY_UUID>",
    "status": "In Progress"
  }
}
```

---

## 📡 Complete API Endpoints List

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System health check and server timestamp |
| `POST` | `/api/inquiries` | Public (Rate limited) | Submit a new inquiry |
| `POST` | `/api/auth/login` | Public (Rate limited) | Authenticate admin & issue custom JWT |
| `GET` | `/api/auth/me` | Protected (JWT) | Get currently authenticated admin details |
| `GET` | `/api/inquiries` | Protected (JWT) | Fetch inquiries with filtering, search & pagination |
| `PATCH` | `/api/inquiries/:id/status` | Protected (JWT) | Update inquiry status (`New`, `In Progress`, `Resolved`) |

---

## ☁️ Deployment Guide

### A. Deploy Backend on Render
1. Create an account on [Render](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure service settings:
   - **Name**: `k12-hunar-crm-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables in the Render dashboard:
   - `PORT`: `10000` (or leave default for Render)
   - `DATABASE_URL`: `postgresql://postgres.[REF]:[PASS]@[HOST]:6543/postgres?sslmode=require`
   - `JWT_SECRET`: *(Generate a secure 32+ character random string)*
   - `JWT_EXPIRES_IN`: `1d`
   - `ADMIN_EMAIL`: `admin@k12hunar.com`
   - `ADMIN_PASSWORD`: `Admin@Secure2026!`
   - `FRONTEND_URL`: `http://localhost:5173` *(Will update after frontend deployment)*
6. Click **Create Web Service**.
7. Once deployed, run the seed script from Render's **Shell** tab:
   ```bash
   npm run seed:admin
   ```
8. Copy your Render backend URL: `https://k12-hunar-crm-api.onrender.com`.

---

### B. Deploy Frontend on Vercel
1. Create an account on [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project** and import your GitHub repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables**:
   - `VITE_API_URL`: `https://k12-hunar-crm-api.onrender.com/api` *(Your Render backend URL + `/api`)*
5. Click **Deploy**.
6. Vercel will build the project and output your live frontend URL: `https://k12-hunar-crm.vercel.app`.

---

### C. Connect Frontend & Backend CORS
1. Return to your **Render** dashboard for the backend service.
2. Under **Environment**, update `FRONTEND_URL` to include your Vercel domain:
   ```text
   FRONTEND_URL=http://localhost:5173,https://k12-hunar-crm.vercel.app
   ```
3. Click **Save Changes** (Render will redeploy automatically).
4. Visit your Vercel URL and test submitting an inquiry and logging in as admin!

---

## ⚖️ Evaluation Checklist

- [x] Monorepo contains both `/backend` and `/frontend` directories.
- [x] Database schema defined in `/backend/schema.sql` (compatible with Supabase SQL Editor).
- [x] Supabase used **ONLY as plain PostgreSQL** via standard `pg` connection pool.
- [x] Zero Supabase Auth / SDK / RLS used; **custom JWT authentication** implemented from scratch.
- [x] Public inquiry form with validation (email, 10-digit phone, enum checks) and responsive UI.
- [x] Admin login with bcrypt verification and JWT generation.
- [x] Protected admin dashboard with Category filter, User Type filter, and debounced Search.
- [x] Inline status updates (`New`, `In Progress`, `Resolved`) with status badge styling.
- [x] Sample `.env.example` provided for both backend and frontend.
- [x] Documentation with curl commands, local setup, and deployment guides.
