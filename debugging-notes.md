# Debugging Notes

## Purpose

Record issues encountered and fixes applied during development.

## Backend

### Pagination type coercion

**Issue:** Prisma `take` received string from query params.

**Fix:** Read coerced values from `req.validated.query` after Zod middleware.

### Parallel test DB setup

**Issue:** Jest workers racing on `prisma db push` caused `P2002`.

**Fix:** `globalSetup.js` for one-time schema sync; `maxWorkers: 1`.

### Search filter

**Issue:** Assignment required server-side search.

**Fix:** Added `search` query param to validation and ticket service filter.

## Frontend

### Port conflict

**Issue:** macOS AirPlay uses port 5000.

**Fix:** Default `PORT=5001` in `.env`; Vite proxy targets 5001.

### Tailwind removal

**Issue:** Assignment requires plain CSS, not CSS frameworks.

**Fix:** Replaced Tailwind classes with `global.css`; removed tailwind deps.

### User selection for comments

**Issue:** No users API; need `userId` for comments.

**Fix:** Extract users from ticket `createdBy`/`assignedTo` relations.

## Validation

Issues verified fixed via `npm test` and manual UI testing.
