# AI Prompts — Design

## Prompt

> Design Express API architecture with route → controller → service → repository layers. Include status state machine for ticket workflow. Add JWT authentication and role-based authorization.

## AI Response Summary

Proposed folder structure, response envelope format (`{ success, data }`), status transition map, JWT middleware, and role-based `authorize` middleware.

## Accepted Output

- Layered architecture pattern
- `allowedTransitions` returned with ticket detail
- Separate `PATCH /status` endpoint for status changes
- Centralized error handler and Zod validation middleware
- JWT `authenticate` and `authorize` middleware
- Role constants: ADMIN, SUPPORT_AGENT, VIEWER

## Modified Output

- PUT restricted to non-status fields only
- Added CANCELLED transitions from OPEN and IN_PROGRESS
- History logging as separate service (`historyService.js`)
- Soft delete for users instead of hard delete

## Rejected Suggestions

| Suggestion | Reason |
|------------|--------|
| GraphQL API | REST sufficient; OpenAPI provides docs |
| Event-driven architecture | Over-engineered for assignment |
| Session-based auth with Redis | JWT stateless auth simpler for SPA |
| Global auth middleware on all routes | Public read endpoints needed for ticket list |

## Reasoning

Layered architecture keeps concerns separated and testable. Status machine in service layer prevents invalid transitions at a single point. RBAC enforced per-route allows fine-grained control.
