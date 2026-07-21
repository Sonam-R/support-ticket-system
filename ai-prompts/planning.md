# AI Prompts — Planning

## Prompt

> Build a support ticket management system with PostgreSQL, Prisma, Express API, and React frontend. Start with database schema and seed data. Include User, Ticket, Comment, Attachment, and TicketHistory models.

## AI Response Summary

Proposed Prisma schema with enum types (Role, TicketStatus, Priority, Category), entity relationships, and monorepo structure with layered backend.

## Accepted Output

- Entity relationships and enum definitions
- Monorepo layout with root `package.json`
- Seed script with sample users, tickets, comments, and history
- Index definitions on frequently queried columns

## Modified Output

- Added auth fields to User (`password`, `isActive`, `deletedAt`) in later phase
- Adjusted seed data volume for demo usability (8 users, multiple tickets)
- Set explicit `PORT=5001` for macOS AirPlay compatibility

## Rejected Suggestions

| Suggestion | Reason |
|------------|--------|
| TypeScript | Assignment uses JavaScript |
| Microservices split | Unnecessary for scope |
| MongoDB instead of PostgreSQL | Assignment specifies PostgreSQL + Prisma |
| Separate backend/frontend package.json | Monorepo simpler for Prisma sharing |

## Reasoning

Started with data model to establish the foundation. Prisma enums ensure type safety at the database level. Seed data enables immediate API testing without manual data entry.
