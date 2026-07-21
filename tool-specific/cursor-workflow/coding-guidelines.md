# Coding Guidelines

Conventions followed throughout the project.

## Backend

### File Organization

```
backend/src/
├── config/        # Prisma client, Swagger/OpenAPI
├── constants/     # Enums, role arrays, pagination defaults
├── controllers/   # HTTP request/response only
├── services/      # Business logic
├── repositories/  # Prisma queries only
├── routes/        # Endpoint definitions + middleware
├── validations/   # Zod schemas
├── middleware/    # Auth, authorize, validate, errorHandler
└── utils/         # AppError, apiResponse
```

### Naming

- Files: camelCase (`ticketController.js`)
- Functions: camelCase (`createTicket`, `getTickets`)
- Constants: UPPER_SNAKE (`TICKET_STATUS`, `ADMIN_ONLY`)
- Enums: UPPER_SNAKE matching Prisma schema

### Patterns

```javascript
// Controller — thin
const createTicket = async (req, res) => {
  const ticket = await ticketService.createTicket(req.body);
  sendSuccess(res, ticket, 201);
};

// Service — business logic
const createTicket = async (data) => {
  await ensureUserExists(data.createdById);
  const ticket = await ticketRepository.create(data);
  await historyService.logTicketCreated(ticket, data.createdById);
  return ticket;
};

// Route — middleware chain
router.post('/', authenticate, authorize(...TICKET_WRITERS), validate(schema), asyncHandler(controller));
```

### Error Handling

- Throw `AppError` with status code for operational errors
- Let Zod errors propagate to `errorHandler`
- Never expose stack traces in API responses

## Frontend

### File Organization

```
frontend/src/
├── api/           # Axios instance with interceptors
├── components/    # Reusable UI components
├── context/       # AuthContext
├── hooks/         # Data fetching hooks
├── layouts/       # MainLayout
├── pages/         # Route-level components
├── routes/        # AppRoutes
├── services/      # API call functions
├── styles/        # global.css
└── utils/         # Helpers (permissions, errors, format)
```

### Naming

- Components: PascalCase (`TicketList.jsx`)
- Hooks: camelCase with `use` prefix (`useTickets.js`)
- Utils: camelCase (`getErrorMessage`)

### Patterns

```jsx
// Role-gated page
<RoleProtectedRoute allowedRoles={['ADMIN']}>
  <UserList />
</RoleProtectedRoute>

// Permission check in component
{canManageTickets(user) && <button>Create Ticket</button>}

// Data fetching hook
const { tickets, loading, error, refetch } = useTickets(filters);
```

### Styling

- All styles in `frontend/src/styles/global.css`
- Use semantic class names (`.ticket-card`, `.status-badge`)
- No inline styles except dynamic values
- No CSS frameworks or preprocessors

## General

- `async/await` everywhere; wrap route handlers with `asyncHandler`
- Read coerced query params from `req.validated.query`
- API response envelope: `{ success: true, data }` or `{ success: false, message }`
- Prefer existing utilities over new helpers
- Comments only for non-obvious business logic
