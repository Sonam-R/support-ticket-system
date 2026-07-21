# API Contract

## Purpose

Document REST API endpoints, request/response shapes, and error format.

## Base URL

- Development: `http://localhost:5001/api`
- Frontend proxy: `/api` → backend

## Response Envelope

**Success:** `{ "success": true, "data": <payload> }`

**Error:** `{ "success": false, "message": "Error message" }`

## Endpoints

### Health

`GET /health` → `{ "status": "OK", "message": "..." }`

### Tickets

| Method | Path | Description |
|--------|------|-------------|
| POST | `/tickets` | Create ticket |
| GET | `/tickets` | List with pagination, `?status=`, `?search=` |
| GET | `/tickets/:id` | Detail with comments, `allowedTransitions` |
| PUT | `/tickets/:id` | Update fields (not status) |
| PATCH | `/tickets/:id/status` | Change status |
| DELETE | `/tickets/:id` | Delete ticket |

### Comments

| Method | Path | Description |
|--------|------|-------------|
| POST | `/tickets/:ticketId/comments` | Add comment |
| GET | `/tickets/:ticketId/comments` | List comments |

## Create Ticket

```json
POST /api/tickets
{
  "title": "Payment issue",
  "description": "Payment failed",
  "priority": "HIGH",
  "category": "BILLING",
  "createdById": "uuid"
}
```

## Status Change

```json
PATCH /api/tickets/:id/status
{ "status": "IN_PROGRESS" }
```

Invalid transition → `400`: `"Cannot transition ticket from OPEN to CLOSED"`

## List Tickets

`GET /api/tickets?page=1&limit=10&status=OPEN&search=payment`

```json
{
  "success": true,
  "data": {
    "tickets": [...],
    "pagination": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
  }
}
```

## Ticket Detail

Includes `allowedTransitions: ["IN_PROGRESS", "CANCELLED"]` for OPEN tickets.

## Validation

Covered by `backend/tests/integration/*.test.js`.
