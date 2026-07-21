# Data Model

## Purpose

Document database entities and relationships.

## Source

`prisma/schema.prisma`

## Entities

### User

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| name | String | |
| email | String | Unique |
| role | Role enum | ADMIN, AGENT, CUSTOMER |

### Ticket

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| title | String | |
| description | String | |
| status | TicketStatus | OPEN, IN_PROGRESS, RESOLVED, CLOSED, CANCELLED |
| priority | Priority | LOW, MEDIUM, HIGH, URGENT |
| category | Category | TECHNICAL, BILLING, etc. |
| createdById | UUID | FK → User |
| assignedToId | UUID? | FK → User |

### Comment

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| message | String | |
| ticketId | UUID | FK → Ticket |
| userId | UUID | FK → User |

### Attachment, TicketHistory

Defined in schema; not exposed via API in current scope.

## Relationships

- User → many Tickets (created, assigned)
- Ticket → many Comments
- Ticket → many Attachments, TicketHistory

## Seed Data

`prisma/seed.js` — admin, agents, customers, sample tickets and comments.

## Validation

Schema enforced by Prisma migrations; business rules in service layer.
