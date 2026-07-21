# Code Review Notes

Self-review and AI-assisted review findings.

## Strengths

- Clear layered backend separation (route → controller → service → repository)
- Status machine centralized in `statusTransitionService.js`
- History logging isolated in `historyService.js`
- Consistent API response envelope `{ success, data/message }`
- Frontend uses backend `allowedTransitions` — no duplicated state logic
- RBAC enforced on both API and UI layers
- Comprehensive test suite (238 tests, ~96% backend coverage)
- Swagger/OpenAPI for API discoverability

## AI-Generated Suggestions

| Suggestion | Decision | Reason |
|------------|----------|--------|
| Add TypeScript | Rejected | Assignment uses JavaScript; no migration benefit at this stage |
| Use Material UI / Ant Design | Rejected | Assignment requires plain CSS; adds bundle weight |
| GraphQL instead of REST | Rejected | REST sufficient; OpenAPI provides documentation |
| Mock all Prisma in tests | Rejected | Integration tests against real DB more valuable |
| Client-side search/filter | Rejected | Server-side avoids duplicate logic and scales better |
| Event-driven architecture | Rejected | Over-engineered for assignment scope |
| Store JWT in httpOnly cookie | Deferred | localStorage simpler for SPA; cookie requires CSRF handling |

## Manual Review Observations

| Area | Finding | Action |
|------|---------|--------|
| Controllers | Thin, no DB access | No change needed |
| Error handling | Centralized middleware | Kept |
| Auth middleware | Applied per-route, not global | Kept — public read endpoints intentional |
| Frontend search | Initially client-side | Fixed — server-side with debounce |
| CSS | Tailwind introduced early | Replaced with `global.css` |
| Secrets | `.env` not in `.gitignore` initially | Updated `.gitignore` |
| Build artifacts | `frontend/dist` committed | Removed; added to `.gitignore` |
| User delete | Hard delete considered | Implemented soft delete for data integrity |
| Comment auth | Initially open POST | Added `authenticate` middleware |

## Accepted Improvements

- `ErrorMessage` component for consistent error display
- `getErrorMessage()` utility for axios error mapping
- `RoleProtectedRoute` for frontend RBAC
- `ConfirmDialog` for destructive actions (delete user/ticket)
- Debounced search (300ms) to reduce API calls
- `Forbidden` page for unauthorized route access
- Docker entrypoint script for automatic migrations

## Rejected Suggestions

| Suggestion | Reason |
|------------|--------|
| Refresh token rotation | Out of scope; adds complexity without assignment requirement |
| Rate limiting middleware | Not required; noted as future improvement |
| Redis session store | JWT stateless auth sufficient for scope |
| Full frontend test coverage | Focused on auth/RBAC tests; manual testing for UI flows |

## Validation

Review performed before final submission. Critical items addressed; deferred items documented in README future improvements.
