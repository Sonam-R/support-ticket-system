# Cursor Project Rules

Rules and constraints followed during AI-assisted development.

## Assignment Constraints

- JavaScript only (no TypeScript in backend or frontend)
- Plain CSS only (no Tailwind, Material UI, or component libraries)
- PostgreSQL + Prisma for database
- Layered backend architecture (route → controller → service → repository)
- Minimal dependencies — justify any new package

## Code Modification Rules

- Do not modify working business logic during documentation/cleanup phases
- Do not change database schema or API behavior without explicit request
- Keep diffs minimal and focused on the task at hand
- Match existing naming, folder structure, and formatting conventions
- No database queries in controllers; no business logic in routes

## Security Rules

- Never commit `.env`, secrets, or credentials
- Never hardcode JWT secrets or database passwords
- Always hash passwords with bcrypt
- Enforce RBAC on both API and UI layers
- Validate all inputs with Zod on API; forms on frontend

## Testing Rules

- Add or update tests when behavior changes
- Use separate test database (`.env.test`)
- Run `npm test` after backend changes
- Run `npm run test:frontend` after frontend auth/RBAC changes

## Documentation Rules

- Every document must accurately describe the implemented project
- No placeholder documentation
- Reuse information from codebase (routes, schema, test counts)
- Keep documents concise to minimize repository size

## Git Rules

- Do not commit `node_modules`, `dist`, `coverage`, or `.env`
- Do not commit build artifacts
- Use clear commit messages when requested

## AI Interaction Rules

- Review all AI-generated code before accepting
- Test AI output before moving to next task
- Reject over-engineering (GraphQL, microservices, heavy frameworks)
- Document prompts and decisions in `ai-prompts/`
