# API Contract

## Base URL

| Environment | URL |
|-------------|-----|
| Local API | `http://localhost:5001/api` |
| Vite dev proxy | `/api` → `http://localhost:5001/api` |
| Docker | `http://localhost:5001/api` |

## Response Envelope

**Success:**
```json
{ "success": true, "data": <payload> }
```

**Error:**
```json
{ "success": false, "message": "Error description" }
```

## Authentication

Protected endpoints require header:

```
Authorization: Bearer <jwt_token>
```

| Status | Condition |
|--------|-----------|
| 401 | Missing, expired, or invalid token |
| 403 | Valid token but insufficient role |

---

## Health

### `GET /health`

No authentication required.

**Response 200:**
```json
{ "status": "OK", "message": "Support Ticket API running" }
```

---

## Auth

### `POST /api/auth/login`

**Auth:** None

**Request:**
```json
{
  "email": "william.carter@supportdesk.com",
  "password": "Password123"
}
```

**Validation:** Email format required; password non-empty.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "token": "<jwt>",
    "user": { "id": "uuid", "name": "...", "email": "...", "role": "ADMIN" }
  }
}
```

**Errors:** 401 invalid credentials; 403 inactive account.

### `GET /api/auth/me`

**Auth:** Required

**Response 200:** Current user object (id, name, email, role).

### `POST /api/auth/logout`

**Auth:** Required

**Response 200:** `{ "message": "Logged out successfully" }` (client discards token).

---

## Tickets

### `POST /api/tickets`

**Auth:** ADMIN, SUPPORT_AGENT

**Request:**
```json
{
  "title": "Payment issue",
  "description": "Payment failed during checkout",
  "category": "BILLING",
  "priority": "HIGH",
  "createdById": "user-uuid",
  "assignedTo": "agent-uuid"
}
```

**Validation:** Title min 5 chars; description required; category enum required; priority optional (default MEDIUM); UUIDs validated.

**Response 201:** Created ticket with relations.

### `GET /api/tickets`

**Auth:** None (public read)

**Query params:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max 100) |
| `status` | enum | — | OPEN, IN_PROGRESS, RESOLVED, CLOSED, CANCELLED |
| `priority` | enum | — | LOW, MEDIUM, HIGH |
| `assignedTo` | uuid | — | Filter by assignee |
| `search` | string | — | Case-insensitive title/description search |
| `sortBy` | enum | createdAt | createdAt, updatedAt, priority, status, title |
| `order` | enum | desc | asc or desc |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "tickets": [...],
    "pagination": { "page": 1, "limit": 10, "total": 42, "totalPages": 5, "hasNext": true, "hasPrevious": false }
  }
}
```

### `GET /api/tickets/:id`

**Auth:** None

**Response 200:** Ticket with creator, assignee, comments, `allowedTransitions`.

**Errors:** 404 not found.

### `PUT /api/tickets/:id`

**Auth:** ADMIN, SUPPORT_AGENT

**Request:** Partial update (at least one field):
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "URGENT",
  "category": "TECHNICAL",
  "assignedToId": "uuid-or-null"
}
```

**Note:** Status cannot be changed via PUT — use PATCH /status.

**Response 200:** Updated ticket.

### `PATCH /api/tickets/:id/status`

**Auth:** ADMIN, SUPPORT_AGENT

**Request:**
```json
{ "status": "IN_PROGRESS" }
```

**Response 200:** Updated ticket.

**Errors:** 400 invalid transition — e.g. `"Cannot transition ticket from OPEN to CLOSED"`.

### `DELETE /api/tickets/:id`

**Auth:** ADMIN only

**Response 200:** `{ "message": "Ticket deleted successfully" }`

### `GET /api/tickets/:ticketId/history`

**Auth:** Required (any authenticated role)

**Response 200:** Array of history entries with `action`, `field`, `oldValue`, `newValue`, `performedBy`, `createdAt`.

**Actions:** TICKET_CREATED, TICKET_UPDATED, ASSIGNED, UNASSIGNED, PRIORITY_CHANGED, STATUS_CHANGED, COMMENT_ADDED

---

## Comments

### `POST /api/tickets/:ticketId/comments`

**Auth:** ADMIN, SUPPORT_AGENT

**Request:**
```json
{
  "message": "We are investigating the issue"
}
```

The authenticated user is recorded as the comment author.

**Response 201:** Created comment with user relation.

### `GET /api/tickets/:ticketId/comments`

**Auth:** None

**Response 200:** Array of comments ordered by `createdAt`.

---

## Users

### `POST /api/users`

**Auth:** ADMIN

**Request:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "SUPPORT_AGENT",
  "password": "Password123"
}
```

**Validation:** Name required; email format; role enum; password min 8 chars.

**Response 201:** Created user (password excluded).

### `GET /api/users/assignable`

**Auth:** ADMIN, SUPPORT_AGENT

**Response 200:** Array of active Admin and Support Agent users for assignment dropdowns.

### `GET /api/users`

**Auth:** ADMIN

**Query params:** `page`, `limit`, `search`, `role`, `sortBy` (name, email, role, createdAt, updatedAt), `order`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": { ... }
  }
}
```

### `GET /api/users/:id`

**Auth:** ADMIN

**Response 200:** User with ticket stats (`assignedTickets`, `createdTickets`).

### `PATCH /api/users/:id`

**Auth:** ADMIN

**Request:** Partial update (name, email, role, password).

**Response 200:** Updated user.

**Errors:** 409 duplicate email.

### `DELETE /api/users/:id`

**Auth:** ADMIN

**Behavior:** Soft delete (`deletedAt` set); unassigns all tickets.

**Response 200:** `{ "message": "User deleted successfully" }`

---

## Common Error Responses

| Status | Example Message |
|--------|-----------------|
| 400 | Validation errors (joined Zod messages) |
| 401 | Authentication required. / Invalid token / Token expired |
| 403 | You do not have permission to perform this action. |
| 404 | Ticket not found / User not found |
| 409 | A user with this email already exists |
| 500 | Internal server error |

## Swagger

Interactive documentation: `GET /api/docs` (Swagger UI)

OpenAPI spec defined in `backend/src/config/openapi.js`.
