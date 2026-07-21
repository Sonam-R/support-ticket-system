# Reflection

## What Was Built

A full-stack Support Ticket Management System with:

- React frontend with JWT authentication and role-based UI
- Express API with layered architecture and comprehensive validation
- PostgreSQL database managed by Prisma with migrations and seed data
- Ticket CRUD, comments, assignment, and activity history timeline
- Full user management with soft delete
- Search, filtering, sorting, and pagination on tickets and users
- Swagger/OpenAPI documentation
- 238 automated tests with ~96% backend coverage
- Docker Compose deployment and GitHub Actions CI

## How AI Was Used

Cursor AI assisted across the entire lifecycle:

1. **Planning** — Schema design, folder structure, implementation phases
2. **Implementation** — Scaffolding controllers, services, React pages and components
3. **Testing** — Generating integration and unit test suites
4. **Debugging** — Diagnosing pagination coercion, test DB races, auth issues
5. **Code review** — Flagging Tailwind usage, client-side search, missing RBAC
6. **Documentation** — Drafting submission documents edited for accuracy

Detailed prompt logs in `ai-prompts/`; workflow notes in `tool-specific/cursor-workflow/`.

## Where AI Was Helpful

- Rapid scaffolding of layered backend architecture matching best practices
- Generating comprehensive test suites covering edge cases
- Diagnosing Prisma/Jest configuration issues quickly
- Drafting API documentation from route definitions
- Building React components with consistent patterns

## Where Manual Decisions Were Necessary

- Choosing plain CSS over Tailwind/component libraries (assignment constraint)
- Designing the RBAC role matrix and enforcing it on both API and UI
- Fixing test database isolation (globalSetup, maxWorkers)
- Deciding soft delete over hard delete for users
- Port configuration for macOS compatibility
- Reviewing and correcting AI-generated code before acceptance
- Ensuring documentation accurately reflects implemented features

## Lessons Learned

- State machines belong in the service layer with explicit transition rules returned to the client
- Server-side filtering reduces frontend complexity and avoids logic duplication
- Integration tests against real PostgreSQL catch issues that mocks miss
- Documentation written during development is easier to maintain than a final rush
- AI accelerates scaffolding but requires human review for security, architecture, and accuracy
- RBAC must be enforced at both API and UI layers — UI-only checks are insufficient

## Future Improvements

- File attachment upload using existing Attachment model
- Email notifications on assignment and status changes
- E2E tests with Playwright
- Refresh token rotation and password reset
- Rate limiting and admin audit logging
- Real-time updates via WebSockets

## Validation

Project meets all acceptance criteria. Tests pass (238/238). Docker stack runs. Documentation complete. Ready for submission.
