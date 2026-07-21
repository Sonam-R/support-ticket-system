# AI Prompts — Testing

## Prompt

> Add Jest integration tests for ticket API, comments, status transitions, validation, auth, authorization, user CRUD, ticket history, and edge cases. Use separate test database. Add Vitest frontend tests for auth and RBAC.

## AI Response Summary

Created 16 backend test suites with Supertest, test helpers, global setup for schema sync, and 2 frontend test files with Testing Library.

## Accepted Output

- Integration test approach over heavy mocking
- Separate `.env.test` database
- Tests for valid and invalid status transitions
- Auth and authorization test suites per role
- Edge-case tests for boundary conditions
- Frontend auth and RBAC component tests

## Modified Output

- Added `globalSetup.js` to fix parallel worker race on `db push`
- Set `maxWorkers: 1` in Jest config
- Added search filter test after implementing feature
- Added ticket history tests after history service
- Added swagger.test.js for OpenAPI endpoint

## Rejected Suggestions

| Suggestion | Reason |
|------------|--------|
| Mocking Prisma entirely | Integration tests against real DB more valuable |
| Snapshot testing API responses | Explicit assertions more maintainable |
| 100% coverage target | Diminishing returns; focused on critical paths |
| E2E Playwright tests | Out of scope; integration tests sufficient |

## Reasoning

Integration tests against PostgreSQL catch real issues (FK constraints, query behavior) that mocks miss. Test helpers for auth token generation reduce boilerplate across authorization tests.
