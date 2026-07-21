# Development Workflow

Step-by-step process used with Cursor AI during development.

## 1. Context Loading

Before each task:
- Open relevant source files (schema, routes, components)
- Review existing patterns in the same layer
- Check test files for expected behavior

## 2. Phased Implementation

| Phase | Focus | Validation |
|-------|-------|------------|
| 1 | Database schema + seed | `prisma migrate`, `prisma seed` |
| 2 | Backend ticket/comment API | `ticket-api.test.js` |
| 3 | Auth + RBAC | `auth-api.test.js`, `authorization.test.js` |
| 4 | User CRUD + history | `user-api.test.js`, `ticket-history.test.js` |
| 5 | Frontend pages | Manual walkthrough |
| 6 | Swagger, Docker, CI | `swagger.test.js`, `docker compose up` |
| 7 | Documentation + cleanup | Submission checklist |

## 3. Per-Feature Workflow

```
1. Prompt AI with context files and constraints
2. Review generated code — check patterns, security, scope
3. Run tests: npm test
4. Manual verification (curl or UI)
5. Fix issues — prompt AI for debugging if needed
6. Commit when stable (if requested)
7. Update documentation if behavior changed
```

## 4. Testing Workflow

```bash
# After backend changes
npm test

# After frontend auth/RBAC changes
npm run test:frontend

# Before submission
npm test && npm run test:frontend && npm run build && npm run build:backend
```

## 5. Docker Workflow

```bash
cp .env.example .env
# Set JWT_SECRET and VITE_API_URL
docker compose up --build
docker compose exec backend npx prisma db seed  # first run only
```

## 6. Documentation Workflow

- Update docs when features are added, not at the end only
- Final pass: verify every claim against codebase
- Remove outdated files (e.g., stale AI context docs)

## 7. Review Workflow

1. Ask AI to review against assignment spec
2. Create findings in `code-review-notes.md`
3. Apply fixes tracked in `review-fixes.md`
4. Re-run tests to confirm no regressions

## Validation Commands

```bash
npm run dev:backend     # API on :5001
npm run dev:frontend    # UI on :5173
npm test                # 223 backend tests
npm run test:frontend   # 15 frontend tests
npm run test:coverage   # Coverage report
npm run build           # Frontend build
npm run lint            # ESLint
```
