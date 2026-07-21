# Implementation Plan

## Development Phases

### Phase 1 — Database Foundation

**Goal:** Establish data model and seed data.

- Prisma schema: User, Ticket, Comment, Attachment, TicketHistory
- Enums: Role, TicketStatus, Priority, Category
- Migrations and seed script with sample users, tickets, comments, history
- Auth fields added: `password`, `isActive`, `deletedAt` on User

**Milestone:** `npm run prisma:migrate && npm run prisma:seed` succeeds.

### Phase 2 — Backend API Core

**Goal:** Layered Express API with ticket and comment endpoints.

- Architecture: Route → Controller → Service → Repository
- Ticket CRUD, comment APIs, pagination, status filtering
- Zod validation middleware and centralized error handling
- Status transition service with `allowedTransitions`

**Milestone:** Manual curl tests pass; ticket integration tests green.

### Phase 3 — Authentication & Authorization

**Goal:** Secure the API with JWT and RBAC.

- Auth routes: login, me, logout
- `authenticate` and `authorize` middleware
- Role constants: ADMIN, SUPPORT_AGENT, VIEWER
- Protected write endpoints; Admin-only user and delete routes

**Milestone:** `auth-api.test.js` and `authorization.test.js` pass.

### Phase 4 — User Management & Advanced Features

**Goal:** Complete user CRUD and ticket enhancements.

- User CRUD with soft delete and ticket stats
- Assignable users endpoint for ticket forms
- Ticket history logging service
- Search, priority/assignee filters, sorting on ticket list
- User list search, role filter, sorting

**Milestone:** `user-api.test.js`, `ticket-history.test.js` pass.

### Phase 5 — Frontend

**Goal:** React UI with auth, RBAC, and all features.

- AuthContext, ProtectedRoute, RoleProtectedRoute
- Pages: Login, TicketList, TicketDetails, CreateTicket, UserList, CreateUser, UserDetails, Forbidden
- Components: TicketHistory, CommentSection, StatusActions, UserForm
- Server-side search/filter with debounce
- Plain CSS in `global.css`

**Milestone:** Manual UI walkthrough; frontend auth/RBAC tests pass.

### Phase 6 — API Documentation, Testing & DevOps

**Goal:** Production-ready tooling.

- Swagger/OpenAPI spec in `backend/src/config/openapi.js`
- Edge-case and error-handling test suites
- Docker Compose stack (postgres, backend, frontend)
- GitHub Actions CI pipeline

**Milestone:** 238 tests pass; Docker stack starts; CI green.

### Phase 7 — Documentation & Submission

**Goal:** Complete submission package.

- README and all required markdown documents
- AI prompt history and Cursor workflow docs
- Repository cleanup and final validation

**Milestone:** `submission-checklist.md` fully checked.

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| macOS port 5000 conflict | Backend won't start | Default `PORT=5001` |
| Jest parallel DB race | Flaky tests | `globalSetup.js`, `maxWorkers: 1` |
| Auth scope creep | Delayed delivery | Phased implementation; tests per phase |
| Outdated docs | Reviewer confusion | Final documentation pass against codebase |
| Committed secrets/artifacts | Security/size issues | `.gitignore` audit before submission |

## AI Usage During Implementation

| Phase | AI Contribution | Human Oversight |
|-------|-----------------|-----------------|
| Database | Schema scaffolding | Reviewed relations, enums, indexes |
| Backend | Layered architecture, services | Verified patterns, ran tests |
| Auth/RBAC | Middleware, JWT flow | Validated role matrix manually |
| Frontend | Page/component scaffolding | Chose plain CSS; reviewed RBAC UI |
| Tests | Test suite generation | Fixed DB setup; added edge cases |
| Docker/CI | Compose and workflow files | Verified env vars and health checks |
| Documentation | Draft documents | Edited for accuracy against code |

## Validation Gate

Each phase required passing tests before proceeding. Final gate:

```bash
npm test && npm run test:frontend && npm run build && npm run build:backend
```
