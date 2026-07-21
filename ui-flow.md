# UI Flow

## Routes

| Path | Page | Auth | Roles | Description |
|------|------|------|-------|-------------|
| `/login` | Login | Public | — | Email/password login |
| `/` | Redirect | Protected | All | → `/tickets` |
| `/tickets` | TicketList | Protected | All | List, search, filter, sort |
| `/tickets/create` | CreateTicket | Protected | Admin, Agent | New ticket form |
| `/tickets/:id` | TicketDetails | Protected | All | View, edit, status, comments, history |
| `/users` | UserList | Protected | Admin | User list with search/filter |
| `/users/create` | CreateUser | Protected | Admin | New user form |
| `/users/:id` | UserDetails | Protected | Admin | View/edit user |
| `/users/:id/edit` | UserDetails | Protected | Admin | Edit mode |
| `/forbidden` | Forbidden | Protected | All | 403 access denied page |

## Authentication Flow

1. Unauthenticated user visits any protected route
2. `ProtectedRoute` redirects to `/login`
3. User enters email and password
4. `POST /api/auth/login` returns JWT and user object
5. Token stored in `localStorage`; `AuthContext` updated
6. User redirected to `/tickets`
7. Axios interceptor attaches `Authorization: Bearer <token>` to all requests
8. On 401 response, token cleared and user redirected to login

## Dashboard / Ticket List

1. User lands on `/tickets` after login
2. `useTickets` hook fetches `GET /api/tickets` with current filters
3. User types in search box → 300ms debounce → `?search=` query
4. User selects status/priority filter → API refetch with filter params
5. User changes sort field/order → API refetch
6. Pagination controls update `?page=` and `?limit=`
7. **Create Ticket** button visible only for Admin and Support Agent
8. Click **View Details** → navigate to `/tickets/:id`

## Create Ticket Flow

1. Admin/Agent clicks **Create Ticket** (hidden for Viewer)
2. Form fields: title, description, category, priority, created by, assignee
3. Assignee dropdown populated from `GET /api/users/assignable`
4. Client validation via Zod (title min 5 chars, required fields)
5. `POST /api/tickets` → redirect to ticket detail page
6. Viewer accessing `/tickets/create` directly → redirected to `/forbidden`

## Ticket Detail Flow

1. `GET /api/tickets/:id` loads ticket with `allowedTransitions`
2. Display: title, description, status badge, priority, category, creator, assignee
3. **Edit Ticket** (Admin/Agent) toggles inline form → `PUT /api/tickets/:id`
4. **Status Actions** renders buttons from `allowedTransitions` only
5. Status button click → `PATCH /api/tickets/:id/status`
6. Invalid transition → inline error message
7. **Comments** section lists existing; form posts `POST /comments` (authenticated)
8. **Activity Timeline** fetches `GET /api/tickets/:id/history`
9. **Delete Ticket** button visible only for Admin

## User Management Flow (Admin Only)

1. Admin clicks **Users** in navigation
2. `UserList` fetches `GET /api/users` with search, role filter, sort, pagination
3. **Create User** → `/users/create` form → `POST /api/users`
4. Click user row → `/users/:id` detail with ticket stats
5. Edit mode → `PATCH /api/users/:id`
6. Delete with confirmation dialog → `DELETE /api/users/:id` (soft delete)
7. Non-admin accessing `/users` → redirected to `/forbidden`

## Authorization in UI

| Element | Admin | Support Agent | Viewer |
|---------|-------|---------------|--------|
| Nav: Tickets | ✅ | ✅ | ✅ |
| Nav: Users | ✅ | ❌ | ❌ |
| Create Ticket button | ✅ | ✅ | ❌ |
| Edit ticket | ✅ | ✅ | ❌ |
| Status actions | ✅ | ✅ | ❌ |
| Add comment | ✅ | ✅ | ❌ |
| Delete ticket | ✅ | ❌ | ❌ |
| User management | ✅ | ❌ | ❌ |

Enforced by `permissions.js`, `RoleProtectedRoute`, and conditional rendering in components.

## Error States

| Scenario | UI Behavior |
|----------|-------------|
| API failure | `ErrorMessage` banner at top of page |
| Invalid status transition | Inline error in status section |
| Validation error | Form field errors or banner message |
| Empty ticket list | "No tickets found" with create link (if permitted) |
| Empty user list | "No users found" message |
| 403 forbidden route | Redirect to `/forbidden` page |
| Network error | "Unable to connect to server" via axios interceptor |

## Logout

Navigation includes logout action that clears token from `localStorage`, resets `AuthContext`, and redirects to `/login`.
