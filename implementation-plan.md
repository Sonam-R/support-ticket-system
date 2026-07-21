# Implementation Plan

## Purpose

High-level build order and milestones for the project.

## Phases

### Phase 1 — Database (Step 2)

- Prisma schema with User, Ticket, Comment, Attachment, TicketHistory
- Seed data for development and testing

### Phase 2 — Backend API (Steps 3–6)

- Layered Express architecture
- Ticket CRUD, comments, pagination, filtering
- Zod validation and error middleware
- Status transition service and state machine
- Jest integration tests

### Phase 3 — Frontend (Step 7)

- React pages: TicketList, TicketDetails, CreateTicket
- Components: TicketCard, TicketForm, StatusActions, CommentSection, ErrorMessage
- Plain CSS in `global.css`
- Axios service layer with error interceptor
- Server-side search and status filter

### Phase 4 — Documentation & Submission

- README and submission docs
- AI prompt logs
- Cursor workflow notes
- Repository cleanup

## Decisions

- Monorepo with shared root `package.json`
- Vite proxy for `/api` in development
- No Tailwind — plain CSS per assignment spec

## Validation

Each phase verified before moving to the next; final run of `npm test` and `npm run build`.
