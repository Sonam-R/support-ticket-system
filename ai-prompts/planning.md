# AI Prompts — Planning

## Prompt Used

> Build a support ticket management system with PostgreSQL, Prisma, Express API, and React frontend. Start with database schema and seed data.

## AI Response Summary

Proposed Prisma schema with User, Ticket, Comment, Attachment, TicketHistory models and enum types. Suggested monorepo structure with layered backend.

## Accepted

- Entity relationships and enum definitions
- Monorepo layout with root package.json
- Seed script with sample users and tickets

## Modified

- Adjusted seed data volume for demo usability
- Set explicit PORT configuration for macOS compatibility

## Rejected

- TypeScript suggestion — kept JavaScript per assignment constraints
- Microservices split — unnecessary for scope
