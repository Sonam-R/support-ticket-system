# Review Fixes

Improvements made after self-review and AI-assisted code review.

## Fixes Applied

| Issue | Fix | Verified By |
|-------|-----|-------------|
| Client-side search duplicated backend logic | TicketList passes `?search=` to API with 300ms debounce | `ticket-api.test.js`, manual |
| Tailwind CSS against assignment spec | Removed; plain CSS in `global.css` | Visual inspection |
| `.gitignore` incomplete | Added `.env`, `dist`, `coverage`, `*.log`, `frontend/dist` | Git status check |
| `allowedTransitions` not used in early UI | StatusActions renders only backend-provided transitions | `status-transition.test.js` |
| Raw axios errors shown to users | `getErrorMessage()` utility in `utils/errors.js` | Manual testing |
| Dashboard/extra pages beyond spec | Removed; `/` redirects to `/tickets` | Route inspection |
| Committed `frontend/dist/` | Removed; added to `.gitignore` | Git status check |
| No authentication | JWT auth with login page and AuthContext | `auth-api.test.js` |
| No RBAC | `authorize` middleware + RoleProtectedRoute | `authorization.test.js`, `rbac.test.jsx` |
| No users API | Full user CRUD with soft delete | `user-api.test.js` |
| No ticket history | historyService + TicketHistory component | `ticket-history.test.js` |
| Write actions visible to Viewer | permissions.js + conditional rendering | `rbac.test.jsx` |
| Assignee dropdown empty | `/api/users/assignable` endpoint | Manual testing |
| Docker missing migrations | Entrypoint script runs `prisma migrate deploy` | Docker startup |
| Outdated documentation | Full documentation pass against codebase | This submission |

## Not Implemented (Intentional)

| Item | Reason |
|------|--------|
| File attachment upload | Schema exists; API not in scope |
| Email notifications | Future improvement |
| Refresh token flow | JWT with configurable expiry sufficient |
| E2E browser tests | Manual walkthrough + integration tests |

## Validation

Each fix verified via automated tests (`npm test`, `npm run test:frontend`) or manual UI walkthrough per role.
