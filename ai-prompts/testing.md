# AI Prompts — Testing

## Prompt Used

> Add Jest integration tests for ticket API, comments, status transitions, and validation. Use separate test database.

## AI Response Summary

Created four test suites with Supertest, test helpers, and global setup for schema sync.

## Accepted

- Integration test approach over heavy mocking
- Separate `.env.test` database
- Tests for valid and invalid status transitions

## Modified

- Added `globalSetup.js` to fix parallel worker race on `db push`
- Set `maxWorkers: 1` in Jest config
- Added search filter test after implementing feature

## Rejected

- Mocking Prisma entirely — integration tests more valuable
- Snapshot testing API responses — explicit assertions preferred
