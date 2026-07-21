# Acceptance Criteria

## Purpose

Checklist for verifying the system meets assignment requirements.

## Frontend

| Criteria | Status |
|----------|--------|
| Create ticket works | ✅ |
| List tickets works | ✅ |
| View ticket details works | ✅ |
| Update ticket works | ✅ |
| Status transition UI shows only allowed actions | ✅ |
| Comments view and add work | ✅ |
| Search calls backend API | ✅ |
| Status filter calls backend API | ✅ |
| Error messages display user-friendly text | ✅ |
| Loading and empty states shown | ✅ |

## Backend

| Criteria | Status |
|----------|--------|
| Ticket CRUD APIs work | ✅ |
| Comment APIs work | ✅ |
| Validation returns 400 with messages | ✅ |
| Status state machine enforced | ✅ |
| Integration tests pass | ✅ |

## Repository

| Criteria | Status |
|----------|--------|
| Documentation complete | ✅ |
| Cursor workflow documented | ✅ |
| Secrets excluded via .gitignore | ✅ |
| No committed build artifacts | ✅ |

## Manual Test Steps

1. Start backend and frontend
2. Create a ticket from Create Ticket page
3. Verify it appears in ticket list
4. Search by title keyword
5. Filter by OPEN status
6. Open ticket details
7. Add a comment
8. Transition status using available action buttons
9. Attempt invalid transition via API — confirm 400 error message
