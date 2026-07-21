# Test Results

**Execution date:** Tuesday, July 21, 2026

**Command:**

```bash
npm test
```

(from project root, runs `jest` in `backend/`)

**Test database:** `postgresql://sonam@localhost:5432/support_ticket_test` (separate from development DB)

**Result:** 4 test suites, 26 tests — all passed

---

## Ticket API (`ticket-api.test.js`)

| Test | Result |
|------|--------|
| POST /api/tickets — creates ticket with valid payload | PASS |
| GET /api/tickets — returns tickets with correct structure | PASS |
| GET /api/tickets — pagination works | PASS |
| GET /api/tickets/:id — includes creator, assignee, comments | PASS |
| PUT /api/tickets/:id — updates title, description, priority, assignedToId | PASS |
| GET /api/tickets?status=OPEN — status filter | PASS |
| GET /api/tickets?search=payment — keyword search | PASS |
| GET /api/tickets/:id — 404 for non-existent ticket | PASS |

---

## Comment API (`comment-api.test.js`)

| Test | Result |
|------|--------|
| POST /api/tickets/:ticketId/comments — creates comment (201) | PASS |
| GET /api/tickets/:ticketId/comments — lists comments | PASS |

---

## State Machine (`status-transition.test.js`)

### Valid transitions

| Transition | Result |
|------------|--------|
| OPEN → IN_PROGRESS | PASS |
| IN_PROGRESS → RESOLVED | PASS |
| RESOLVED → CLOSED | PASS |
| OPEN → CANCELLED | PASS |
| IN_PROGRESS → CANCELLED | PASS |

### Rejected correctly (400)

| Transition | Result |
|------------|--------|
| OPEN → CLOSED | PASS |
| OPEN → RESOLVED | PASS |
| IN_PROGRESS → CLOSED | PASS |
| RESOLVED → OPEN | PASS |
| RESOLVED → CANCELLED | PASS |
| CLOSED → OPEN | PASS |
| CANCELLED → OPEN | PASS |

---

## Validation (`validation.test.js`)

| Test | Result |
|------|--------|
| Missing title — 400 | PASS |
| Missing description — 400 | PASS |
| Invalid priority — 400 | PASS |
| Invalid status (UNKNOWN) — 400 | PASS |

---

## Debugging Performed

1. **Parallel test DB setup race:** Initial runs failed when multiple Jest workers called `prisma db push` concurrently (`P2002` on `datname`). Fixed by adding `globalSetup.js` for one-time schema sync and `maxWorkers: 1`.

2. **Prisma config env loading:** `prisma.config.ts` loads root `.env` by default. `globalSetup` and `setup-env.js` explicitly load `.env.test` and pass `DATABASE_URL` for test isolation.

3. **Search filter:** Added optional `search` query parameter to ticket list API (required by spec) with case-insensitive title/description matching.

---

## Files Added / Modified

**New:**

- `backend/jest.config.js`
- `backend/package.json`
- `backend/tests/setup-env.js`
- `backend/tests/setup.js`
- `backend/tests/globalSetup.js`
- `backend/tests/helpers.js`
- `backend/tests/integration/ticket-api.test.js`
- `backend/tests/integration/comment-api.test.js`
- `backend/tests/integration/status-transition.test.js`
- `backend/tests/integration/validation.test.js`
- `.env.test`

**Modified:**

- `package.json` — added `test` script and devDependencies (`jest`, `supertest`)
- `backend/src/validations/ticketValidation.js` — added `search` query param
- `backend/src/services/ticketService.js` — added keyword search filter
