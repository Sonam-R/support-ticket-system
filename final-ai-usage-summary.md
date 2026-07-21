# Final AI Usage Summary

## Purpose

Overview of how AI (Cursor) was used across the project lifecycle.

## Tool

**Cursor AI** — used for planning, implementation, testing, debugging, and documentation.

## Usage by Phase

| Phase | AI Role | Human Role |
|-------|---------|------------|
| Database schema | Generated Prisma models from spec | Reviewed relations and enums |
| Backend API | Scaffolded layered architecture | Verified patterns, ran curl tests |
| State machine | Implemented transition service | Validated rules against spec |
| Integration tests | Generated test suites | Fixed DB setup race conditions |
| Frontend UI | Built pages and components | Chose plain CSS over Tailwind |
| Documentation | Drafted submission docs | Edited for accuracy and brevity |

## Engineering Judgment Applied

- Rejected heavy UI frameworks (Material UI, Ant Design)
- Rejected client-side-only search when backend supported it
- Rejected committing `.env` and build artifacts
- Accepted layered architecture matching assignment spec
- Accepted Zod validation on both frontend and backend

## Prompt Documentation

Detailed per-category logs in `ai-prompts/`.

## Workflow Documentation

Cursor-specific notes in `tool-specific/cursor-workflow/`.

## Validation

AI output always reviewed, tested, and modified before acceptance.
