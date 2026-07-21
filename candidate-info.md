# Candidate Information

## Candidate

| Field | Value |
|-------|-------|
| **Name** | Sonam |
| **Project** | Support Ticket Management System |
| **Submission Date** | July 21, 2026 |

## Technology Stack

- **Frontend:** React 19, Vite, React Router, Axios, React Hook Form, Zod, plain CSS
- **Backend:** Node.js, Express 5, Prisma ORM, PostgreSQL 17
- **Auth:** JWT (jsonwebtoken), bcrypt password hashing
- **Testing:** Jest, Supertest, Vitest, Testing Library
- **DevOps:** Docker, Docker Compose, GitHub Actions

## AI Tool Used

**Cursor AI** — used throughout planning, implementation, testing, debugging, code review, and documentation. Prompt history is recorded in `ai-prompts/`; workflow notes in `tool-specific/cursor-workflow/`.

## Project Summary

A production-style support ticket system with:

- Ticket CRUD, comments, assignment, and activity history
- Full user management with soft delete
- JWT authentication and RBAC (Admin, Support Agent, Viewer)
- Search, advanced filtering, sorting, and pagination
- Swagger/OpenAPI documentation
- 238 automated tests with ~96% backend statement coverage
- Containerized deployment via Docker Compose

## Setup Summary

```bash
npm install
cp .env.example .env
npm run prisma:generate && npm run prisma:migrate && npm run prisma:seed
npm run dev:backend    # Terminal 1
npm run dev:frontend   # Terminal 2
```

Or with Docker: `docker compose up --build`

Login with seed credentials (e.g. `william.carter@supportdesk.com` / `Password123`).

## Validation

| Check | Command | Expected |
|-------|---------|----------|
| Backend tests | `npm test` | 223 passed |
| Frontend tests | `npm run test:frontend` | 15 passed |
| Build | `npm run build` | Success |
| API docs | http://localhost:5001/api/docs | Swagger UI loads |

See [submission-checklist.md](./submission-checklist.md) for the full verification list.
