# Tool Workflow

This project was built with **Cursor AI** in Agent mode. This document is the root-level workflow summary required for submission. Detailed workflow files live in [`tool-specific/cursor-workflow/`](./tool-specific/cursor-workflow/).

## Tool Used

| Field | Value |
|-------|-------|
| **IDE / Tool** | Cursor |
| **Mode** | Agent mode with project rules |
| **AI prompt history** | [`ai-prompts/`](./ai-prompts/) |
| **Usage summary** | [`final-ai-usage-summary.md`](./final-ai-usage-summary.md) |

## Development Phases

1. **Planning** — Requirements, acceptance criteria, implementation plan (`ai-prompts/planning.md`)
2. **Design** — Architecture, data model, API contract, UI flows (`ai-prompts/design.md`)
3. **Implementation** — Backend API, frontend UI, Prisma schema (`ai-prompts/implementation.md`)
4. **Testing** — Integration, unit, and RBAC tests (`ai-prompts/testing.md`)
5. **Debugging** — Issues and fixes documented (`ai-prompts/debugging.md`, `debugging-notes.md`)
6. **Code review** — Self-review and audit fixes (`ai-prompts/code-review.md`, `code-review-notes.md`)
7. **Documentation** — README, submission docs, OpenAPI (`ai-prompts/documentation.md`)

## Workflow Documents

| Document | Purpose |
|----------|---------|
| [project-rules.md](./tool-specific/cursor-workflow/project-rules.md) | Constraints, security, and modification rules |
| [development-workflow.md](./tool-specific/cursor-workflow/development-workflow.md) | Phased development process |
| [reusable-prompts.md](./tool-specific/cursor-workflow/reusable-prompts.md) | Effective prompt templates |
| [coding-guidelines.md](./tool-specific/cursor-workflow/coding-guidelines.md) | Code style and patterns |
| [cursor-best-practices.md](./tool-specific/cursor-workflow/cursor-best-practices.md) | AI collaboration lessons learned |

## How AI Was Used Responsibly

- **Human review** — Every generated file was reviewed before acceptance
- **Iterative refinement** — Prompts refined when output did not match requirements
- **Validation** — Changes verified with automated tests (`npm test`, `npm run test:frontend`)
- **Engineering judgment** — Rejected over-engineering (e.g. Tailwind, unnecessary abstractions)
- **Documentation** — Prompt history preserved in `ai-prompts/` for transparency

## Repository Layout vs Assessment Template

This is a full-stack monorepo. The assessment template’s generic `src/` and `tests/` map to:

| Template | This project |
|----------|--------------|
| `src/` | `backend/src/` (Express API) and `frontend/src/` (React UI) |
| `tests/` | `backend/tests/` (Jest) and `frontend/src/test/` (Vitest) |
| `database/schema-or-migrations` | `prisma/schema.prisma` + `prisma/migrations/` (see `database/`) |
| `database/seed-data` | `prisma/seed.js` (see `database/seed-data/`) |

See [README.md](./README.md) for the complete folder structure.
