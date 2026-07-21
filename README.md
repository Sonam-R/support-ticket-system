# Support Ticket Management System

AI-powered support ticket management system with a React frontend and Express backend.

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios, React Hook Form, Zod, Tailwind CSS v4
- **Backend:** Node.js, Express, Prisma ORM, PostgreSQL
- **Database:** PostgreSQL 17

## Prerequisites

- Node.js 18+
- PostgreSQL 17 (existing local instance)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Ensure `.env` at the project root contains:

```env
PORT=5000
DATABASE_URL="postgresql://sonam@localhost:5432/support_ticket_system"
```

### 3. Generate Prisma client

```bash
npm run prisma:generate
```

### 4. Run the backend

```bash
npm run dev:backend
```

Health check: [http://localhost:5000/health](http://localhost:5000/health)

> **Note:** On macOS, port 5000 may be used by AirPlay Receiver. Disable it in **System Settings → General → AirDrop & Handoff → AirPlay Receiver**, or set a different `PORT` in `.env`.

### 5. Run the frontend

```bash
npm run dev:frontend
```

Frontend: [http://localhost:5173](http://localhost:5173)

## Project Structure

```text
support-ticket-system/
├── backend/src/     # Express API (CommonJS)
├── frontend/src/    # React app (ES Modules)
├── prisma/          # Prisma schema and migrations
└── docs/            # Documentation
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev:backend` | Start Express server |
| `npm run dev:frontend` | Start Vite dev server |
| `npm run build` | Build frontend for production |
| `npm run lint` | Lint frontend source |
| `npm run format` | Format code with Prettier |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
