# Final AI Usage Summary

## Tool

**Cursor AI** — primary AI assistant used throughout the project lifecycle in Cursor IDE Agent mode.

## Development Lifecycle

### Planning

- **AI role:** Proposed Prisma schema, monorepo structure, implementation phases
- **Human role:** Reviewed entity relationships, enum values, phased delivery plan
- **Output:** `requirements-analysis.md`, `implementation-plan.md`, `data-model.md`

### Architecture

- **AI role:** Designed layered backend (route → controller → service → repository), auth flow, RBAC matrix
- **Human role:** Validated separation of concerns, chose JWT over sessions, defined role permissions
- **Output:** `design-notes.md`, middleware and service structure

### Code Generation

- **AI role:** Scaffolded controllers, services, repositories, React pages, components, test suites
- **Human role:** Reviewed every generated file; rejected over-engineering; enforced plain CSS
- **Key decisions:** Accepted layered pattern and Zod validation; rejected UI libraries and TypeScript

### Refactoring

- **AI role:** Suggested removing Tailwind, moving search to backend, extracting shared components
- **Human role:** Approved refactors that aligned with assignment constraints
- **Changes:** `global.css` replacement, server-side filtering, `ErrorMessage` extraction

### Testing

- **AI role:** Generated integration test suites for all API modules
- **Human role:** Fixed DB setup race conditions, added edge-case tests, configured CI
- **Result:** 238 tests, ~96% backend coverage

### Documentation

- **AI role:** Drafted README, API contract, submission documents
- **Human role:** Edited for accuracy against actual codebase; removed outdated content
- **Output:** 17 root documents, 7 ai-prompts files, 5 cursor-workflow files

### Validation

- **AI role:** Suggested test commands, Docker configuration, CI workflow
- **Human role:** Ran all tests, verified Docker stack, manual UI walkthrough per role
- **Gate:** All 238 tests pass; builds succeed; no regressions

## Engineering Judgment Applied

| Decision | Accepted/Rejected | Reasoning |
|----------|-------------------|-----------|
| Layered Express architecture | Accepted | Matches assignment spec; testable |
| JWT + bcrypt auth | Accepted | Standard SPA pattern |
| RBAC with 3 roles | Accepted | Meets stretch goal requirements |
| Plain CSS | Accepted | Assignment constraint |
| Material UI / Tailwind | Rejected | Against spec; adds weight |
| GraphQL | Rejected | REST + OpenAPI sufficient |
| Mock-only tests | Rejected | Integration tests more valuable |
| Soft delete for users | Accepted | Preserves referential integrity |
| File attachments | Deferred | Schema only; API out of scope |

## Prompt Documentation

Per-phase prompt history with accepted/modified/rejected outputs:

| File | Phase |
|------|-------|
| `ai-prompts/planning.md` | Schema and project structure |
| `ai-prompts/design.md` | Architecture and state machine |
| `ai-prompts/implementation.md` | Backend and frontend code |
| `ai-prompts/testing.md` | Test suite generation |
| `ai-prompts/debugging.md` | Issue diagnosis and fixes |
| `ai-prompts/code-review.md` | Compliance review |
| `ai-prompts/documentation.md` | Submission docs |

## Workflow Documentation

Cursor-specific practices in `tool-specific/cursor-workflow/`:

- `project-rules.md` — Constraints and conventions
- `reusable-prompts.md` — Effective prompt templates
- `development-workflow.md` — Step-by-step dev process
- `coding-guidelines.md` — Code style and patterns
- `cursor-best-practices.md` — AI collaboration tips

## Summary

AI accelerated scaffolding and test generation significantly. Human oversight was essential for security (RBAC, JWT), architecture decisions, test infrastructure, documentation accuracy, and rejecting over-engineered solutions. Every AI output was reviewed, tested, and modified before acceptance.
