# Design Notes

## Backend Architecture

```
HTTP Request
  → Middleware (helmet, cors, morgan, json)
  → Route (endpoint + auth + authorize + validate)
  → Controller (HTTP only)
  → Service (business logic)
  → Repository (Prisma queries)
  → PostgreSQL
```

### Layer Responsibilities

| Layer | Files | Responsibility |
|-------|-------|----------------|
| Routes | `backend/src/routes/` | Wire endpoints, apply middleware |
| Controllers | `backend/src/controllers/` | Parse request, call service, send response |
| Services | `backend/src/services/` | Business rules, orchestration, history logging |
| Repositories | `backend/src/repositories/` | Database access only |
| Validations | `backend/src/validations/` | Zod schemas for request validation |
| Middleware | `backend/src/middleware/` | Auth, authorize, validate, error handling |

### Key Services

- **ticketService** — CRUD, list filtering, delegates status changes
- **statusTransitionService** — State machine with `allowedTransitions`
- **historyService** — Logs TICKET_CREATED, ASSIGNED, STATUS_CHANGED, etc.
- **authService** — Login, JWT generation, current user lookup
- **userService** — CRUD, soft delete, assignable users

## Frontend Architecture

```
main.jsx
  → AuthProvider (JWT in localStorage)
  → AppRoutes
    → ProtectedRoute (requires login)
      → RoleProtectedRoute (requires role)
        → Page components
```

### Structure

| Directory | Purpose |
|-----------|---------|
| `pages/` | Route-level components (Login, TicketList, etc.) |
| `components/` | Reusable UI (TicketForm, CommentSection, etc.) |
| `hooks/` | Data fetching (useTickets, useUsers, useDebounce) |
| `services/` | Axios API calls (ticketService, authService, userService) |
| `context/` | AuthContext for global auth state |
| `utils/` | Permissions, error formatting, date formatting |
| `styles/` | `global.css` — all styling |

### Data Flow

1. Page calls custom hook or service
2. Axios interceptor attaches JWT Bearer token
3. API returns `{ success, data }` envelope
4. Errors mapped to user-friendly messages via `getErrorMessage()`

## Database Design

Source: `prisma/schema.prisma`

- **User** — Auth fields (`password`, `isActive`, `deletedAt`); roles via enum
- **Ticket** — Status workflow, priority, category; optional assignee FK
- **Comment** — Cascade delete with ticket
- **TicketHistory** — Audit trail with action, field, old/new values
- **Attachment** — Schema only; not exposed via API

Indexes on frequently filtered columns: `status`, `priority`, `category`, `createdAt`, `email`, `role`.

## Authentication Flow

```
1. User submits email + password → POST /api/auth/login
2. authService validates credentials (bcrypt compare)
3. JWT signed with { id, email, role }, expires per JWT_EXPIRES_IN
4. Frontend stores token in localStorage
5. Axios interceptor adds Authorization: Bearer <token>
6. authenticate middleware verifies JWT on protected routes
7. req.user populated with { id, email, role }
```

Inactive users receive 403 on login. Invalid credentials return 401 (no user enumeration).

## Authorization Strategy

Role matrix enforced by `authorize(...roles)` middleware:

| Action | ADMIN | SUPPORT_AGENT | VIEWER |
|--------|-------|---------------|--------|
| Create/update ticket | ✅ | ✅ | ❌ |
| Change status | ✅ | ✅ | ❌ |
| Delete ticket | ✅ | ❌ | ❌ |
| Add comment | ✅ | ✅ | ❌ |
| Manage users | ✅ | ❌ | ❌ |
| View tickets/comments | ✅ | ✅ | ✅ |
| View ticket history | ✅ | ✅ | ✅ |

Frontend mirrors this via `permissions.js`, `RoleProtectedRoute`, and conditional UI rendering.

## Validation Approach

**Backend:** Zod schemas validate `body`, `params`, and `query`. Coerced types (page, limit) read from `req.validated`, not raw `req.query`.

**Frontend:** React Hook Form with `@hookform/resolvers/zod` for form validation before API calls.

## Error Handling

- **AppError** — Operational errors with `statusCode` (400, 401, 403, 404, 409)
- **ZodError** — Mapped to 400 with joined field messages
- **Prisma errors** — P2025→404, P2003→400, P2002→409
- **Unhandled errors** — 500 with generic message; logged server-side
- **Frontend** — Axios interceptor + `getErrorMessage()` for network and API errors

## Status State Machine

| From | Allowed To |
|------|------------|
| OPEN | IN_PROGRESS, CANCELLED |
| IN_PROGRESS | RESOLVED, CANCELLED |
| RESOLVED | CLOSED |
| CLOSED | (terminal) |
| CANCELLED | (terminal) |

`allowedTransitions` computed in `statusTransitionService` and returned with ticket detail. Frontend `StatusActions` renders only allowed buttons.

## UI Design Decisions

- Card-based ticket list (not data table)
- Debounced search (300ms) calling backend `?search=`
- Inline edit on ticket detail page
- Activity timeline component for ticket history
- Shared `ErrorMessage` banner for API failures
- Role-aware navigation in `MainLayout`
