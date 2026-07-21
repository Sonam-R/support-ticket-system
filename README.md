# Support Ticket Management System

Full-stack support ticket management application with JWT authentication, role-based access control, and a React frontend backed by an Express API and PostgreSQL database.

## Features

- **Tickets** — Create, read, update, delete with validation and status workflow
- **Comments** — Add and view comments on tickets
- **Assignment** — Assign tickets to support agents
- **Ticket history** — Activity timeline for creates, updates, assignments, status changes, and comments
- **Users** — Full CRUD with soft delete and ticket stats
- **Authentication** — JWT login with protected routes
- **Authorization** — RBAC with Admin, Support Agent, and Viewer roles
- **Search & filtering** — Keyword search, status/priority/assignee filters, sorting, pagination
- **API docs** — Swagger/OpenAPI at `/api/docs`
- **Testing** — 221 backend + 15 frontend automated tests
- **DevOps** — Docker Compose stack and GitHub Actions CI

## Technology Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React 19, Vite, React Router, Axios, React Hook Form, Zod, plain CSS |
| Backend | Node.js, Express 5, Prisma ORM, JWT, bcrypt, Zod |
| Database | PostgreSQL 17 |
| Testing | Jest, Supertest, Vitest, Testing Library |
| Deployment | Docker, Docker Compose, GitHub Actions |

## Folder Structure

```text
support-ticket-system/
├── README.md                    # This file
├── candidate-info.md            # Submission metadata
├── requirements-analysis.md     # Functional & non-functional requirements
├── acceptance-criteria.md       # Feature verification checklist
├── implementation-plan.md       # Development phases
├── design-notes.md              # Architecture decisions
├── api-contract.md              # REST API reference
├── data-model.md                # Database entities
├── ui-flow.md                   # Frontend navigation flows
├── test-strategy.md             # Testing approach
├── test-results.md              # Latest test run results
├── debugging-notes.md             # Issues encountered and fixes
├── code-review-notes.md         # Review findings
├── review-fixes.md              # Post-review improvements
├── reflection.md                # Project retrospective
├── pr-description.md            # Pull request summary
├── final-ai-usage-summary.md    # AI-assisted development overview
├── submission-checklist.md      # Final submission checklist
├── ai-prompts/                    # AI prompt history by phase
├── tool-specific/cursor-workflow/  # Cursor IDE workflow docs
├── backend/                     # Express API (layered architecture)
├── frontend/                    # React UI
├── prisma/                      # Schema, migrations, seed
├── database/                    # Pointer to Prisma database assets
├── scripts/                     # Docker entrypoint scripts
├── docs/                        # Supplementary documentation
└── .github/workflows/           # CI pipeline
```

## Prerequisites

- [Node.js](https://nodejs.org/) 22 LTS (18+ supported)
- [PostgreSQL](https://www.postgresql.org/) 17
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (optional)

## Installation

```bash
git clone <repository-url>
cd support-ticket-system
npm install
```

## Environment Variables

Copy the example file and update values:

```bash
cp .env.example .env
```

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_USER` | PostgreSQL username | `postgres` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `postgres` |
| `POSTGRES_DB` | Database name | `support_ticket_system` |
| `DATABASE_URL` | Full connection string | `postgresql://postgres:postgres@localhost:5432/support_ticket_system` |
| `PORT` | Backend API port | `5001` |
| `JWT_SECRET` | JWT signing secret | `your-long-random-secret` |
| `JWT_EXPIRES_IN` | Token expiration | `24h` |
| `NODE_ENV` | Runtime environment | `development` |
| `VITE_API_URL` | Frontend API base URL | `/api` (dev) or `http://localhost:5001/api` (Docker) |
| `FRONTEND_PORT` | Docker frontend host port | `3000` |

For local Vite development, the dev server proxies `/api` to the backend. On macOS, port 5000 may conflict with AirPlay — use `PORT=5001`.

## Database Setup

Ensure PostgreSQL is running, then:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

| Task | Command |
|------|---------|
| Generate Prisma client | `npm run prisma:generate` |
| Run migrations (dev) | `npm run prisma:migrate` |
| Run migrations (prod/Docker) | `npm run prisma:migrate:deploy` |
| Seed database | `npm run prisma:seed` |
| Reset database | `npm run prisma:reset` |

Default seed password for all users: `Password123`

Seed accounts include Admin (`william.carter@supportdesk.com`), Support Agents, and Viewers.

## Running Locally

```bash
# Terminal 1 — API
npm run dev:backend

# Terminal 2 — Frontend
npm run dev:frontend
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API health | http://localhost:5001/health |
| Swagger docs | http://localhost:5001/api/docs |

## Docker Setup

```bash
cp .env.example .env
# Set JWT_SECRET and VITE_API_URL=http://localhost:5001/api
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:5001 |
| Swagger | http://localhost:5001/api/docs |

Seed on first run:

```bash
docker compose exec backend npx prisma db seed
```

Stop: `docker compose down` (data persists in `postgres_data` volume).

## Testing

```bash
npm test                 # Backend (221 tests)
npm run test:frontend    # Frontend (15 tests)
npm run test:coverage    # Backend coverage report
npm run build            # Frontend production build
npm run build:backend    # Verify backend loads
npm run lint             # ESLint on frontend
```

Tests require PostgreSQL. Create `.env.test`:

```env
DATABASE_URL="postgresql://USER@localhost:5432/support_ticket_test"
JWT_SECRET="test-jwt-secret"
JWT_EXPIRES_IN="1h"
```

## CI Workflow

GitHub Actions (`.github/workflows/ci.yml`) runs on push/PR to `main`:

1. Install dependencies (`npm ci`)
2. Generate Prisma client
3. Run backend tests
4. Run frontend tests
5. Build backend and frontend

## Roles

| Role | Capabilities |
|------|-------------|
| **ADMIN** | Full ticket CRUD, user management, ticket deletion |
| **SUPPORT_AGENT** | Create/update tickets, change status, add comments, assign tickets |
| **VIEWER** | Read tickets and comments (no write access) |

## Documentation

See project root markdown files and `ai-prompts/` for development history.

## Future Improvements

- File attachment upload (schema exists, API not implemented)
- Email notifications on assignment or status change
- Real-time updates via WebSockets
- E2E browser tests (Playwright/Cypress)
- Refresh token rotation and password reset flow
- Rate limiting and audit logging for admin actions
