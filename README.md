# Attendio

## Smart lecture attendance tracker and safe-skip calculator

Real-time attendance management for students who want to stay ahead of threshold penalties.

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Status](https://img.shields.io/badge/status-mvp--working-blue)]()

### Demo

Use the seeded demo account:

- Email: student@attendio.dev
- Password: Password123!

Try this flow:
1. Sign in with the demo account.
2. Open the dashboard and review the subject list.
3. Log attendance from the quick actions panel.
4. Watch the attendance percentage update without refreshing the page.
5. Review the safe-skip and recovery summary.

### Problem

Students often lose track of their attendance percentage and only realize they are at risk when it is too late to recover.

### Solution

Attendio gives students:
- Real-time attendance monitoring
- Per-subject safe-skip calculations
- Recovery estimates to reach the minimum threshold
- Risk summaries for multiple classes
- Live updates across sessions using Socket.io

### Features

- Real-time percentage tracking
- Safe-skip and recovery calculator
- Course threshold management
- Attendance logging history
- JWT-protected API access
- Dashboard overview for all subjects

### Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Express + TypeScript
- Database: In-memory demo store with Prisma-ready schema
- Real-time sync: Socket.io
- Auth: JWT + bcrypt

### Architecture

```text
React Frontend
    │
    ├── REST API
    │
Express + TypeScript Backend
    │
    ├── Auth middleware
    ├── Subject routes
    ├── Dashboard routes
    └── Socket.io events
```

### Mathematical model

The attendance percentage is calculated as:

$$
P = \left(\frac{A}{T}\right) \times 100
$$

Where:
- A = attended classes
- T = total classes

The app also calculates safe-skip and recovery counts using threshold-based rules. This is useful for identifying how many classes can be missed without dropping below the required minimum (for example 75%).

### Local development

#### Backend

```bash
cd backend
npm install
npm run dev
```

Runs on http://localhost:3001

#### Frontend

```bash
cd frontend
npm install
npm run dev -- --port 5173
```

Open http://localhost:5173

### Environment variables

```env
# backend/.env
PORT=3001
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5173

# frontend/.env
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_WEBSOCKET_URL=ws://localhost:3001
```

### Project structure

```text
attendio/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── data/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── types/
│   │   ├── index.ts
│   │   ├── socket.ts
│   │   └── ...
│   └── prisma/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
├── LICENSE
├── package.json
└── README.md
```

### Authentication and API

#### Auth

```http
POST /api/v1/auth/login
POST /api/v1/auth/register
```

#### Subjects

```http
GET /api/v1/subjects
POST /api/v1/subjects
POST /api/v1/subjects/:subjectId/attendance
GET /api/v1/calculations/:subjectId/safe-skip
```

### Testing

```bash
cd backend && npm test
cd frontend && npm run build
```

### License

MIT License. See [LICENSE](LICENSE) for details.

### Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request.
