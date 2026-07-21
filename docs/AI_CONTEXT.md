# AI Context — Support Ticket Management System

This file captures project context and chat history for AI-assisted development continuity.

---

## Project Overview

AI-powered Support Ticket Management System with:

- **Frontend:** React, Vite, React Router, Axios, React Hook Form, Zod, Tailwind CSS v4
- **Backend:** Node.js, Express (CommonJS), Prisma ORM, PostgreSQL 17
- **Validation:** Zod (backend and frontend)

Root `.env` (required):

```env
PORT=5000
DATABASE_URL="postgresql://sonam@localhost:5432/support_ticket_system"
```

---

## Completed Steps

### Step 2 — Database Schema & Seed (done)

- Prisma schema: `prisma/schema.prisma`
- Models: `User`, `Ticket`, `Comment`, `Attachment`, `TicketHistory`
- Enums: `Role`, `TicketStatus`, `Priority`, `Category`
- Seed data: `prisma/seed.js` (admin, agents, customers, tickets, comments, attachments, history)

### Step 3 — Express API Architecture & Ticket CRUD (done)

Implemented layered backend with ticket CRUD, comment APIs, pagination, filtering, validation, and error handling.

**Not implemented yet:** authentication, JWT, role permissions, file upload, AI features, frontend ticket UI.

**Next step:** Step 4 — React Frontend Architecture and Ticket Management UI.

---

## Backend Architecture

```
Request → Route → Controller → Service → Repository → Prisma → PostgreSQL
```

### Folder Structure

```
backend/src/
├── config/prisma.js
├── constants/index.js
├── controllers/
│   ├── ticketController.js
│   └── commentController.js
├── services/
│   ├── ticketService.js
│   └── commentService.js
├── repositories/
│   ├── ticketRepository.js
│   ├── commentRepository.js
│   └── userRepository.js
├── routes/
│   ├── ticketRoutes.js
│   └── commentRoutes.js
├── validations/
│   ├── ticketValidation.js
│   └── commentValidation.js
├── middleware/
│   ├── asyncHandler.js
│   ├── validate.js
│   └── errorHandler.js
├── utils/
│   ├── apiResponse.js
│   └── AppError.js
├── app.js
└── server.js
```

### Layer Responsibilities

| Layer | Responsibility |
|-------|----------------|
| Routes | Endpoint definitions only |
| Controllers | Receive request, call service, send response |
| Services | Business logic, validation rules, orchestration |
| Repositories | Prisma queries only |
| Middleware | Async wrapper, Zod validation, centralized errors |

---

## API Endpoints

### Health

```
GET /health
→ { "status": "OK", "message": "Support Ticket API running" }
```

### Tickets

| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | `/api/tickets` | Create ticket |
| GET | `/api/tickets` | Pagination: `?page=1&limit=10`, filter: `?status=OPEN` |
| GET | `/api/tickets/:id` | Includes comments, attachments, history, creator, assigned agent |
| PUT | `/api/tickets/:id` | Partial update: title, description, status, priority, category, assignedToId |
| DELETE | `/api/tickets/:id` | Delete ticket |

**Create ticket body:**

```json
{
  "title": "Payment issue",
  "description": "Payment failed",
  "priority": "HIGH",
  "category": "BILLING",
  "createdById": "user-uuid"
}
```

### Comments

| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | `/api/tickets/:ticketId/comments` | Add comment |
| GET | `/api/tickets/:ticketId/comments` | List comments for ticket |

**Create comment body:**

```json
{
  "message": "We are investigating the issue",
  "userId": "user-uuid"
}
```

### Response Format

Success:

```json
{ "success": true, "data": {} }
```

Error:

```json
{ "success": false, "message": "Error message" }
```

Paginated ticket list wraps tickets and metadata:

```json
{
  "success": true,
  "data": {
    "tickets": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "totalPages": 0
    }
  }
}
```

---

## Implementation Notes

### Validation middleware

`middleware/validate.js` stores parsed Zod output on `req.validated` (not `req.query`). Express keeps query params as strings; coerced numbers must be read from `req.validated.query` (used in `ticketController.getTickets`).

### Business rules (service layer)

- **Create ticket:** verifies `createdById` user exists
- **Update ticket:** verifies ticket exists; verifies `assignedToId` user exists when provided
- **Comments:** verifies ticket and user exist before create
- **Delete ticket:** verifies ticket exists before delete

### Error handling

- `AppError` for operational errors (404, 400, etc.)
- Prisma errors mapped in `errorHandler.js` (P2025 → 404, P2003 → 400, P2002 → 409)
- Zod validation errors return 400 with joined messages

### Constants

`constants/index.js` exports enum values and pagination defaults (`DEFAULT_PAGE=1`, `DEFAULT_LIMIT=10`, `MAX_LIMIT=100`).

---

## Chat Session — Step 3 (Jul 21, 2026)

### User request

Build Express API layer: architecture, ticket CRUD, comment APIs, pagination, filtering, validation, error handling. No auth, JWT, roles, file upload, AI, or frontend changes.

### What was built

1. Infrastructure: `asyncHandler`, `validate`, `errorHandler`, `apiResponse`, `AppError`, constants
2. Ticket module: repository, service, controller, routes, Zod validation
3. Comment module: repository, service, controller, routes, Zod validation
4. `userRepository` for existence checks on create/update/comment
5. `app.js` updated to register routes and error handler

### Bug fixed during testing

Pagination failed because `take` was passed as a string to Prisma. Fix: use `req.validated.query` after Zod coercion instead of assigning back to `req.query`.

### Verification (curl)

All endpoints tested successfully against seeded PostgreSQL data:

- Health check
- GET tickets with pagination and `status=OPEN` filter
- GET ticket by ID (includes relations)
- POST create ticket
- PUT update ticket (status, assignedToId)
- POST add comment
- GET comments
- DELETE ticket
- Validation errors (400)

### Seed user IDs (example from test run)

Use IDs from live DB or seed output; example customer/agent from seed:

- Customer (Olivia Taylor): `e317313b-b712-44f0-9806-e8379a76245f`
- Agent (David Miller): `287f13c0-4974-4c63-a4d4-9bbade8de4af`

---

## Conventions for Future Work

- JavaScript only in backend (no TypeScript)
- No database queries in controllers
- No business logic in routes
- Use `async/await` and `asyncHandler`
- Minimal, focused diffs; match existing patterns
- Add/update tests when behavior changes
- Do not add auth or AI until explicitly requested

---

## Commands

```bash
npm run dev:backend      # Start API (port from .env)
npm run dev:frontend     # Start Vite dev server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed database
```
