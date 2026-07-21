# Data Model

Source of truth: `prisma/schema.prisma`

## Entity Relationship Diagram

```text
User ──creates──> Ticket <──assigns── User
  │                  │
  │                  ├──> Comment
  │                  ├──> Attachment (schema only)
  │                  └──> TicketHistory
  │
  └──> Comment, TicketHistory (performedBy)
```

## User

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Auto-generated |
| name | String | Required | Display name |
| email | String | Unique | Login identifier |
| password | String | Required | bcrypt hashed |
| role | Role enum | Default VIEWER | ADMIN, SUPPORT_AGENT, VIEWER |
| isActive | Boolean | Default true | Inactive users cannot login |
| deletedAt | DateTime? | Nullable | Soft delete timestamp |
| createdAt | DateTime | Auto | Record creation |
| updatedAt | DateTime | Auto | Last update |

**Relations:** `createdTickets`, `assignedTickets`, `comments`, `historyEntries`

**Indexes:** `email`, `role`

## Ticket

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Auto-generated |
| title | String | Required, min 5 | Ticket subject |
| description | String | Required | Full description |
| status | TicketStatus | Default OPEN | Workflow state |
| priority | Priority | Default MEDIUM | LOW, MEDIUM, HIGH, URGENT |
| category | Category | Required | TECHNICAL, BILLING, ACCOUNT, GENERAL, OTHER |
| createdById | UUID | FK → User | Ticket creator |
| assignedToId | UUID? | FK → User | Optional assignee |
| createdAt | DateTime | Auto | Record creation |
| updatedAt | DateTime | Auto | Last update |

**Relations:** `createdBy`, `assignedTo`, `comments`, `attachments`, `history`

**Indexes:** `status`, `priority`, `category`, `createdAt`

## Comment

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Auto-generated |
| message | String | Required | Comment text |
| ticketId | UUID | FK → Ticket | Parent ticket (cascade delete) |
| userId | UUID | FK → User | Author (cascade delete) |
| createdAt | DateTime | Auto | Record creation |
| updatedAt | DateTime | Auto | Last update |

## TicketHistory

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Auto-generated |
| ticketId | UUID | FK → Ticket | Parent ticket (cascade delete) |
| action | String | Required | Action type (see below) |
| field | String? | Nullable | Changed field name |
| oldValue | String? | Nullable | Previous value |
| newValue | String? | Nullable | New value |
| performedById | UUID | FK → User | Who performed the action |
| createdAt | DateTime | Auto | When action occurred |

**Actions:** TICKET_CREATED, TICKET_UPDATED, ASSIGNED, UNASSIGNED, PRIORITY_CHANGED, STATUS_CHANGED, COMMENT_ADDED

**Index:** `[ticketId, createdAt]`

## Attachment (Schema Only)

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| fileName | String | Original filename |
| fileUrl | String | Storage URL |
| fileType | String | MIME type |
| ticketId | UUID | FK → Ticket |

Not exposed via API in current scope.

## Enums

| Enum | Values |
|------|--------|
| Role | ADMIN, SUPPORT_AGENT, VIEWER |
| TicketStatus | OPEN, IN_PROGRESS, RESOLVED, CLOSED, CANCELLED |
| Priority | LOW, MEDIUM, HIGH, URGENT |
| Category | TECHNICAL, BILLING, ACCOUNT, GENERAL, OTHER |

## Seed Data

`prisma/seed.js` creates:

- 1 Admin, 3 Support Agents, 4 Viewers (password: `Password123`)
- Sample tickets across statuses and priorities
- Comments and history entries for demonstration

Run: `npm run prisma:seed`

## Business Rules (Service Layer)

- User soft delete sets `deletedAt` and unassigns all tickets
- Status changes only via `statusTransitionService` state machine
- History logged automatically on create, update, assign, status change, and comment
- `createdById` and assignee must reference existing active users
