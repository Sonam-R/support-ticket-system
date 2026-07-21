# Design Notes

## Purpose

Key design decisions for architecture and UI.

## Backend Architecture

```
Request → Route → Controller → Service → Repository → Prisma
```

- **Controllers** — HTTP only; no business logic
- **Services** — Business rules, status transitions, user existence checks
- **Repositories** — Prisma queries only

## Status State Machine

| From | Allowed To |
|------|------------|
| OPEN | IN_PROGRESS, CANCELLED |
| IN_PROGRESS | RESOLVED, CANCELLED |
| RESOLVED | CLOSED |
| CLOSED | (terminal) |
| CANCELLED | (terminal) |

`allowedTransitions` computed in service and returned with ticket detail.

## Frontend Structure

```
pages/          TicketList, TicketDetails, CreateTicket
components/     TicketCard, TicketForm, StatusActions, CommentSection, ErrorMessage
styles/         global.css
```

## UI Approach

- Card-based ticket list (not data table)
- Status action buttons driven by `allowedTransitions` from API
- Shared `ErrorMessage` component for API/validation failures
- Debounced search (300ms) calling backend `?search=`

## Error Handling

- Axios interceptor maps network failures to friendly message
- Backend validation messages passed through without exposing stack traces
- Status transition errors shown inline on detail page

## Validation

Design validated against integration tests and manual UI walkthrough.
