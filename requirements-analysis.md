# Requirements Analysis

## Functional Requirements

### Authentication & Authorization

| ID | Requirement | Implementation |
|----|-------------|----------------|
| FR-01 | User login with email/password | `POST /api/auth/login` returns JWT |
| FR-02 | Protected API routes | `authenticate` middleware on write endpoints |
| FR-03 | Role-based access control | `authorize` middleware with ADMIN, SUPPORT_AGENT, VIEWER |
| FR-04 | Current user profile | `GET /api/auth/me` |

### Tickets

| ID | Requirement | Implementation |
|----|-------------|----------------|
| FR-05 | Create ticket | `POST /api/tickets` (Admin, Support Agent) |
| FR-06 | List tickets with pagination | `GET /api/tickets?page=&limit=` |
| FR-07 | View ticket detail | `GET /api/tickets/:id` with relations |
| FR-08 | Update ticket fields | `PUT /api/tickets/:id` (not status) |
| FR-09 | Change ticket status | `PATCH /api/tickets/:id/status` with state machine |
| FR-10 | Delete ticket | `DELETE /api/tickets/:id` (Admin only) |
| FR-11 | Assign ticket to agent | `assignedTo` / `assignedToId` on create/update |
| FR-12 | Ticket activity history | `GET /api/tickets/:ticketId/history` |

### Comments

| ID | Requirement | Implementation |
|----|-------------|----------------|
| FR-13 | Add comment | `POST /api/tickets/:ticketId/comments` (Admin, Support Agent) |
| FR-14 | List comments | `GET /api/tickets/:ticketId/comments` |

### Users

| ID | Requirement | Implementation |
|----|-------------|----------------|
| FR-15 | Create user | `POST /api/users` (Admin) |
| FR-16 | List users | `GET /api/users` with search, filter, sort, pagination |
| FR-17 | View user detail | `GET /api/users/:id` with ticket stats |
| FR-18 | Update user | `PATCH /api/users/:id` (Admin) |
| FR-19 | Delete user (soft) | `DELETE /api/users/:id` — sets `deletedAt`, unassigns tickets |
| FR-20 | List assignable agents | `GET /api/users/assignable` |

### Search & Filtering

| ID | Requirement | Implementation |
|----|-------------|----------------|
| FR-21 | Keyword search | `?search=` on tickets and users (case-insensitive) |
| FR-22 | Filter by status | `?status=OPEN` on tickets |
| FR-23 | Filter by priority | `?priority=HIGH` on tickets |
| FR-24 | Filter by assignee | `?assignedTo=<uuid>` on tickets |
| FR-25 | Filter by role | `?role=ADMIN` on users |
| FR-26 | Sort results | `?sortBy=&order=` on tickets and users |

## Non-Functional Requirements

| ID | Requirement | Approach |
|----|-------------|----------|
| NFR-01 | Layered backend architecture | Route → Controller → Service → Repository → Prisma |
| NFR-02 | Input validation | Zod schemas on API; React Hook Form + Zod on frontend |
| NFR-03 | Centralized error handling | `errorHandler` middleware with consistent envelope |
| NFR-04 | Security headers | Helmet middleware |
| NFR-05 | Minimal dependencies | No heavy UI frameworks; plain CSS |
| NFR-06 | API documentation | Swagger/OpenAPI at `/api/docs` |
| NFR-07 | Automated testing | Integration, unit, and edge-case tests |
| NFR-08 | Containerization | Docker Compose for local/production-like deployment |
| NFR-09 | CI pipeline | GitHub Actions on push/PR to `main` |
| NFR-10 | Secrets management | `.env` excluded from git; `.env.example` provided |

## Assumptions

- Single-tenant deployment (no multi-organization support)
- Password-based authentication only (no OAuth/SSO)
- File attachments defined in schema but not exposed via API
- JWT stored in `localStorage` on the frontend
- All API timestamps are UTC

## Edge Cases

| Case | Handling |
|------|----------|
| Invalid status transition | 400 with descriptive message |
| Duplicate email on user create/update | 409 conflict |
| Inactive user login | 403 forbidden |
| Expired/invalid JWT | 401 unauthorized |
| Missing auth on protected route | 401 unauthorized |
| Wrong role for action | 403 forbidden |
| Non-existent ticket/user | 404 not found |
| Empty update body | 400 validation error |
| Assignee not found | 400 via Prisma FK or service check |
| Soft-deleted user | Excluded from queries; tickets unassigned on delete |
| Pagination beyond range | Empty array with correct pagination metadata |
| Search with special characters | Trimmed and passed to case-insensitive contains |

## Product Decisions

1. **Status changes via dedicated endpoint** — `PATCH /status` keeps state machine logic isolated from field updates.
2. **Server-side search/filter** — All list filtering delegated to backend to avoid duplicate logic.
3. **Soft delete for users** — Preserves referential integrity; unassigns tickets on deletion.
4. **History as separate endpoint** — `GET /tickets/:id/history` keeps detail response lean.
5. **Plain CSS** — No Tailwind or component libraries per assignment constraints.
6. **Monorepo** — Single root `package.json` with shared Prisma client.

## Out of Scope

- File attachment upload
- Real-time notifications
- AI-powered ticket routing
- Multi-factor authentication
- Email verification
