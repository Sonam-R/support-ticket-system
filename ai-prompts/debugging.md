# AI Prompts — Debugging

## Prompts

### Pagination failure
> Pagination fails with Prisma error. `take` parameter seems wrong.

### Test DB race
> Tests fail with P2002 on database creation when running in parallel.

### Auth issues
> API calls return 401 after login. Token not being sent.

### Docker startup
> Backend container fails without JWT_SECRET. Database schema not applied on first run.

## AI Response Summary

Identified string coercion issue with query params, parallel Jest workers racing on schema push, missing axios interceptor, and Docker env/migration configuration.

## Accepted Output

- Fix: use `req.validated.query` for coerced pagination values
- Fix: `globalSetup.js` for one-time schema sync, `maxWorkers: 1`
- Fix: axios request interceptor attaches Bearer token
- Fix: Docker entrypoint runs `prisma migrate deploy`
- Fix: `${JWT_SECRET:?required}` in docker-compose.yml

## Modified Output

- Added explicit `setup-env.js` to load `.env.test`
- Added `isActive` check in authService for inactive users
- User soft delete unassigns tickets before setting `deletedAt`

## Rejected Suggestions

| Suggestion | Reason |
|------------|--------|
| Disabling failing tests | Fixed root cause instead |
| Using SQLite for tests | Kept PostgreSQL for parity |
| Removing pagination | Fixed coercion, not feature |
| Hard delete users | Soft delete preserves integrity |

## Reasoning

AI quickly identified likely causes from error messages. Human verification confirmed fixes via test runs. Root cause fixes preferred over workarounds.
