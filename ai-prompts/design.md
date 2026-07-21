# AI Prompts — Design

## Prompt Used

> Design Express API architecture with route → controller → service → repository layers. Include status state machine for ticket workflow.

## AI Response Summary

Proposed folder structure, response envelope format, and status transition map (OPEN → IN_PROGRESS → RESOLVED → CLOSED).

## Accepted

- Layered architecture pattern
- `allowedTransitions` returned with ticket detail
- Separate PATCH endpoint for status changes
- Centralized error handler and Zod validation middleware

## Modified

- PUT restricted to non-status fields only
- Added CANCELLED transitions from OPEN and IN_PROGRESS

## Rejected

- GraphQL API — REST sufficient for scope
- Event-driven architecture — over-engineered for assignment
