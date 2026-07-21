# UI Flow

## Purpose

Describe user navigation and screen interactions.

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Redirect | → `/tickets` |
| `/tickets` | TicketList | List, search, filter |
| `/tickets/create` | CreateTicket | New ticket form |
| `/tickets/:id` | TicketDetails | View, edit, status, comments |

## Ticket List Flow

1. User lands on `/tickets`
2. Tickets load from `GET /api/tickets`
3. User types in search → debounced `?search=` request
4. User selects status filter → `?status=` request
5. User clicks **View Details** → navigate to detail page

## Create Ticket Flow

1. User clicks **Create Ticket**
2. Fills form (title, description, category, priority, created by)
3. Client validation via Zod
4. `POST /api/tickets` → redirect to detail page

## Ticket Detail Flow

1. `GET /api/tickets/:id` loads ticket with `allowedTransitions`
2. User sees title, description, priority, assignee, status
3. **Edit Ticket** toggles inline form → `PUT /api/tickets/:id`
4. Status buttons call `PATCH /api/tickets/:id/status`
5. Comments section lists existing; form posts new comment

## Error States

- API failure → `ErrorMessage` banner
- Invalid status transition → inline error on status section
- Empty list → "No tickets found" with create action

## Validation

Manual walkthrough per acceptance-criteria.md.
