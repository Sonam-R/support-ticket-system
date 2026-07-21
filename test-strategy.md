# Test Strategy

## Purpose

Document testing approach and coverage.

## Backend Integration Tests

**Framework:** Jest + Supertest

**Location:** `backend/tests/integration/`

| Suite | Coverage |
|-------|----------|
| ticket-api.test.js | CRUD, pagination, search, filter, 404 |
| comment-api.test.js | Create and list comments |
| status-transition.test.js | Valid and invalid transitions |
| validation.test.js | Missing/invalid fields |

**Test DB:** Separate `support_ticket_test` via `.env.test`

**Run:** `npm test` (26 tests)

## Frontend Testing

No automated frontend tests in scope. Manual validation via acceptance checklist.

## What Is Tested

- API contracts and response shapes
- Status state machine rules
- Validation error responses (400)
- Pagination and search query params

## What Is Not Tested

- UI component rendering
- E2E browser flows
- Authentication (not implemented)

## CI Recommendation

Run `npm test` on every PR; add `npm run build` for frontend compile check.
