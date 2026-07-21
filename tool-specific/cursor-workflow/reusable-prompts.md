# Reusable Prompts

Effective prompt templates used during development.

## Scaffolding

```
Build [feature] following the existing layered architecture:
route → controller → service → repository.
Use Zod validation. Match patterns in [existing-file].
Do not modify unrelated code.
```

## Testing

```
Add Jest integration tests for [endpoint/feature].
Use the test helpers in backend/tests/helpers/.
Follow patterns in [existing-test-file].
Test happy path, validation errors, and 404 cases.
```

## Debugging

```
[Error message or symptom].
Relevant files: [file1], [file2].
Do not change API behavior. Fix the root cause.
```

## Code Review

```
Review [files/changes] for assignment compliance:
- Plain CSS (no Tailwind)
- Server-side search/filter
- RBAC enforced on API and UI
- No secrets or build artifacts
List issues with suggested fixes.
```

## Documentation

```
Update [document-name] to accurately reflect the current codebase.
Source of truth: [schema/routes/tests].
Do not add placeholder content.
Keep concise.
```

## Frontend Feature

```
Add [page/component] to the React frontend.
Use existing hooks and services patterns.
Apply RoleProtectedRoute for [roles].
Style with global.css only — no CSS frameworks.
```

## Auth/RBAC

```
Protect [endpoint] with authenticate and authorize middleware.
Allowed roles: [ADMIN, SUPPORT_AGENT].
Add corresponding frontend permission check in permissions.js.
Add authorization test in authorization.test.js.
```

## Docker/CI

```
Add [service/step] to Docker Compose / GitHub Actions.
Follow existing patterns in docker-compose.yml / ci.yml.
Ensure env vars are documented in .env.example.
```

## Tips

- Reference specific files with `@filename` for context
- State constraints explicitly ("do not change schema", "plain CSS only")
- Ask for minimal diffs to avoid unrelated changes
- Request test updates alongside code changes
