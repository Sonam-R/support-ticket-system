# Debugging Notes

Issues encountered during development and their resolutions.

## Backend

### Pagination type coercion

**Issue:** Prisma `take`/`skip` received strings from query params, causing runtime errors.

**Fix:** Read coerced values from `req.validated.query` after Zod middleware instead of raw `req.query`.

### Parallel test DB setup race

**Issue:** Multiple Jest workers calling `prisma db push` concurrently caused `P2002` (duplicate database).

**Fix:** `globalSetup.js` for one-time schema sync; `maxWorkers: 1` in Jest config.

### Prisma config env loading

**Issue:** Test runs loaded root `.env` instead of `.env.test`.

**Fix:** `setup-env.js` and `globalSetup.js` explicitly load `.env.test` and pass `DATABASE_URL`.

### Search filter missing

**Issue:** Assignment required server-side keyword search on ticket list.

**Fix:** Added `search` query param to Zod validation and `ticketService` filter with case-insensitive `contains`.

### JWT secret missing in Docker

**Issue:** Backend container failed to start without `JWT_SECRET`.

**Fix:** Docker Compose uses `${JWT_SECRET:?JWT_SECRET is required}` to enforce the variable.

### User soft delete referential integrity

**Issue:** Deleting a user with assigned tickets caused FK constraint errors.

**Fix:** `userService.deleteUser` unassigns all tickets before setting `deletedAt`.

## Frontend

### Port conflict on macOS

**Issue:** Port 5000 used by AirPlay Receiver.

**Fix:** Default `PORT=5001` in `.env`; Vite proxy targets 5001.

### Tailwind removal

**Issue:** Assignment requires plain CSS, not CSS frameworks.

**Fix:** Replaced Tailwind classes with `global.css`; removed tailwind dependencies.

### Auth token not attached to requests

**Issue:** API calls after login returned 401.

**Fix:** Axios request interceptor reads token from `localStorage` and sets `Authorization` header.

### Viewer seeing write actions

**Issue:** Create ticket and edit buttons visible to read-only users.

**Fix:** `permissions.js` helpers and conditional rendering; `RoleProtectedRoute` on write pages.

### Assignee dropdown empty

**Issue:** No users API initially; forms couldn't populate assignee list.

**Fix:** Added `GET /api/users/assignable` endpoint and `useAssignableUsers` hook.

## Docker

### Backend migration on startup

**Issue:** Fresh Docker stack had empty database schema.

**Fix:** `scripts/docker-backend-entrypoint.sh` runs `prisma migrate deploy` before starting server.

### Frontend API URL in Docker

**Issue:** Browser couldn't reach backend using internal Docker hostname.

**Fix:** `VITE_API_URL` build arg set to `http://localhost:5001/api` (browser-accessible).

## Authentication

### Inactive user login

**Issue:** Deactivated users could still authenticate.

**Fix:** `authService.login` checks `isActive` and returns 403.

### Role not in JWT payload

**Issue:** `authorize` middleware couldn't check roles.

**Fix:** JWT signed with `{ id, email, role }`; decoded in `authenticate` middleware.

## Validation

All fixes verified via `npm test` (223 tests) and manual UI testing per role.
