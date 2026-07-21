# Acceptance Criteria

Maps implemented features against assessment requirements.

## Core Features

| Criteria | Status | Evidence |
|----------|--------|----------|
| PostgreSQL + Prisma | ✅ | `prisma/schema.prisma`, migrations in `prisma/migrations/` |
| Express.js backend | ✅ | `backend/src/` layered architecture |
| React (Vite) frontend | ✅ | `frontend/src/` |
| Ticket CRUD | ✅ | `ticket-api.test.js`, UI pages |
| Comments | ✅ | `comment-api.test.js`, `CommentSection` component |
| Ticket assignment | ✅ | `assignedTo` on create/update, assignable users endpoint |
| Ticket history | ✅ | `ticket-history.test.js`, `TicketHistory` component |
| User CRUD | ✅ | `user-api.test.js`, UserList/CreateUser/UserDetails pages |
| JWT authentication | ✅ | `auth-api.test.js`, Login page, `AuthContext` |
| RBAC | ✅ | `authorization.test.js`, `rbac.test.jsx`, role middleware |
| Search | ✅ | `?search=` on tickets and users |
| Advanced filtering | ✅ | Status, priority, assignee, role filters |
| Sorting | ✅ | `?sortBy=&order=` on tickets and users |
| Pagination | ✅ | `?page=&limit=` with metadata |
| Swagger / OpenAPI | ✅ | `swagger.test.js`, `/api/docs` |
| Integration tests | ✅ | 16 backend test suites, 223 tests |
| Unit tests | ✅ | Validation and service unit tests |
| Edge case tests | ✅ | `edge-cases.test.js`, `error-handling.test.js` |
| Docker & Compose | ✅ | `docker-compose.yml`, Dockerfiles |
| GitHub Actions CI | ✅ | `.github/workflows/ci.yml` |

## Authentication & Authorization

| Criteria | Status | How Verified |
|----------|--------|--------------|
| Login returns JWT | ✅ | `auth-api.test.js` |
| Protected routes require token | ✅ | 401 without Bearer token |
| Admin can manage users | ✅ | User routes require ADMIN role |
| Admin can delete tickets | ✅ | DELETE ticket requires ADMIN |
| Support Agent can write tickets | ✅ | Create/update/status/comment allowed |
| Viewer is read-only | ✅ | Write endpoints return 403; UI hides actions |

## Frontend

| Criteria | Status | How Verified |
|----------|--------|--------------|
| Login page | ✅ | `/login` route |
| Ticket list with search/filter/sort | ✅ | `TicketList` page |
| Ticket detail with history | ✅ | `TicketDetails` + `TicketHistory` |
| Create ticket (role-gated) | ✅ | `/tickets/create` for Admin/Agent |
| User management (Admin) | ✅ | `/users` routes |
| Forbidden page | ✅ | `/forbidden` for unauthorized roles |
| Error messages user-friendly | ✅ | `ErrorMessage` component, `getErrorMessage()` |
| Loading and empty states | ✅ | TicketList, UserList |

## Backend

| Criteria | Status | How Verified |
|----------|--------|--------------|
| Validation returns 400 | ✅ | `validation.test.js` |
| Status state machine enforced | ✅ | `status-transition.test.js` |
| Consistent response envelope | ✅ | `{ success, data/message }` |
| Prisma errors mapped | ✅ | `error-handling.test.js` |

## Repository & Documentation

| Criteria | Status | Evidence |
|----------|--------|----------|
| README with setup instructions | ✅ | `README.md` |
| All submission documents | ✅ | Root markdown files |
| AI prompt history | ✅ | `ai-prompts/` |
| Cursor workflow docs | ✅ | `tool-specific/cursor-workflow/` |
| `.env` excluded | ✅ | `.gitignore` |
| `.env.example` present | ✅ | `.env.example` |
| No committed build artifacts | ✅ | `frontend/dist` in `.gitignore` |
| No secrets committed | ✅ | Verified |

## Manual Test Steps

1. Start backend and frontend (or Docker stack)
2. Login as Admin (`william.carter@supportdesk.com` / `Password123`)
3. Create a ticket with assignment
4. Verify ticket appears in list; search and filter work
5. Open ticket detail — verify history timeline
6. Add a comment; change status using allowed actions
7. Navigate to Users — create, edit, and view a user
8. Logout; login as Viewer — confirm write actions hidden
9. Attempt API write as Viewer — confirm 403
10. Open Swagger at `/api/docs`

## Stretch Goals Delivered

- Full user CRUD with soft delete
- JWT authentication and RBAC
- Ticket history / activity timeline
- Advanced filtering, sorting, pagination
- Swagger/OpenAPI
- Docker & CI
- Frontend unit tests for auth and RBAC
