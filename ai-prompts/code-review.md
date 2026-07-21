# AI Prompts — Code Review

## Prompt

> Review the project for assignment compliance: plain CSS, server-side filter, no duplicate state machine logic, JWT auth, RBAC, no committed secrets or build artifacts.

## AI Response Summary

Flagged Tailwind usage, client-side search, missing ErrorMessage component, incomplete `.gitignore`, missing auth/RBAC, and outdated documentation.

## Accepted Output

- Replace Tailwind with `global.css`
- Move search to backend API calls
- Extract StatusActions, CommentSection, ErrorMessage components
- Add JWT auth and RoleProtectedRoute
- Update `.gitignore` for secrets and dist
- Remove committed `frontend/dist`

## Modified Output

- Kept react-hook-form + Zod (lightweight, not a UI framework)
- Added `permissions.js` instead of inline role checks
- Added ConfirmDialog for delete confirmations

## Rejected Suggestions

| Suggestion | Reason |
|------------|--------|
| Full rewrite to vanilla forms | react-hook-form adds validation with minimal weight |
| Add Prettier config changes | Existing formatting sufficient |
| Rename all files to TypeScript | Against assignment constraints |
| Remove all console.log from tests | dotenv logs are harmless in test output |

## Reasoning

Review focused on assignment compliance and security. Accepted fixes that aligned with spec; rejected changes that added complexity without clear benefit.
