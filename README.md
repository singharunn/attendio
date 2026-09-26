# 📊 Attendio

> **Smart lecture attendance tracking, threshold monitoring, and safe-skip calculation — built for students who want to know exactly where they stand before attendance becomes a problem.**

![Status](https://img.shields.io/badge/status-MVP%20%2F%20Active%20Development-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=white)
![Backend](https://img.shields.io/badge/backend-Express%20%2B%20TypeScript-3178C6?logo=typescript&logoColor=white)
![Realtime](https://img.shields.io/badge/realtime-Socket.io-black?logo=socket.io)
![Auth](https://img.shields.io/badge/auth-JWT%20%2B%20bcrypt-orange)
![Styling](https://img.shields.io/badge/styling-Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)

---

# 🧭 Table of Contents

- [Overview](#-overview)
- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [Core Idea](#-core-idea)
- [Features](#-features)
- [Feature Matrix](#-feature-matrix)
- [Architecture](#-architecture)
- [System Flow](#-system-flow)
- [Attendance Calculation](#-attendance-calculation)
- [Safe-Skip Calculation](#-safe-skip-calculation)
- [Recovery Calculation](#-recovery-calculation)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Frontend Architecture](#-frontend-architecture)
- [Backend Architecture](#-backend-architecture)
- [Authentication](#-authentication)
- [API Architecture](#-api-architecture)
- [API Reference](#-api-reference)
- [Real-Time Synchronization](#-real-time-synchronization)
- [Attendance Update Flow](#-attendance-update-flow)
- [Dashboard Flow](#-dashboard-flow)
- [Data Flow](#-data-flow)
- [Local Development](#-local-development)
- [Environment Variables](#-environment-variables)
- [Docker](#-docker)
- [Testing](#-testing)
- [Security Model](#-security-model)
- [Error Handling](#-error-handling)
- [Project Status](#-project-status)
- [Roadmap](#-roadmap)
- [Future Architecture](#-future-architecture)
- [Contributing](#-contributing)
- [License](#-license)

---

# 🧭 Overview

**Attendio** is a full-stack attendance management application designed around one very specific student problem:

> **"How many classes can I miss before my attendance falls below the required threshold?"**

Instead of forcing students to manually calculate percentages, track individual subjects, and repeatedly work out recovery requirements, Attendio turns attendance into a continuously updated dashboard.

The application combines:

- 📊 Attendance tracking
- 🧮 Attendance percentage calculations
- ⚠️ Safe-skip calculations
- 🔄 Recovery calculations
- 📚 Subject-level tracking
- 🔐 JWT-based authentication
- 🔒 Password hashing with bcrypt
- ⚡ Real-time synchronization with Socket.io
- 🌐 REST API communication
- 🖥️ React dashboard
- 🐳 Docker-oriented infrastructure
- 🧪 Automated development/testing workflows

The current repository is structured as a full-stack application with separate frontend and backend components. :contentReference[oaicite:2]{index=2}

---

# 🎯 The Problem

Attendance management sounds simple:

```text
Classes Attended
        +
Total Classes
        ↓
Attendance %
```

But in practice, students need to answer much more than just:

> "What is my attendance?"

They often need to know:

| Question | Why it matters |
|---|---|
| What is my current attendance? | Know current standing |
| Am I above the required threshold? | Identify risk |
| How many classes can I skip? | Plan absences |
| How many classes do I need to attend to recover? | Recover from low attendance |
| Which subject is at risk? | Identify problem areas |
| Did my attendance update correctly? | Maintain reliable records |
| Does the dashboard update immediately? | Avoid stale information |

Attendio is designed around these questions.

---

# 💡 The Solution

Attendio turns attendance management into a continuous feedback loop:

```text
                    ┌──────────────────┐
                    │     STUDENT      │
                    └────────┬─────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │     DASHBOARD       │
                  └─────────┬───────────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
                ▼           ▼           ▼
             Subjects    Attendance   Calculations
                │           │           │
                └───────────┼───────────┘
                            │
                            ▼
                     ┌────────────┐
                     │ REST API   │
                     └─────┬──────┘
                           │
                           ▼
                  ┌────────────────┐
                  │ Attendance Data│
                  └───────┬────────┘
                          │
                          ▼
                  ┌────────────────┐
                  │ Calculations   │
                  └───────┬────────┘
                          │
                          ▼
                  ┌────────────────┐
                  │ Socket.io Sync │
                  └───────┬────────┘
                          │
                          ▼
                     DASHBOARD
                       UPDATE
```

The result is a system where attendance changes can be reflected across the application without requiring a manual page refresh. :contentReference[oaicite:3]{index=3}

---

# 🧠 Core Idea

Attendio treats every subject as an independent attendance state.

Conceptually:

```text
Student
│
├── Subject A
│   ├── Attended
│   ├── Total
│   ├── Percentage
│   ├── Safe Skip
│   └── Recovery
│
├── Subject B
│   ├── Attended
│   ├── Total
│   ├── Percentage
│   ├── Safe Skip
│   └── Recovery
│
└── Subject C
    ├── Attended
    ├── Total
    ├── Percentage
    ├── Safe Skip
    └── Recovery
```

This allows the dashboard to provide both:

### Subject-level information

```text
Mathematics
Attendance: 82%
Safe Skip: 2
Recovery: 0
```

and:

### Overall visibility

```text
┌─────────────────────────────────────────────┐
│              ATTENDANCE OVERVIEW             │
├─────────────────────────────────────────────┤
│                                             │
│  Mathematics          82%       🟢          │
│  Physics              76%       🟢          │
│  Computer Science     69%       🔴          │
│  Electronics          81%       🟢          │
│                                             │
└─────────────────────────────────────────────┘
```

---

# ✨ Features

## 📊 Real-Time Attendance Tracking

Attendance percentages can be updated as attendance records change.

The application is designed so that users can:

```text
Log Attendance
      ↓
Backend Update
      ↓
Recalculate Attendance
      ↓
Emit Real-Time Event
      ↓
Frontend Receives Update
      ↓
Dashboard Refreshes
```

The repository specifically includes Socket.io integration for real-time synchronization. :contentReference[oaicite:4]{index=4}

---

## 🧮 Attendance Calculator

The fundamental attendance calculation is:

```text
                  Attended Classes
Attendance % = ───────────────────── × 100
                  Total Classes
```

Mathematically:

```text
       A
P = ─────── × 100
       T
```

Where:

| Symbol | Meaning |
|---|---|
| `A` | Classes attended |
| `T` | Total classes |
| `P` | Attendance percentage |

The repository defines this model explicitly. :contentReference[oaicite:5]{index=5}

---

# 🟢 Safe-Skip Calculator

One of Attendio's main features is determining how many future classes can potentially be skipped while remaining above the configured attendance threshold.

For example, given:

```text
Current attendance
        +
Required threshold
        +
Total classes
        ↓
Safe-Skip Calculation
```

The system can communicate the result as:

```text
┌─────────────────────────────┐
│       SAFE-SKIP STATUS      │
├─────────────────────────────┤
│ Attendance       82%        │
│ Threshold        75%        │
│ Safe skips       2          │
└─────────────────────────────┘
```

The application exposes safe-skip calculations at the API level as well. :contentReference[oaicite:6]{index=6}

---

# 🔄 Recovery Calculator

If attendance drops below the configured threshold, Attendio can calculate the recovery requirement.

Conceptually:

```text
Attendance below threshold
             │
             ▼
      Calculate deficit
             │
             ▼
       Future classes
             │
             ▼
      Required attendance
             │
             ▼
        Recovery count
```

Example conceptual state:

```text
Current Attendance: 68%
Required:           75%

Status:
🔴 Below Threshold

Recovery:
Attend upcoming classes
until the calculated threshold
is reached again.
```

---

# 🚦 Attendance Risk Model

Attendio can represent attendance using threshold-oriented states:

| State | Meaning |
|---|---|
| 🟢 Safe | Attendance is comfortably above threshold |
| 🟡 Warning | Attendance is approaching threshold |
| 🔴 Risk | Attendance is below required threshold |
| 🔵 Recovery | Attendance requires additional classes to recover |

> The exact UI thresholds can depend on the implementation/configuration.

---

# 📚 Subject Management

Subjects are treated as individual attendance units.

The backend provides subject-oriented API routes including:

```text
GET  /api/v1/subjects
POST /api/v1/subjects
POST /api/v1/subjects/:subjectId/attendance
```

:contentReference[oaicite:7]{index=7}

Conceptually:

```text
                Student
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
   Subject A   Subject B   Subject C
       │           │           │
       ▼           ▼           ▼
   Attendance   Attendance   Attendance
       │           │           │
       └───────────┼───────────┘
                   ▼
              Dashboard
```

---

# 🔐 Authentication

Attendio uses:

```text
JWT + bcrypt
```

for authentication and password handling. :contentReference[oaicite:8]{index=8}

Authentication endpoints include:

```text
POST /api/v1/auth/login
POST /api/v1/auth/register
```

:contentReference[oaicite:9]{index=9}

---

# 🔑 Authentication Flow

```text
                    USER
                     │
                     ▼
              Login / Register
                     │
                     ▼
              ┌─────────────┐
              │   Backend   │
              └──────┬──────┘
                     │
              Validate Input
                     │
                     ▼
              Verify Credentials
                     │
                     ▼
                JWT Token
                     │
                     ▼
                 Frontend
                     │
                     ▼
             Authenticated Requests
                     │
                     ▼
             JWT Middleware
                     │
                     ▼
                 API Access
```

---

# 🧩 Feature Matrix

| Feature | Purpose | Layer |
|---|---|---|
| User Registration | Create student account | Backend |
| User Login | Authenticate user | Backend |
| JWT Authentication | Protect API resources | Backend |
| Password Hashing | Secure credentials | Backend |
| Subject Management | Maintain subject records | Backend + Frontend |
| Attendance Logging | Record attendance | Backend + Frontend |
| Attendance Percentage | Calculate current percentage | Backend |
| Safe-Skip Calculation | Estimate allowable skips | Backend |
| Recovery Calculation | Estimate required recovery | Backend |
| Dashboard | Visualize attendance | Frontend |
| Real-Time Sync | Push updates | Socket.io |
| REST API | Client/server communication | Backend |
| Docker | Containerized environment | Infrastructure |

---

# 🏗️ Architecture

Attendio uses a full-stack architecture with a React frontend communicating with an Express/TypeScript backend.

The documented stack includes React + Vite + Tailwind CSS on the frontend and Express + TypeScript on the backend. :contentReference[oaicite:10]{index=10}

```text
                         ┌─────────────────────┐
                         │       STUDENT       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   React Frontend    │
                         │    Vite + Tailwind  │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┴────────────────┐
                    │                                │
                    ▼                                ▼
             ┌──────────────┐                ┌──────────────┐
             │   REST API   │                │   Socket.io  │
             └──────┬───────┘                └──────┬───────┘
                    │                               │
                    └───────────────┬───────────────┘
                                    ▼
                         ┌─────────────────────┐
                         │ Express + TypeScript│
                         └──────────┬──────────┘
                                    │
                  ┌─────────────────┼──────────────────┐
                  │                 │                  │
                  ▼                 ▼                  ▼
              Auth Layer       Subject Routes    Dashboard Routes
                  │                 │                  │
                  └─────────────────┼──────────────────┘
                                    ▼
                            Attendance Logic
                                    │
                                    ▼
                            Data / Persistence
```

---

# 🔄 System Flow

The complete conceptual flow is:

```text
┌──────────────┐
│    Student   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ React Client │
└──────┬───────┘
       │
       ├─────────────── REST ────────────────┐
       │                                     │
       │                                     ▼
       │                              ┌────────────┐
       │                              │  Express   │
       │                              └─────┬──────┘
       │                                    │
       │                              JWT Middleware
       │                                    │
       │                                    ▼
       │                              Business Logic
       │                                    │
       │                                    ▼
       │                              Attendance Data
       │                                    │
       │                                    ▼
       │                               Calculations
       │                                    │
       │                                    ▼
       │                              Updated State
       │                                    │
       │                                    ▼
       │                              Socket.io Event
       │                                    │
       └────────────────────────────────────┘
                            │
                            ▼
                     React State Update
                            │
                            ▼
                       UI Re-render
```

---

# ⚡ Real-Time Synchronization

Attendio uses **Socket.io** for live synchronization. :contentReference[oaicite:11]{index=11}

Instead of:

```text
User changes attendance
        ↓
Save
        ↓
Refresh browser
        ↓
See new percentage
```

the intended real-time flow is:

```text
User changes attendance
        ↓
POST attendance
        ↓
Backend processes update
        ↓
Attendance recalculated
        ↓
Socket.io emits event
        ↓
Connected clients receive event
        ↓
Frontend state updates
        ↓
Dashboard changes
        ↓
No manual refresh
```

---

# 🔁 Attendance Update Flow

```text
                  ┌───────────────┐
                  │ Student clicks│
                  │ "Present"     │
                  └───────┬───────┘
                          │
                          ▼
                ┌──────────────────┐
                │ Frontend Request │
                └────────┬─────────┘
                         │
                         ▼
          POST /subjects/:id/attendance
                         │
                         ▼
                ┌──────────────────┐
                │ JWT Verification │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │ Update Attendance│
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │ Recalculate %    │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │ Socket.io Event  │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │ Frontend Update  │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │ Updated Dashboard│
                └──────────────────┘
```

---

# 📊 Dashboard Flow

The dashboard is designed to provide an overview across subjects.

```text
                 Dashboard
                     │
       ┌─────────────┼──────────────┐
       │             │              │
       ▼             ▼              ▼
    Subjects      Attendance      Risk
       │             │              │
       ▼             ▼              ▼
  Subject List    Percentages     Warnings
       │             │              │
       └─────────────┼──────────────┘
                     │
                     ▼
             Safe-Skip / Recovery
```

---

# 🧮 Attendance Calculation

The base formula is:

```text
       A
P = ───── × 100
       T
```

Where:

```text
A = classes attended
T = total classes
P = attendance percentage
```

### Example

Suppose:

```text
Attended = 42
Total    = 50
```

Then:

```text
42
── × 100 = 84%
50
```

Result:

```text
Attendance = 84%
```

---

# 📐 Threshold Model

Let:

```text
A = attended classes
T = total classes
R = required attendance percentage
```

Current attendance:

```text
P = (A / T) × 100
```

The application can then compare:

```text
P >= R
```

to determine whether the current attendance satisfies the configured requirement.

---

# 🧮 Safe-Skip Mathematics

To determine whether a future absence remains above a threshold:

```text
Current attendance:
A / T

After skipping one class:

A / (T + 1)
```

The condition becomes:

```text
A
────── × 100 >= R
T + S
```

Where:

| Variable | Meaning |
|---|---|
| `A` | Current attended classes |
| `T` | Current total classes |
| `S` | Future skipped classes |
| `R` | Required threshold |

Therefore, the maximum safe skip count is constrained by:

```text
A
────── ≥ R / 100
T + S
```

This gives the mathematical basis for threshold-aware skip calculations.

---

# 🔄 Recovery Mathematics

If a student is below the required threshold, future attended classes can increase the percentage.

Let:

```text
A = current attended classes
T = current total classes
R = required percentage
X = additional classes attended
```

After attending `X` consecutive classes:

```text
A + X
─────── × 100
T + X
```

The recovery condition becomes:

```text
A + X
─────── ≥ R / 100
T + X
```

This provides the mathematical foundation for estimating how many future classes are required to return to the target threshold.

---

# 📡 API Architecture

The backend exposes versioned API routes under:

```text
/api/v1
```

The current documented API surface includes authentication, subjects, attendance, and safe-skip calculations. :contentReference[oaicite:12]{index=12}

```text
/api/v1
│
├── /auth
│   ├── POST /login
│   └── POST /register
│
├── /subjects
│   ├── GET /
│   ├── POST /
│   └── POST /:subjectId/attendance
│
└── /calculations
    └── GET /:subjectId/safe-skip
```

---

# 🌐 API Reference

## Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Authenticate user |
| `POST` | `/api/v1/auth/register` | Register user |

---

## Subjects

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/subjects` | Retrieve subjects |
| `POST` | `/api/v1/subjects` | Create subject |
| `POST` | `/api/v1/subjects/:subjectId/attendance` | Record attendance |

---

## Calculations

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/calculations/:subjectId/safe-skip` | Calculate safe skips |

The above routes are documented in the current project README. :contentReference[oaicite:13]{index=13}

---

# 🔐 Protected API Flow

For authenticated endpoints:

```text
Client
  │
  ▼
HTTP Request
  │
  ▼
Authorization Header
  │
  ▼
JWT Middleware
  │
  ├──── Invalid ────► 401 / Unauthorized
  │
  ▼
Valid Token
  │
  ▼
Route Handler
  │
  ▼
Business Logic
  │
  ▼
Response
```

---

# 🧱 Backend Architecture

The backend is built with:

```text
Express
    +
TypeScript
    +
JWT
    +
bcrypt
    +
Socket.io
```

The documented backend structure contains configuration, data, libraries, middleware, routes, types, an application entry point, and Socket.io integration. :contentReference[oaicite:14]{index=14}

Conceptually:

```text
backend/
│
└── src/
    │
    ├── config/
    │
    ├── data/
    │
    ├── lib/
    │
    ├── middleware/
    │
    ├── routes/
    │
    ├── types/
    │
    ├── index.ts
    │
    └── socket.ts
```

---

# 🎨 Frontend Architecture

The frontend uses:

```text
React
+
Vite
+
Tailwind CSS
```

:contentReference[oaicite:15]{index=15}

Conceptually:

```text
React Application
       │
       ├── Authentication
       │
       ├── Dashboard
       │
       ├── Subject Views
       │
       ├── Attendance Actions
       │
       ├── Calculations
       │
       └── Real-Time Updates
```

The frontend communicates with the backend through:

```text
REST API
   +
WebSocket / Socket.io
```

---

# 📁 Project Structure

The current repository structure is:

```text
attendio/
│
├── .github/
│   └── workflows/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── data/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── types/
│   │   ├── index.ts
│   │   └── socket.ts
│   │
│   └── prisma/
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
├── LICENSE
├── package.json
└── README.md
```

This structure is based on the repository's documented layout. :contentReference[oaicite:16]{index=16}

---

# 🗂️ Layer Responsibilities

| Layer | Responsibility |
|---|---|
| `frontend/` | User interface |
| `backend/` | Server-side application |
| `backend/src/routes/` | API endpoints |
| `backend/src/middleware/` | Request/auth middleware |
| `backend/src/config/` | Configuration |
| `backend/src/data/` | Application data |
| `backend/src/lib/` | Shared backend utilities |
| `backend/src/types/` | TypeScript types |
| `backend/src/socket.ts` | Real-time communication |
| `backend/prisma/` | Database/schema preparation |
| `.github/workflows/` | Automation workflows |
| `docker-compose.yml` | Multi-service environment |
| `package.json` | Project scripts/dependencies |

---

# 🗄️ Data Layer

The current project uses an in-memory demo store with a Prisma-ready schema. :contentReference[oaicite:17]{index=17}

This architecture allows the project to begin with a lightweight development environment while retaining a path toward a more persistent database-backed implementation.

Conceptually:

```text
Current
──────────────

Application
     │
     ▼
In-Memory Store


Future / Persistent
───────────────────

Application
     │
     ▼
Prisma
     │
     ▼
Database
```

---

# 🐘 Database-Oriented Future Architecture

A persistent production-oriented architecture could eventually look like:

```text
                 Backend
                    │
                    ▼
                 Prisma
                    │
                    ▼
              ┌───────────┐
              │ Database  │
              └─────┬─────┘
                    │
        ┌───────────┼────────────┐
        ▼           ▼            ▼
      Users      Subjects     Attendance
```

Potential conceptual relationships:

```text
USER
 │
 ├───────────────┐
 │               │
 ▼               ▼
SUBJECTS      PROFILE
 │
 ▼
ATTENDANCE
 │
 ▼
CALCULATIONS
```

---

# ⚡ Socket.io Architecture

The real-time layer can be represented as:

```text
             CLIENT A
                 │
                 │
                 ▼
          ┌────────────┐
          │ Socket.io  │
          │   Server   │
          └─────┬──────┘
                │
       ┌────────┼────────┐
       │        │        │
       ▼        ▼        ▼
    Client A Client B Client C
```

When attendance changes:

```text
Attendance Update
       │
       ▼
Backend
       │
       ▼
State Recalculated
       │
       ▼
Socket Event
       │
       ├────────► Client A
       ├────────► Client B
       └────────► Client C
```

This allows connected sessions to stay synchronized.

---

# 🔄 Client ↔ Server Communication

Attendio effectively has two communication paths:

| Channel | Purpose |
|---|---|
| REST API | Requests, mutations, resource access |
| Socket.io | Real-time event synchronization |

Conceptually:

```text
                 ATTENDIO
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
       REST API              Socket.io
          │                     │
          ▼                     ▼
 Request/Response          Live Events
```

---

# 🧪 Testing

The repository includes documented testing/build commands.

Backend tests:

```bash
cd backend && npm test
```

Frontend build:

```bash
cd frontend && npm run build
```

:contentReference[oaicite:18]{index=18}

---

# 🧪 Testing Strategy

A complete testing strategy can be organized into:

```text
                 TESTING
                    │
        ┌───────────┼────────────┐
        │           │            │
        ▼           ▼            ▼
       Unit      Integration   Build
        │           │            │
        └───────────┼────────────┘
                    ▼
              End-to-End
```

### Backend

Potential testing areas:

| Area | Example |
|---|---|
| Authentication | Login/register |
| Authorization | JWT validation |
| Subjects | CRUD behavior |
| Attendance | Attendance updates |
| Calculations | Safe-skip logic |
| API | Request/response behavior |

### Frontend

Potential areas:

| Area | Example |
|---|---|
| Components | Render behavior |
| Dashboard | Data presentation |
| Forms | Input handling |
| API state | Loading/error states |
| Realtime | Socket updates |

---

# 🛡️ Security Model

Attendio uses JWT-based authentication and bcrypt for password handling. :contentReference[oaicite:19]{index=19}

Conceptually:

```text
             USER
              │
              ▼
       Login / Register
              │
              ▼
      Credential Validation
              │
              ▼
         bcrypt Verify
              │
              ▼
          JWT Issued
              │
              ▼
       Authenticated Client
              │
              ▼
        Protected Request
              │
              ▼
        JWT Middleware
              │
              ▼
        Protected Route
```

---

# 🔒 Security Layers

| Layer | Mechanism |
|---|---|
| Password storage | bcrypt |
| Authentication | JWT |
| API protection | Auth middleware |
| Environment secrets | `.env` configuration |
| Transport | HTTP/HTTPS depending on deployment |
| Input validation | Application-level validation |
| Authorization | Authenticated route access |

---

# ⚙️ Local Development

## Requirements

Recommended environment:

```text
Node.js
npm
Git
Docker (optional)
```

---

# 📥 Clone Repository

```bash
git clone https://github.com/singharunn/attendio.git
```

```bash
cd attendio
```

---

# 🖥️ Backend Setup

Navigate to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

The documented backend development server runs on:

```text
http://localhost:3001
```

:contentReference[oaicite:20]{index=20}

---

# 🎨 Frontend Setup

Open another terminal.

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev -- --port 5173
```

The documented frontend development server runs on:

```text
http://localhost:5173
```

:contentReference[oaicite:21]{index=21}

---

# 🧑‍💻 Development Environment

For local development:

```text
┌────────────────────────────────────────────┐
│              LOCAL MACHINE                 │
│                                            │
│   ┌────────────────┐                       │
│   │ React + Vite   │                       │
│   │ localhost:5173 │                       │
│   └───────┬────────┘                       │
│           │                                │
│           │ REST + Socket.io               │
│           │                                │
│           ▼                                │
│   ┌────────────────┐                       │
│   │ Express Server │                       │
│   │ localhost:3001 │                       │
│   └────────────────┘                       │
│                                            │
└────────────────────────────────────────────┘
```

---

# 🌎 Environment Variables

## Backend

Create:

```text
backend/.env
```

Example:

```env
PORT=3001
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5173
```

---

## Frontend

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_WEBSOCKET_URL=ws://localhost:3001
```

These environment variables are documented by the current repository. :contentReference[oaicite:22]{index=22}

---

# ⚠️ Environment Security

Never commit real production secrets.

```text
.env
   │
   ├── JWT_SECRET
   ├── Database credentials
   ├── API keys
   └── Other secrets
```

Use:

```text
.env.example
```

for documenting required configuration without exposing credentials.

---

# 🐳 Docker

The repository includes:

```text
docker-compose.yml
```

which provides a foundation for running the project as a multi-service environment. :contentReference[oaicite:23]{index=23}

Conceptually:

```text
                 Docker Compose
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
     Frontend                  Backend
          │                         │
          └────────────┬────────────┘
                       │
                       ▼
                 Application
```

---

# 🐳 Containerized Development

A containerized setup can simplify:

- Environment consistency
- Dependency management
- Service orchestration
- Local development
- Deployment workflows

Conceptual workflow:

```text
Source Code
    │
    ▼
Docker Compose
    │
    ├─────────────┐
    │             │
    ▼             ▼
Frontend       Backend
    │             │
    └──────┬──────┘
           ▼
        Attendio
```

---

# 📊 Application State

A simplified subject state can be represented as:

```text
Subject
│
├── Name
├── Total Classes
├── Attended Classes
├── Attendance %
├── Required Threshold
├── Safe Skip
└── Recovery Requirement
```

The dashboard then transforms that state into actionable information.

```text
Raw Attendance Data
        │
        ▼
 Calculations
        │
        ├── Percentage
        ├── Safe Skip
        └── Recovery
        │
        ▼
     Dashboard
```

---

# 🚦 Risk Calculation Flow

```text
Current Attendance
        │
        ▼
Compare With Threshold
        │
        ├───────────────┐
        │               │
        ▼               ▼
   Above Target      Below Target
        │               │
        ▼               ▼
    Safe /             Recovery
    Warning            Required
        │               │
        ▼               ▼
   Safe-Skip         Recovery Count
```

---

# 📈 Dashboard Information Model

A useful dashboard can conceptually organize information into:

```text
┌───────────────────────────────────────────────┐
│                  ATTENDIO                     │
├───────────────────────────────────────────────┤
│                                               │
│  OVERVIEW                                     │
│                                               │
│  ┌───────────┐ ┌───────────┐ ┌────────────┐  │
│  │ Subjects  │ │ Attendance│ │ At Risk    │  │
│  │    06     │ │    78%    │ │     02     │  │
│  └───────────┘ └───────────┘ └────────────┘  │
│                                               │
├───────────────────────────────────────────────┤
│                  SUBJECTS                     │
├───────────────────────────────────────────────┤
│                                               │
│ Mathematics       84%     🟢     Skip: 2     │
│ Physics           77%     🟢     Skip: 1     │
│ Chemistry         73%     🔴     Recover     │
│ Programming       91%     🟢     Skip: 5     │
│                                               │
└───────────────────────────────────────────────┘
```

---

# 📋 Feature → API → UI Mapping

| Feature | Frontend | API | Backend Logic | Real-Time |
|---|---:|---:|---:|---:|
| Login | ✅ | ✅ | ✅ | — |
| Register | ✅ | ✅ | ✅ | — |
| Subject List | ✅ | ✅ | ✅ | — |
| Add Subject | ✅ | ✅ | ✅ | — |
| Log Attendance | ✅ | ✅ | ✅ | ✅ |
| Attendance % | ✅ | — | ✅ | ✅ |
| Safe Skip | ✅ | ✅ | ✅ | — |
| Recovery | ✅ | — | ✅ | Possible |
| Dashboard | ✅ | ✅ | ✅ | ✅ |

---

# 🔄 Complete Request Lifecycle

A typical authenticated request can be represented as:

```text
┌──────────────┐
│ React Client │
└──────┬───────┘
       │
       │ HTTP Request
       ▼
┌──────────────┐
│ Express API  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ JWT Middleware│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Route Handler │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Business Logic│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Data Layer   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Calculations │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ HTTP Response│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ React State  │
└──────────────┘
```

---

# 🔁 Real-Time Request Lifecycle

For events requiring live synchronization:

```text
User Action
    │
    ▼
REST API
    │
    ▼
Backend Mutation
    │
    ▼
State Change
    │
    ▼
Calculation
    │
    ▼
Socket.io Emit
    │
    ├─────────────┐
    │             │
    ▼             ▼
Frontend A     Frontend B
    │             │
    ▼             ▼
State Update   State Update
    │             │
    └──────┬──────┘
           ▼
       UI Updated
```

---

# 🧮 Calculation Engine Concept

Attendio can be thought of as having a small calculation layer:

```text
                 Attendance State
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
      Percentage     Safe Skip     Recovery
          │             │             │
          └─────────────┼─────────────┘
                        ▼
                   Risk Summary
                        │
                        ▼
                    Dashboard
```

---

# 🗺️ User Journey

```text
                    START
                      │
                      ▼
                ┌───────────┐
                │   Login   │
                └─────┬─────┘
                      │
                      ▼
                ┌───────────┐
                │ Dashboard │
                └─────┬─────┘
                      │
              ┌───────┼────────┐
              │       │        │
              ▼       ▼        ▼
           Subjects Attendance Calculations
              │       │        │
              └───────┼────────┘
                      ▼
               Make Decision
                      │
             ┌────────┴─────────┐
             ▼                  ▼
        Attend Class         Skip Class
             │                  │
             └────────┬─────────┘
                      ▼
                 Log Result
                      │
                      ▼
               Update Backend
                      │
                      ▼
                Sync Dashboard
                      │
                      ▼
                     END
```

---

# 📱 Responsive Application Concept

The frontend is designed as a web application and can be extended to accommodate:

| Platform | Target |
|---|---|
| Desktop | Full dashboard |
| Laptop | Full dashboard |
| Tablet | Responsive dashboard |
| Mobile | Compact attendance views |

---

# 📊 Current Technology Stack

| Category | Technology |
|---|---|
| Frontend Framework | React |
| Frontend Tooling | Vite |
| Styling | Tailwind CSS |
| Backend | Express |
| Backend Language | TypeScript |
| Authentication | JWT |
| Password Security | bcrypt |
| Real-Time Communication | Socket.io |
| Data Store | In-memory demo store |
| Database Preparation | Prisma-ready schema |
| Infrastructure | Docker Compose |
| License | MIT |

The stack above follows the technologies documented by the repository. :contentReference[oaicite:24]{index=24}

---

# 🧩 Architecture Responsibilities

| Component | Primary Responsibility |
|---|---|
| React | UI rendering |
| Vite | Frontend development/build tooling |
| Tailwind | UI styling |
| Express | HTTP server |
| TypeScript | Type-safe backend development |
| JWT | Authentication tokens |
| bcrypt | Password hashing |
| Socket.io | Real-time communication |
| Prisma | Database schema/readiness |
| Docker Compose | Service orchestration |

---

# 📌 Project Status

Current project state:

```text
┌───────────────────────────────────────────────┐
│                  ATTENDIO                     │
├───────────────────────────────────────────────┤
│                                               │
│ Full-Stack Application       ██████████  ✅   │
│ Authentication               ██████████  ✅   │
│ Subject Management           ██████████  ✅   │
│ Attendance Tracking          ██████████  ✅   │
│ Calculations                 ██████████  ✅   │
│ REST API                     ██████████  ✅   │
│ Socket.io Sync               ██████████  ✅   │
│ Dashboard                    ██████████  ✅   │
│ Docker Infrastructure        ███████░░░  🔄   │
│ Production Hardening         ████░░░░░░  🔄   │
│                                               │
└───────────────────────────────────────────────┘
```

The repository describes the project status as an MVP / working system and documents the real-time synchronization feature. :contentReference[oaicite:25]{index=25}

---

# 🛣️ Roadmap

## Phase 1 — Core Attendance

- [x] User authentication
- [x] Subject management
- [x] Attendance logging
- [x] Percentage calculation
- [x] Safe-skip calculation
- [x] Recovery calculations

---

## Phase 2 — Application Layer

- [x] React frontend
- [x] Express backend
- [x] REST API
- [x] Dashboard
- [x] JWT authentication
- [x] Socket.io integration

---

## Phase 3 — Infrastructure

- [x] Docker Compose configuration
- [x] Environment configuration
- [x] Project-level scripts
- [x] CI/CD workflow foundation

---

## Phase 4 — Potential Improvements

- [ ] Persistent production database
- [ ] Advanced attendance analytics
- [ ] Attendance history graphs
- [ ] Calendar-based attendance view
- [ ] Better notification system
- [ ] Semester management
- [ ] Multiple attendance thresholds
- [ ] Import/export attendance
- [ ] CSV import
- [ ] CSV export
- [ ] Advanced reporting
- [ ] Mobile-focused UI improvements

---

# 🔮 Future Architecture

A larger version of Attendio could evolve into:

```text
                         ┌───────────────┐
                         │    Student    │
                         └───────┬───────┘
                                 │
                                 ▼
                       ┌───────────────────┐
                       │   React Client    │
                       └─────────┬─────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
             REST API         Socket.io       Notifications
                │                │                │
                └────────────────┼────────────────┘
                                 ▼
                       ┌───────────────────┐
                       │ Express Backend   │
                       └─────────┬─────────┘
                                 │
                 ┌───────────────┼────────────────┐
                 │               │                │
                 ▼               ▼                ▼
              Auth          Attendance       Calculations
                 │               │                │
                 └───────────────┼────────────────┘
                                 ▼
                           Prisma Layer
                                 │
                                 ▼
                            Database
                                 │
                                 ▼
                         Analytics Engine
```

---

# 📈 Potential Analytics

Future versions could expose statistics such as:

| Metric | Example |
|---|---|
| Overall Attendance | `81.4%` |
| Highest Attendance | `94%` |
| Lowest Attendance | `67%` |
| Subjects at Risk | `2` |
| Total Classes | `180` |
| Classes Attended | `147` |
| Classes Missed | `33` |
| Safe Skips | `4` |
| Recovery Required | `7` |

---

# 📅 Semester-Level Architecture

A future semester model could look like:

```text
Student
  │
  ├── Semester 1
  │     ├── Mathematics
  │     ├── Physics
  │     └── Programming
  │
  ├── Semester 2
  │     ├── Mathematics
  │     ├── Electronics
  │     └── Networks
  │
  └── Semester 3
        ├── ...
        └── ...
```

This would allow students to retain historical attendance information across academic periods.

---

# 📤 Import / Export Concept

A future version could support:

```text
CSV
 │
 ▼
Import Attendance
 │
 ▼
Validation
 │
 ▼
Subject Mapping
 │
 ▼
Attendance Records
 │
 ▼
Calculations
 │
 ▼
Dashboard
```

And:

```text
Dashboard
    │
    ▼
Export
    │
    ├── CSV
    ├── PDF
    └── JSON
```

---

# 🔔 Notification Architecture

A future notification system could monitor thresholds:

```text
Attendance Update
       │
       ▼
Calculate Percentage
       │
       ▼
Compare Threshold
       │
       ├───────────────┐
       │               │
       ▼               ▼
     Safe            Risk
       │               │
       │               ▼
       │         Generate Alert
       │               │
       │               ▼
       │        Notification System
       │               │
       │       ┌───────┼────────┐
       │       ▼       ▼        ▼
       │     Email   Push      UI
       │
       ▼
     No Alert
```

---

# 🧠 Why Real-Time Matters

Without real-time synchronization:

```text
Student A updates attendance
        ↓
Backend changes
        ↓
Student B still sees old state
```

With Socket.io:

```text
Student A updates attendance
        ↓
Backend changes
        ↓
Socket event emitted
        ↓
Connected clients receive update
        ↓
State synchronized
```

This is particularly useful when the application is open across multiple sessions.

---

# 📐 Engineering Principles

Attendio follows a modular architecture around several engineering concepts:

| Principle | Application |
|---|---|
| Separation of Concerns | Frontend/backend separation |
| Modularity | Dedicated route/config/data layers |
| Type Safety | TypeScript backend |
| Authentication | JWT |
| Credential Security | bcrypt |
| Real-Time Systems | Socket.io |
| API Versioning | `/api/v1` |
| Reproducibility | Environment configuration |
| Containerization | Docker Compose |
| Extensibility | Prisma-ready architecture |

---

# 🧪 Development Lifecycle

```text
        ┌──────────────┐
        │ Define Need  │
        └──────┬───────┘
               ▼
        ┌──────────────┐
        │ Design Flow  │
        └──────┬───────┘
               ▼
        ┌──────────────┐
        │ Implement    │
        └──────┬───────┘
               ▼
        ┌──────────────┐
        │ Test         │
        └──────┬───────┘
               ▼
        ┌──────────────┐
        │ Build        │
        └──────┬───────┘
               ▼
        ┌──────────────┐
        │ Deploy       │
        └──────┬───────┘
               ▼
        ┌──────────────┐
        │ Monitor      │
        └──────┬───────┘
               │
               └───────────────► Improve
```

---

# 👥 Demo

The repository currently documents a seeded demo account:

```text
Email:
student@attendio.dev

Password:
Password123!
```

The documented demo flow is:

```text
Login
  ↓
Open Dashboard
  ↓
Review Subjects
  ↓
Log Attendance
  ↓
Watch Percentage Update
  ↓
Review Safe-Skip / Recovery
```

:contentReference[oaicite:26]{index=26}

> For production deployments, demo credentials should be replaced or disabled.

---

# 🔍 Example User Scenario

Imagine a student has:

```text
Subject: Mathematics

Attended: 42
Total:     50

Attendance:
42 / 50 × 100 = 84%
```

If the required threshold is:

```text
75%
```

the student is currently above the threshold.

Attendio can then provide a calculated safe-skip value rather than requiring the student to manually perform the calculation.

The student therefore sees:

```text
┌────────────────────────────┐
│ Mathematics                │
├────────────────────────────┤
│ Attendance       84%       │
│ Threshold        75%       │
│ Status           🟢 Safe   │
│ Safe Skip        Calculated│
│ Recovery         None      │
└────────────────────────────┘
```

---

# 🧮 Attendance Decision Tree

```text
                  Attendance
                       │
                       ▼
              Compare Threshold
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
          >= Target            < Target
             │                   │
             ▼                   ▼
          Continue             Recover
             │                   │
             ▼                   ▼
       Calculate Safe       Calculate Required
           Skip                Attendance
             │                   │
             └─────────┬─────────┘
                       ▼
                    Dashboard
```

---

# 📦 Repository Files

| File / Directory | Description |
|---|---|
| `.github/workflows/` | GitHub automation workflows |
| `backend/` | Express + TypeScript server |
| `frontend/` | React + Vite frontend |
| `backend/prisma/` | Prisma-ready database structure |
| `docker-compose.yml` | Container orchestration |
| `package.json` | Project metadata and scripts |
| `LICENSE` | MIT license |
| `README.md` | Project documentation |

:contentReference[oaicite:27]{index=27}

---

# 🌐 Development Ports

| Service | Development URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend | `http://localhost:3001` |
| API Base | `http://localhost:3001/api/v1` |
| WebSocket | `ws://localhost:3001` |

The frontend/backend development URLs and environment configuration are documented in the repository. :contentReference[oaicite:28]{index=28}

---

# 📊 System Summary

```text
                    ATTENDIO
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
    Attendance       Subjects      Users
        │              │              │
        └──────────────┼──────────────┘
                       ▼
                  Calculations
                       │
            ┌──────────┼──────────┐
            │                     │
            ▼                     ▼
        Safe Skip              Recovery
            │                     │
            └──────────┬──────────┘
                       ▼
                   Dashboard
                       │
                 ┌─────┴─────┐
                 │           │
                 ▼           ▼
              REST API   Socket.io
```

---

# 🧩 Complete Feature Map

```text
ATTENDIO
│
├── 🔐 Authentication
│   ├── Register
│   ├── Login
│   ├── JWT
│   └── bcrypt
│
├── 📚 Subjects
│   ├── List
│   ├── Create
│   └── Attendance
│
├── 📊 Attendance
│   ├── Attended Classes
│   ├── Total Classes
│   └── Percentage
│
├── 🧮 Calculations
│   ├── Safe Skip
│   └── Recovery
│
├── ⚡ Real-Time
│   └── Socket.io
│
├── 🖥️ Frontend
│   ├── React
│   ├── Vite
│   └── Tailwind
│
├── ⚙️ Backend
│   ├── Express
│   ├── TypeScript
│   ├── Routes
│   └── Middleware
│
└── 🐳 Infrastructure
    ├── Docker Compose
    └── GitHub Workflows
```

---

# 🤝 Contributing

Contributions are welcome.

### 1. Fork

Fork the repository.

### 2. Clone

```bash
git clone https://github.com/singharunn/attendio.git
```

### 3. Create a branch

```bash
git checkout -b feature/your-feature
```

### 4. Make changes

Implement and test your changes.

### 5. Commit

```bash
git add .
git commit -m "feat: add your feature"
```

### 6. Push

```bash
git push origin feature/your-feature
```

### 7. Pull Request

Open a Pull Request describing:

```text
What changed?
Why was it needed?
How was it tested?
Are there any limitations?
```

The repository's existing contribution guidance follows the fork → branch → commit → pull request workflow. :contentReference[oaicite:29]{index=29}

---

# 📝 Commit Convention

Recommended commit format:

```text
<type>: <description>
```

Examples:

```text
feat: add attendance history
fix: correct safe skip calculation
docs: update API documentation
refactor: simplify subject service
test: add attendance route tests
build: update backend dependencies
chore: update project configuration
```

---

# 🐛 Bug Reports

When opening an issue, include:

| Information | Example |
|---|---|
| Description | What happened? |
| Expected | What should happen? |
| Actual | What happened instead? |
| Steps | How can it be reproduced? |
| Environment | OS / Node version |
| Logs | Relevant errors |
| Screenshots | If UI-related |

---

# 💡 Feature Requests

Feature requests should ideally include:

```text
Problem
  ↓
Why it matters
  ↓
Proposed solution
  ↓
Expected behavior
  ↓
Potential implementation
```

---

# 📜 License

Attendio is distributed under the **MIT License**.

See [`LICENSE`](LICENSE) for the complete license text.

The repository currently identifies itself as MIT licensed. :contentReference[oaicite:30]{index=30}

---

# 🏁 Summary

Attendio is a full-stack attendance management system built around a simple but useful idea:

```text
                 KNOW YOUR ATTENDANCE
                          │
                          ▼
                 UNDERSTAND YOUR RISK
                          │
                          ▼
                 CALCULATE YOUR OPTIONS
                          │
                          ▼
                  MAKE BETTER DECISIONS
```

Its architecture combines:

```text
React
  +
Vite
  +
Tailwind CSS
  +
Express
  +
TypeScript
  +
JWT
  +
bcrypt
  +
Socket.io
  +
Prisma-ready structure
  +
Docker Compose
```

The core application flow is:

```text
             ┌─────────────────┐
             │      LOGIN      │
             └────────┬────────┘
                      ▼
             ┌─────────────────┐
             │    DASHBOARD    │
             └────────┬────────┘
                      ▼
             ┌─────────────────┐
             │     SUBJECTS    │
             └────────┬────────┘
                      ▼
             ┌─────────────────┐
             │    ATTENDANCE   │
             └────────┬────────┘
                      ▼
             ┌─────────────────┐
             │   CALCULATIONS  │
             └────────┬────────┘
                      │
             ┌────────┴─────────┐
             ▼                  ▼
        SAFE-SKIP            RECOVERY
             │                  │
             └────────┬─────────┘
                      ▼
             ┌─────────────────┐
             │ REAL-TIME SYNC  │
             └────────┬────────┘
                      ▼
             ┌─────────────────┐
             │    DASHBOARD    │
             └─────────────────┘
```

---

# 🚀 Attendio

### Track attendance.
### Understand thresholds.
### Calculate your options.
### Stay ahead.

---

<p align="center">

**Built with React, TypeScript, Express, Socket.io, and a lot of attendance anxiety. ☕📊**

</p>
