# Cursor Best Practices

Lessons learned from AI-assisted development on this project.

## Prompting

1. **Be specific about constraints** — "plain CSS only", "do not change schema", "match existing patterns in ticketController.js"
2. **Reference files with @** — `@prisma/schema.prisma`, `@backend/src/routes/ticketRoutes.js`
3. **Request minimal diffs** — "only modify files related to user CRUD"
4. **One feature per prompt** — avoid multi-feature prompts that produce large unreviewable diffs
5. **Include validation criteria** — "add tests", "run npm test", "verify with curl"

## Code Review

1. **Never blindly accept AI output** — read every generated line
2. **Check security** — auth middleware on protected routes, no hardcoded secrets
3. **Verify patterns match** — new code should look like existing code
4. **Run tests immediately** — catch regressions before moving on
5. **Reject over-engineering** — AI tends toward complex solutions; push back

## Common AI Pitfalls Avoided

| Pitfall | How Avoided |
|---------|-------------|
| Adding unnecessary dependencies | Stated "no new deps unless necessary" |
| Introducing TypeScript | Explicit JavaScript constraint |
| Client-side logic duplication | Specified "server-side search/filter" |
| Missing auth on new endpoints | Required auth + authorize in every prompt |
| Large refactors | "Do not refactor unrelated code" |
| Outdated documentation | Final pass against actual codebase |

## Session Management

- Use Agent mode for multi-file changes
- Keep context focused — open only relevant files
- Break large tasks into phases with test gates
- Document decisions in `ai-prompts/` as you go, not just at the end

## Testing with AI

- Ask AI to generate tests alongside features
- Review test assertions — ensure they test behavior, not implementation
- Fix test infrastructure issues (DB setup) before adding more tests
- Use test helpers to reduce duplication

## Documentation with AI

- Draft with AI, verify against code manually
- Remove outdated docs rather than leaving stale content
- Keep docs concise — reviewers appreciate brevity
- One source of truth: code > docs (update docs to match code)

## When NOT to Use AI

- Security-critical decisions (role matrix design)
- Final submission review (human eyes on everything)
- Choosing between valid architectural alternatives
- Deciding what to exclude from scope

## Validation Habit

After every AI-assisted change:

```bash
npm test                  # Backend
npm run test:frontend     # Frontend (if auth/UI changed)
npm run lint              # Style
```

This catch-regressions-first approach saved significant debugging time.
