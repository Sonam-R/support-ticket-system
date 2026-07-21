# Support Ticket Management System

Full-stack support ticket management application with React frontend and Express API.

## Tech Stack

- **Frontend:** React 19, Vite, React Router, Axios, React Hook Form, Zod, plain CSS
- **Backend:** Node.js, Express 5, Prisma ORM, PostgreSQL
- **Testing:** Jest, Supertest (backend), Vitest (frontend)
- **Deployment:** Docker, Docker Compose, GitHub Actions

## Prerequisites

- [Node.js](https://nodejs.org/) 22 LTS (18+ supported)
- [PostgreSQL](https://www.postgresql.org/) 17
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (for containerized setup)

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy the example environment file and update values as needed:

```bash
cp .env.example .env
```

For local Vite development, create `frontend/.env` (or use the root `.env` values):

```env
VITE_API_URL=/api
```

The Vite dev server proxies `/api` requests to the backend on port 5001.

### 3. Database setup

Ensure PostgreSQL is running, then:

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
- Swagger docs: `http://localhost:5001/api/docs`

> On macOS, port 5000 may conflict with AirPlay Receiver. Use `PORT=5001` in `.env`.

## Docker Setup

### 1. Configure environment

```bash
cp .env.example .env
```

Update `.env` for Docker:

- Set a strong `JWT_SECRET`
- Set `VITE_API_URL=http://localhost:5001/api` (browser-accessible API URL)

### 2. Start all services

```bash
docker compose up --build
```

Or use the npm script:

```bash
npm run docker:up
```

Services:

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:3000        |
| Backend  | http://localhost:5001        |
| Swagger  | http://localhost:5001/api/docs |

### 3. Seed the database (first run)

```bash
docker compose exec backend npx prisma db seed
```

### 4. Stop services

```bash
docker compose down
```

Data persists in the `postgres_data` Docker volume across restarts.

## Database

| Task | Command |
|------|---------|
| Generate Prisma client | `npm run prisma:generate` |
| Run migrations (dev) | `npm run prisma:migrate` |
| Run migrations (prod/Docker) | `npm run prisma:migrate:deploy` |
| Seed database | `npm run prisma:seed` |
| Reset database | `npm run prisma:reset` |

**Docker equivalents:**

```bash
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npx prisma db seed
docker compose exec backend npx prisma migrate reset --force
```

Default seed password for all users: `Password123`

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_USER` | PostgreSQL username | `postgres` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `postgres` |
| `POSTGRES_DB` | PostgreSQL database name | `support_ticket_system` |
| `DATABASE_URL` | Full PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/support_ticket_system` |
| `PORT` | Backend API port | `5001` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your-long-random-secret` |
| `JWT_EXPIRES_IN` | JWT token expiration | `24h` |
| `NODE_ENV` | Runtime environment | `development` or `production` |
| `VITE_API_URL` | Frontend API base URL | `/api` (dev) or `http://localhost:5001/api` (Docker) |
| `FRONTEND_PORT` | Host port for frontend container | `3000` |

## Testing

```bash
# Backend integration and unit tests
npm test

# Frontend tests
npm run test:frontend

# Backend coverage report
npm run test:coverage
```

Tests require a PostgreSQL database. Create `.env.test` from the test values in `.env.example` pattern:

```env
DATABASE_URL="postgresql://USER@localhost:5432/support_ticket_test"
JWT_SECRET="test-jwt-secret"
JWT_EXPIRES_IN="1h"
```

CI runs automatically on push and pull requests to `main` via GitHub Actions.

## API Documentation

Swagger UI is available when the backend is running:

```
http://localhost:5001/api/docs
```

## Project Structure

```text
support-ticket-system/
├── backend/
│   ├── Dockerfile
│   └── src/              # Express API (layered architecture)
├── frontend/
│   ├── Dockerfile
│   └── src/              # React UI
├── prisma/               # Schema, migrations, seed
├── scripts/              # Docker entrypoint scripts
├── .github/workflows/    # CI pipeline
└── docker-compose.yml
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev:backend` | Start Express API with hot reload |
| `npm run dev:frontend` | Start Vite dev server |
| `npm run build` | Build frontend for production |
| `npm run build:backend` | Generate Prisma client and verify backend loads |
| `npm run build:frontend` | Build frontend for production |
| `npm run start` | Start backend in production mode |
| `npm run test` | Run backend tests |
| `npm run test:frontend` | Run frontend tests |
| `npm run prisma:seed` | Seed database |
| `npm run docker:up` | Build and start Docker Compose stack |
| `npm run docker:down` | Stop Docker Compose stack |

## Features

- Ticket CRUD with validation
- Comments, assignment, and ticket history
- User CRUD with JWT authentication
- Role-based authorization (Admin, Support Agent, Viewer)
- Search, advanced filtering, sorting, and pagination
- Swagger/OpenAPI documentation
- Automated test suite

## Documentation

See project root for planning, design, API contract, and submission documents.
