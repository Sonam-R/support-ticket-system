# Requirements Analysis

## Purpose

Capture functional and non-functional requirements for the support ticket system.

## Functional Requirements

1. **Tickets** — Create, list, view, update, delete support tickets
2. **Status workflow** — Enforce valid transitions (OPEN → IN_PROGRESS → RESOLVED → CLOSED; cancel from OPEN/IN_PROGRESS)
3. **Comments** — Add and view comments on tickets
4. **Search & filter** — Search by title/description; filter by status
5. **UI** — Simple ticket list, detail, and create pages

## Non-Functional Requirements

- Layered backend architecture (route → controller → service → repository)
- Input validation on API and forms
- Centralized error handling
- Minimal dependencies; no heavy UI frameworks
- Integration tests for API behavior

## Out of Scope

- Authentication and role-based access control
- File attachments upload
- AI-powered features
- Real-time notifications

## Key Decisions

- Status changes via dedicated `PATCH /status` endpoint (not PUT)
- Search/filter delegated to backend to avoid duplicate logic
- Users selected from existing ticket relations (no users API yet)

## Validation

- Requirements mapped to acceptance-criteria.md and integration tests
