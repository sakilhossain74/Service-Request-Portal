# Service Request & Resolution Portal (MERN Stack)

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application for submitting, assigning, tracking, and resolving service or maintenance requests with role-based access control.

---

## Features

### User Features
- **Register & Login:** Create a user account and authenticate with JWT.
- **User Dashboard:** View personal request counts by status (`Pending`, `Assigned`, `In Progress`, `Resolved`) and recent submissions.
- **Create Request:** Submit a request with title, description, category, and priority (`Low`, `Medium`, `High`).
- **Manage Own Requests:** Search by title, filter by status/category/priority, view details, and edit or delete **Pending** requests.

### Admin Features
- **Admin Dashboard:** View system-wide totals, status counts, priority/category breakdowns, and recent activity.
- **Manage All Requests:** View, search, filter, edit, or delete any request across all users.
- **Staff Assignment View:** Assign or reassign active staff members to requests.
- **Status Workflow Control:** Advance requests through `Pending → Assigned → In Progress → Resolved` with backend-enforced transition rules.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite), React Router, Axios, Bootstrap 5, React Toastify |
| Backend | Node.js, Express.js, REST APIs, `express-validator` |
| Database | MongoDB, Mongoose |
| Security & Auth | JWT (`jsonwebtoken`), `bcryptjs`, `helmet`, `cors`, `dotenv` |
| Dev Tools | `nodemon`, `morgan`, Git / GitHub |

---

## Architecture & Approach

- **MVC Backend Structure:** Routes (`src/routes/`) define endpoints and attach middleware (`protect`, `authorizeRoles`, `validate`). Controllers (`src/controllers/`) implement business logic and database queries. Models (`src/models/`) define Mongoose schemas and indexes.
- **JWT Authentication Flow:** On login/register, the backend signs a JWT containing the user's `_id`. The frontend stores the token in `localStorage` and attaches `Authorization: Bearer <token>` via an Axios request interceptor. On page refresh, `AuthContext` calls `GET /api/auth/me` to restore and validate the session.
- **Role-Based Access & Ownership:** `protect` verifies the JWT and attaches `req.user`. `authorizeRoles('admin')` restricts admin-only routes (staff list, assignment, status changes). For standard users, request queries are scoped with `{ _id, createdBy: req.user._id }` so users can only access or modify their own requests.
- **Status Workflow:** `Pending → Assigned → In Progress → Resolved`. A request cannot move past `Pending` without an assigned staff member. Resolved requests cannot be reassigned or have their status changed.
- **Why `Staff` is a Separate Collection:** The assessment specifies two login roles (`Admin` and `User`). Modelling assignable technicians as a separate `Staff` collection allows Admins to assign requests to staff members without creating unnecessary login accounts for them.

### Project Structure

```text
Service-Request-Portal/
├── README.md
├── .gitignore
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── config/          # db.js, constants.js
│       ├── models/          # User.js, Staff.js, Request.js
│       ├── controllers/     # auth, request, staff, dashboard
│       ├── routes/          # authRoutes, requestRoutes, staffRoutes, dashboardRoutes
│       ├── middleware/      # protect, authorizeRoles, validate, errorHandler
│       ├── validators/      # express-validator chains
│       ├── utils/           # ApiError, asyncHandler, generateToken
│       └── seed/            # idempotent seed.js
└── frontend/
    ├── package.json
    ├── .env.example
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── api/             # Axios instance + interceptors
        ├── context/         # AuthContext
        ├── components/      # layout, common, requests, routing
        ├── pages/           # Login, Register, Dashboards, Requests, AdminAssignment
        ├── services/        # API service wrappers
        ├── hooks/           # useDebounce
        ├── utils/           # constants, formatters
        └── styles/          # custom.css
```

---

## Prerequisites

- **Node.js** v18+ (tested with v22.14.0)
- **npm** v9+
- **MongoDB** (Local MongoDB Community Server on `127.0.0.1:27017` **or** a free MongoDB Atlas cluster)
- **Git**

---

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Service-Request-Portal
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```
   Edit `backend/.env` and set:
   - `MONGO_URI` (local `mongodb://127.0.0.1:27017/service_request_portal` or your MongoDB Atlas connection string)
   - `JWT_SECRET` (a long random secret string)

3. **Database Setup & Seed**
   - Ensure MongoDB is running locally (or your Atlas cluster is reachable).
   - Run the idempotent seed script to create the Admin, Demo User, 5 Staff members, and 4 sample requests:
     ```bash
     npm run seed
     ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   ```

5. **Run Both Servers**
   - Terminal 1 (Backend — `http://localhost:5000`):
     ```bash
     cd backend
     npm run dev
     ```
   - Terminal 2 (Frontend — `http://localhost:5173`):
     ```bash
     cd frontend
     npm run dev
     ```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example / Default |
|---|---|---|
| `PORT` | Express server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/service_request_portal` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `replace_with_a_long_random_string` |
| `JWT_EXPIRES_IN` | JWT expiration duration | `7d` |
| `CLIENT_URL` | Allowed CORS origin for frontend | `http://localhost:5173` |
| `SEED_ADMIN_EMAIL` | Optional override for seeded admin email | `admin@example.com` |
| `SEED_ADMIN_PASSWORD` | Optional override for seeded admin password | `| `SEED_ADMIN_PASSWORD` | Optional override for seeded admin password | `change_this_password` (default: `Admin@123`)` |

### Frontend (`frontend/.env`)

| Variable | Description | Example / Default |
|---|---|---|
| `VITE_API_URL` | Base URL for backend API | `http://localhost:5000/api` |

---

## Sample Credentials (Demo Only)

Created automatically by `npm run seed`. Change these credentials outside local development.

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@example.com` | `Admin@123` |
| **User** | `user@example.com` | `User@123` |

---

## API Documentation

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/health` | Public | Health check (`{ status: "ok" }`) |
| `POST` | `/auth/register` | Public | Register a new `user` account |
| `POST` | `/auth/login` | Public | Authenticate user and return JWT |
| `GET` | `/auth/me` | Auth | Get current authenticated user |
| `POST` | `/requests` | Auth | Create a new service request |
| `GET` | `/requests` | Auth | List requests (`search`, `status`, `category`, `priority`, `page`, `limit`) |
| `GET` | `/requests/:id` | Owner / Admin | Get request details |
| `PUT` | `/requests/:id` | Owner (`Pending`) / Admin | Update request details |
| `DELETE` | `/requests/:id` | Owner (`Pending`) / Admin | Delete request |
| `PATCH` | `/requests/:id/assign` | Admin only | Assign staff (`{ staffId }`) |
| `PATCH` | `/requests/:id/status` | Admin only | Advance status (`{ status }`) |
| `GET` | `/staff` | Admin only | List active staff members |
| `GET` | `/dashboard/stats` | Auth | Role-scoped dashboard counts and recent requests |

---

## Business Rules Summary

- **Users** can create requests, view only their own requests, and edit/delete only their own `Pending` requests.
- **Admins** can view, edit, and delete all requests, assign staff, and update statuses.
- **Status Workflow:** `Pending → Assigned → In Progress → Resolved`. A request cannot move past `Pending` without an assigned staff member, and `Resolved` requests cannot be modified or reassigned.

---

## How to Test

1. Start MongoDB, run `npm run seed` in `backend/`, and start both `backend` and `frontend`.
2. Log in as **User** (`user@example.com` / `User@123`), create a request, edit/delete a `Pending` request, and verify you only see your own requests.
3. Log in as **Admin** (`admin@example.com` / `Admin@123`), open **Assignments**, assign a staff member to a `Pending` request (status becomes `Assigned`), then advance it to `In Progress` and `Resolved`.
4. Verify dashboard counts update dynamically from MongoDB and test search/filter combinations.

---

## Troubleshooting

- **`ECONNREFUSED 127.0.0.1:27017`:** MongoDB is not running locally. Start your local `mongod` service or use a MongoDB Atlas URI in `backend/.env`.
- **CORS Error in Browser:** Ensure `CLIENT_URL` in `backend/.env` matches the frontend URL (`http://localhost:5173`).
- **Port 5000 in use:** Change `PORT` in `backend/.env` and update `VITE_API_URL` in `frontend/.env`.
- **401 Unauthorized:** Clear `localStorage` in browser DevTools or log in again to obtain a fresh JWT.

---

## Known Limitations & Future Improvements

- **Automated Testing:** Automated Jest/Supertest integration tests have not yet been implemented.
- **Future Improvements:** Add a staff management interface, request comment threads, email notifications, and automated integration tests.

---

## Author / Submission Note

Developed for the **EXPRO LAB INFOTECH PVT. LTD.** Technical Skill Assessment — Service Request & Resolution Portal.
