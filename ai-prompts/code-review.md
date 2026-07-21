# AI Prompts — Code Review

## Prompt Used

> Review frontend for assignment compliance: plain CSS, server-side filter, no duplicate state machine logic.

## AI Response Summary

Flagged Tailwind usage, client-side search, missing ErrorMessage component, and incomplete .gitignore.

## Accepted

- Replace Tailwind with global.css
- Move search to backend API calls
- Extract StatusActions and CommentSection components

## Modified

- Kept react-hook-form + Zod (lightweight, not a UI framework)

## Rejected

- Full rewrite to vanilla forms — react-hook-form adds validation value with minimal weight
