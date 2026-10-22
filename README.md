# FlowForge — Engineering Workflow & Issue Management Platform

FlowForge is a high-performance, full-stack engineering workflow and issue tracking platform built with React, Redux Toolkit, Node.js, Express, and MongoDB.

---

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Redux Toolkit, Axios, React Hook Form, Lucide Icons.
- **Backend:** Node.js, Express.js, MongoDB / Mongoose, JSON Web Tokens (JWT), bcryptjs, Helmet, CORS, Express Rate Limit.

---

## Project Structure

```text
flowforge/
├── client/
│   ├── src/
│   │   ├── app/
│   │   │   └── store.js           # Redux Toolkit store configuration
│   │   ├── components/
│   │   │   ├── IssueModal.jsx     # Form with React Hook Form & useRef focus
│   │   │   ├── Navbar.jsx         # Responsive navigation & role badges
│   │   │   ├── ProtectedRoute.jsx # Client-side route authentication guard
│   │   │   └── StatCard.jsx       # Metric cards for dynamic stats
│   │   ├── features/
│   │   │   ├── auth/authSlice.js      # Auth state & thunks (login, register)
│   │   │   └── issues/issuesSlice.js  # Issue CRUD state & thunks
│   │   ├── hooks/
│   │   │   └── useDebounce.js     # Custom debounce hook for search queries
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx  # Protected issue dashboard with filters
│   │   │   ├── HomePage.jsx       # Responsive landing page
│   │   │   ├── LoginPage.jsx      # Login page with validation
│   │   │   └── RegisterPage.jsx   # Registration with role enforcement
│   │   ├── services/
│   │   │   └── api.js             # Axios instance with credentials
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Resilient MongoDB / In-memory connection
│   │   ├── controllers/
│   │   │   ├── authController.js  # Register, login, logout, getMe
│   │   │   └── issueController.js # CRUD & dynamic statistics
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js  # JWT verification & role authorization
│   │   │   ├── errorMiddleware.js # Centralized 404 & error handlers
│   │   │   └── validateMiddleware.js # Request payload validation
│   │   ├── models/
│   │   │   ├── Issue.js           # Issue Mongoose schema
│   │   │   └── User.js            # User Mongoose schema & bcrypt hooks
│   │   ├── routes/
│   │   │   ├── authRoutes.js      # /api/auth routes
│   │   │   └── issueRoutes.js     # /api/issues routes
│   │   ├── app.js                 # Express app, Helmet, CORS, Rate Limit
│   │   └── server.js              # Server entrypoint
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   ├── seed.js                    # Database seeder script
│   └── test-server.js             # Automated API verification test suite
├── run-dev.js                     # Concurrent runner script
├── EXPERIMENTS.md                 # Detailed guide for all 6 experiments + Viva Q&A
├── package.json                   # Root workspace scripts
└── .gitignore
```

---

## Prerequisites

- **Node.js** v18+ (tested on Node v22)
- **npm** v9+
- *(Optional)* Local MongoDB on `mongodb://127.0.0.1:27017`. If local MongoDB is not running, the application automatically launches an in-memory database instance via `mongodb-memory-server` with zero manual configuration.

---

## Installation & Setup

1. **Install dependencies for both client and server:**
   ```bash
   npm run install:all
   ```

2. **Environment Variables:**
   A default `server/.env` file is pre-configured:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/flowforge
   JWT_SECRET=flowforge_super_secret_jwt_key_2026
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

3. **(Optional) Seed Demo Data:**
   Populate the database with sample issues and users:
   ```bash
   npm run seed
   ```

---

## Running the Application

### Option A: Run Both Client & Server Concurrently
```bash
npm run dev
```
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)

### Option B: Run in Separate Terminals
```bash
# Terminal 1 — Backend
npm run dev:server

# Terminal 2 — Frontend
npm run dev:client
```

---

## Demo Accounts

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@flowforge.dev` | `admin123` | Full access (can edit & delete any issue) |
| **User** | `alex@flowforge.dev` | `user123` | Standard access (can create, edit/delete own issues) |

*Tip: You can also register any new account from the web UI.*

---

## Running Automated Verification Tests

To verify the backend REST API endpoints, JWT authentication, and MongoDB CRUD operations:

```bash
npm run test:server
```

---

## Architecture & Technical Stages Guide

For detailed walkthroughs, file-by-file explanations, expected outputs, and viva questions & answers for each curriculum implementation stage, refer to **[EXPERIMENTS.md](file:///c:/Users/Parth%20khismatrao/Downloads/FSD_Final/EXPERIMENTS.md)**.
