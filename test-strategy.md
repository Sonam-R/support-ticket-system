# Test Strategy

## Overview

| Layer | Framework | Location | Count |
|-------|-----------|----------|-------|
| Backend integration | Jest + Supertest | `backend/tests/integration/` | ~180 |
| Backend unit | Jest | `backend/tests/unit/` | ~43 |
| Frontend | Vitest + Testing Library | `frontend/src/test/` | 15 |

**Total:** 238 automated tests

## Backend Integration Tests

**Location:** `backend/tests/integration/`

| Suite | Coverage |
|-------|----------|
| `auth-api.test.js` | Login, me, logout, invalid credentials, inactive user |
| `authorization.test.js` | Role-based access on all protected endpoints |
| `ticket-api.test.js` | CRUD, pagination, search, filter, sort, 404 |
| `comment-api.test.js` | Create and list comments |
| `status-transition.test.js` | Valid and invalid status transitions |
| `ticket-history.test.js` | History entries on create, update, assign, status, comment |
| `user-api.test.js` | User CRUD, search, filter, soft delete, assignable users |
| `validation.test.js` | Missing/invalid fields across endpoints |
| `edge-cases.test.js` | Boundary conditions, empty results, max limits |
| `error-handling.test.js` | Prisma error mapping, 404/409 responses |
| `swagger.test.js` | OpenAPI spec loads at `/api/docs` |

## Backend Unit Tests

**Location:** `backend/tests/unit/`

| Suite | Coverage |
|-------|----------|
| `ticketValidation.test.js` | Zod schema rules for ticket endpoints |
| `commentValidation.test.js` | Comment schema validation |
| `userValidation.test.js` | User schema validation |
| `ticketService.test.js` | Service-level business logic |
| `statusTransitionService.test.js` | State machine rules and `allowedTransitions` |

## Frontend Tests

**Location:** `frontend/src/test/`

| Suite | Coverage |
|-------|----------|
| `auth.test.jsx` | Login form, AuthContext, ProtectedRoute redirect |
| `rbac.test.jsx` | Role-based navigation, hidden actions for Viewer |

## Test Infrastructure

- **Test database:** Separate `support_ticket_test` via `.env.test`
- **Global setup:** `backend/tests/globalSetup.js` — one-time schema sync
- **Per-test setup:** `backend/tests/setup.js` — truncate tables between tests
- **Helpers:** `backend/tests/helpers/index.js` — auth token generation, seed utilities
- **Concurrency:** `maxWorkers: 1` to prevent DB race conditions

## Manual Testing

Performed for flows not covered by automated tests:

- Full UI walkthrough per role (Admin, Agent, Viewer)
- Docker Compose stack startup and seed
- Swagger UI interaction
- Cross-browser smoke test (Chrome)

## API Testing

- Integration tests use Supertest against Express app (no server start)
- Auth tests generate JWT tokens via helper functions
- Each test suite covers happy path and primary error cases

## Coverage

Run: `npm run test:coverage`

| Metric | Value |
|--------|-------|
| Statements | 95.85% |
| Branches | 81.01% |
| Functions | 94.5% |
| Lines | 95.97% |

Lower coverage areas: `apiResponse.js` utility branches, `AppError` constructor edge.

## What Is Not Tested

- E2E browser automation (Playwright/Cypress)
- File attachment upload (not implemented)
- Docker container health checks
- Production deployment scenarios

## CI Integration

GitHub Actions runs `npm test` and `npm run test:frontend` on every push/PR to `main` against a PostgreSQL service container.
