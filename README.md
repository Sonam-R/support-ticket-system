# Support Ticket Management System

Full-stack support ticket management application with React frontend and Express API.

## Tech Stack

- **Frontend:** React 19, Vite, React Router, Axios, React Hook Form, Zod, plain CSS
- **Backend:** Node.js, Express 5, Prisma ORM, PostgreSQL
- **Testing:** Jest, Supertest (backend integration tests)

## Prerequisites

- Node.js 18+
- PostgreSQL 17

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create `.env` at the project root:

```env
PORT=5001
DATABASE_URL="postgresql://USER@localhost:5432/support_ticket_system"
```

Create `frontend/.env`:

```env
VITE_API_URL=/api
```

### 3. Database setup

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 4. Run the application

```bash
# Terminal 1 — API
npm run dev:backend

# Terminal 2 — Frontend
npm run dev:frontend
```

- API health: `http://localhost:5001/health`
- Frontend: `http://localhost:5173`

> On macOS, port 5000 may conflict with AirPlay Receiver. Use `PORT=5001` in `.env`.

## Project Structure

```text
support-ticket-system/
├── backend/src/       # Express API (layered architecture)
├── frontend/src/      # React UI
│   ├── pages/         # TicketList, TicketDetails, CreateTicket
│   ├── components/    # TicketCard, TicketForm, StatusActions, etc.
│   └── styles/        # global.css
├── prisma/            # Schema, migrations, seed
├── docs/              # AI context
├── ai-prompts/        # AI prompt documentation
└── tool-specific/     # Cursor workflow notes
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev:backend` | Start Express API |
| `npm run dev:frontend` | Start Vite dev server |
| `npm run build` | Build frontend for production |
| `npm run lint` | Lint frontend source |
| `npm run test` | Run backend integration tests |
| `npm run prisma:seed` | Seed database |

## Features

- Ticket CRUD with validation
- Status state machine with allowed transitions
- Comments on tickets
- Search and status filter (server-side)
- Minimal CSS UI with error handling

## Documentation

See project root for planning, design, API contract, and submission documents.
