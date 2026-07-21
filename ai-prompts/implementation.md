# AI Prompts — Implementation

## Prompts

### Backend Core
> Build layered Express API with ticket CRUD, comment APIs, pagination, filtering, and Zod validation.

### Authentication
> Add JWT authentication with login endpoint, bcrypt password hashing, and protect write routes.

### User Management
> Implement full user CRUD with soft delete, search, filter, sort, pagination, and assignable users endpoint.

### Ticket History
> Log ticket activity (create, update, assign, status change, comment) to TicketHistory table.

### Frontend
> Build React ticket UI with Login, TicketList, TicketDetails, CreateTicket, UserList pages. Use plain CSS. Server-side search/filter. Role-based UI.

## AI Response Summary

Created controllers, services, repositories, middleware, React pages/components, hooks, and service layer for API calls.

## Accepted Output

- Component structure matching assignment spec
- Debounced search calling backend API
- StatusActions driven by `allowedTransitions`
- AuthContext with ProtectedRoute and RoleProtectedRoute
- TicketHistory timeline component
- UserForm and user management pages

## Modified Output

- Removed Dashboard page (not in spec)
- Added inline edit on ticket detail page
- Improved axios error interceptor with network failure message
- Added `permissions.js` for role checks in UI
- Added ConfirmDialog for destructive actions

## Rejected Suggestions

| Suggestion | Reason |
|------------|--------|
| Material UI / component library | Assignment requires plain CSS |
| Client-side filtering | Backend supports search/filter |
| Complex loading spinners | Kept simple text loading states |
| Redux for state management | React Context sufficient for auth |
| react-query for data fetching | Custom hooks adequate for scope |

## Reasoning

Kept implementation minimal and focused. Each feature built incrementally with tests before moving to the next. AI scaffolding accelerated development; human review ensured code quality and assignment compliance.
