# AI Prompts — Debugging

## Prompt Used

> Pagination fails with Prisma error. Tests fail with P2002 on database creation.

## AI Response Summary

Identified string coercion issue with query params and parallel Jest workers racing on schema push.

## Accepted

- Fix: use `req.validated.query` for coerced pagination values
- Fix: globalSetup for one-time schema sync

## Modified

- Added explicit `setup-env.js` to load `.env.test`

## Rejected

- Disabling tests — fixed root cause instead
- Using SQLite for tests — kept PostgreSQL for parity
