# Review Fixes

## Purpose

Track issues identified during review and their resolutions.

## Fixes Applied

| Issue | Fix |
|-------|-----|
| Client-side search duplicated backend logic | TicketList now passes `?search=` to API with debounce |
| Tailwind CSS against assignment spec | Removed; plain CSS in `global.css` |
| `.gitignore` only had `node_modules` | Added `.env`, `dist`, `coverage`, `*.log`, etc. |
| `allowedTransitions` not used in early UI | StatusActions renders only backend-provided transitions |
| Raw axios errors shown to users | `getErrorMessage()` utility for friendly messages |
| Dashboard/extra pages beyond spec | Removed; `/` redirects to `/tickets` |
| Committed `frontend/dist/` | Removed; added to `.gitignore` |

## Not Fixed (Out of Scope)

- No authentication
- No attachment upload
- No users list API

## Validation

Each fix verified manually or via `npm test` / `npm run build`.
