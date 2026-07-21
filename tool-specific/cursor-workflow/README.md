# Cursor Workflow

## Purpose

Document how Cursor AI was used for this project.

## Setup

- Opened project in Cursor IDE
- Used Agent mode for multi-file implementation
- Referenced `docs/AI_CONTEXT.md` for continuity across sessions

## Workflow

### 1. Context Loading

- Opened relevant files (schema, routes, existing components)
- Used `@docs/AI_CONTEXT.md` in prompts for backend context

### 2. Step-by-Step Implementation

Each assignment step was a focused prompt:
- Step 2: Database schema
- Step 3: Express API
- Steps 4–6: Comments, state machine, tests
- Step 7: Frontend polish and documentation

### 3. Code Review Workflow

- Asked Cursor to review changes against assignment spec
- Used findings to create `review-fixes.md` and apply fixes
- Ran `npm test` and `npm run build` after each major change

### 4. Validation Approach

```bash
npm run dev:backend    # Manual API checks
npm run dev:frontend   # UI walkthrough
npm test               # Integration tests
npm run build          # Compile check
npm run lint           # ESLint
```

## Important Prompts

1. "Build layered Express API with ticket CRUD and validation"
2. "Implement status state machine with allowedTransitions"
3. "Add Jest integration tests with separate test DB"
4. "Build React UI with plain CSS, server-side search/filter"

## Best Practices Followed

- Reviewed all AI-generated code before accepting
- Kept diffs minimal and focused
- Rejected over-engineering (auth, GraphQL, UI libraries)
- Documented prompts and decisions in `ai-prompts/`

## Validation

Final submission verified against acceptance-criteria.md checklist.
