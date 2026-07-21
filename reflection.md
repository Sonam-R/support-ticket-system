# Reflection

## Purpose

Brief retrospective on the project build.

## What Went Well

- Layered backend architecture kept concerns separated and testable
- Prisma sped up schema iteration and seed data setup
- Integration tests caught pagination and status machine bugs early
- Using `allowedTransitions` from API avoided duplicating state machine in frontend

## Challenges

- macOS port 5000 conflict required config change
- Jest parallel workers caused test DB race conditions
- No users API meant deriving user list from ticket relations for forms

## What I Would Do Differently

- Add a minimal `/api/users` endpoint earlier to simplify create/comment forms
- Add frontend smoke tests with Vitest for critical flows
- Start with plain CSS from the beginning instead of introducing Tailwind first

## Learning

- State machines belong in the service layer with explicit transition rules
- Server-side filtering reduces frontend complexity
- Documentation during development saves time at submission

## Validation

Project meets acceptance criteria; tests pass; UI functional end-to-end.
