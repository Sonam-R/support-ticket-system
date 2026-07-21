const {
  TICKET_STATUS,
  PRIORITY,
  TICKET_LIST_PRIORITY,
  CATEGORY,
  ROLE,
  USER_SORT_FIELDS,
  TICKET_SORT_FIELDS,
  SORT_ORDER,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} = require('../constants');

const EXAMPLE_VIEWER_ID = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
const EXAMPLE_AGENT_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
const EXAMPLE_TICKET_ID = '550e8400-e29b-41d4-a716-446655440000';
const EXAMPLE_COMMENT_ID = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

const STATUS_WORKFLOW = `
## Allowed status transitions

Primary workflow:

\`\`\`
OPEN → IN_PROGRESS → RESOLVED → CLOSED
\`\`\`

Additional allowed transitions:

\`\`\`
OPEN → CANCELLED
IN_PROGRESS → CANCELLED
\`\`\`

Terminal states (\`CLOSED\`, \`CANCELLED\`) cannot transition to any other status.
Any other transition returns \`400 Bad Request\`.
`.trim();

const errorResponse = (description, message) => ({
  description,
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/ErrorResponse' },
      example: { success: false, message },
    },
  },
});

const successResponse = (schemaRef, example) => ({
  description: 'Successful response',
  content: {
    'application/json': {
      schema: {
        allOf: [
          { $ref: '#/components/schemas/SuccessResponse' },
          {
            type: 'object',
            properties: {
              data: { $ref: schemaRef },
            },
          },
        ],
      },
      example: { success: true, data: example },
    },
  },
});

const userExample = {
  id: EXAMPLE_AGENT_ID,
  name: 'Alex Rivera',
  email: 'alex.rivera@supportdesk.com',
  role: 'SUPPORT_AGENT',
  createdAt: '2026-07-21T10:30:00.000Z',
  updatedAt: '2026-07-21T10:30:00.000Z',
};

const ticketExample = {
  id: EXAMPLE_TICKET_ID,
  title: 'Payment declined at checkout',
  description: 'Customer unable to complete payment using saved card ending in 4242.',
  status: 'OPEN',
  priority: 'HIGH',
  category: 'BILLING',
  createdById: EXAMPLE_VIEWER_ID,
  assignedToId: EXAMPLE_AGENT_ID,
  createdAt: '2026-07-21T10:30:00.000Z',
  updatedAt: '2026-07-21T10:30:00.000Z',
  createdBy: {
    id: EXAMPLE_VIEWER_ID,
    name: 'Jordan Lee',
    email: 'jordan.lee@email.com',
    role: 'VIEWER',
  },
  assignedTo: userExample,
};

const commentExample = {
  id: EXAMPLE_COMMENT_ID,
  message: 'We have escalated this to the billing team and will update you within 24 hours.',
  ticketId: EXAMPLE_TICKET_ID,
  userId: EXAMPLE_AGENT_ID,
  createdAt: '2026-07-21T11:15:00.000Z',
  updatedAt: '2026-07-21T11:15:00.000Z',
  user: userExample,
};

const historyExample = {
  id: '8f3e2c1a-9b7d-4e6f-a1c2-3d4e5f6a7b8c',
  ticketId: EXAMPLE_TICKET_ID,
  action: 'STATUS_CHANGED',
  field: 'status',
  oldValue: 'OPEN',
  newValue: 'IN_PROGRESS',
  performedBy: {
    id: EXAMPLE_AGENT_ID,
    name: 'Alex Rivera',
    email: 'alex.rivera@supportdesk.com',
  },
  createdAt: '2026-07-21T11:00:00.000Z',
};

const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Support Ticket Management API',
    version: '1.0.0',
    description:
      'REST API for managing support tickets, comments, and ticket status workflows.',
  },
  servers: [
    {
      url: 'http://localhost:5001',
      description: 'Local development server',
    },
  ],
  tags: [
    { name: 'Health', description: 'Service health checks' },
    { name: 'Tickets', description: 'Ticket CRUD and status management' },
    { name: 'Comments', description: 'Ticket comment operations' },
    { name: 'Users', description: 'User management and assignment' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        description: 'Returns the current health status of the API service.',
        operationId: 'getHealth',
        responses: {
          200: {
            description: 'Service is running',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthResponse' },
                example: {
                  status: 'OK',
                  message: 'Support Ticket API running',
                },
              },
            },
          },
        },
      },
    },
    '/api/tickets': {
      post: {
        tags: ['Tickets'],
        summary: 'Create ticket',
        description: 'Creates a new support ticket. Status defaults to `OPEN` and priority defaults to `MEDIUM` when omitted.',
        operationId: 'createTicket',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateTicketRequest' },
              example: {
                title: 'Payment declined at checkout',
                description: 'Customer unable to complete payment using saved card ending in 4242.',
                priority: 'HIGH',
                category: 'BILLING',
                createdById: EXAMPLE_VIEWER_ID,
                assignedTo: EXAMPLE_AGENT_ID,
              },
            },
          },
        },
        responses: {
          201: successResponse('#/components/schemas/Ticket', ticketExample),
          400: errorResponse('Validation failed', 'Title must be at least 5 characters'),
          404: errorResponse('Referenced user not found', 'Creator user not found'),
          500: errorResponse('Internal server error', 'Internal server error'),
        },
      },
      get: {
        tags: ['Tickets'],
        summary: 'List tickets',
        description:
          'Returns a paginated list of tickets with optional filtering, search, and sorting.\n\n' +
          '**Combined example:**\n' +
          '`GET /api/tickets?page=2&limit=10&status=OPEN&priority=HIGH&assignedTo=' +
          EXAMPLE_AGENT_ID +
          '&search=payment&sortBy=updatedAt&order=asc`',
        operationId: 'getTickets',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: DEFAULT_PAGE },
            description: 'Page number (1-based)',
            example: 1,
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: MAX_LIMIT, default: DEFAULT_LIMIT },
            description: `Number of tickets per page (max ${MAX_LIMIT})`,
            example: 10,
          },
          {
            name: 'status',
            in: 'query',
            schema: { type: 'string', enum: TICKET_STATUS },
            description: 'Filter by ticket status',
            example: 'OPEN',
          },
          {
            name: 'priority',
            in: 'query',
            schema: { type: 'string', enum: TICKET_LIST_PRIORITY },
            description: 'Filter by priority (`URGENT` is not supported as a list filter)',
            example: 'HIGH',
          },
          {
            name: 'assignedTo',
            in: 'query',
            schema: { type: 'string', format: 'uuid' },
            description: 'Filter by assignee user ID (`assignedToId`)',
            example: EXAMPLE_AGENT_ID,
          },
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
            description: 'Case-insensitive partial match on ticket title or description',
            example: 'payment',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: { type: 'string', enum: TICKET_SORT_FIELDS, default: 'createdAt' },
            description: 'Field to sort results by',
            example: 'createdAt',
          },
          {
            name: 'order',
            in: 'query',
            schema: { type: 'string', enum: SORT_ORDER, default: 'desc' },
            description: 'Sort direction',
            example: 'desc',
          },
        ],
        responses: {
          200: {
            description: 'Paginated ticket list',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/TicketListResponse' },
                      },
                    },
                  ],
                },
                example: {
                  success: true,
                  data: {
                    tickets: [ticketExample],
                    pagination: {
                      page: 1,
                      limit: 10,
                      total: 24,
                      totalPages: 3,
                      hasNext: true,
                      hasPrevious: false,
                    },
                  },
                },
              },
            },
          },
          400: errorResponse('Invalid query parameters', 'Invalid status value'),
          500: errorResponse('Internal server error', 'Internal server error'),
        },
      },
    },
    '/api/tickets/{id}': {
      get: {
        tags: ['Tickets'],
        summary: 'Get ticket by ID',
        description:
          'Returns a single ticket with related creator, assignee, comments, attachments, and allowed status transitions.',
        operationId: 'getTicketById',
        parameters: [{ $ref: '#/components/parameters/TicketId' }],
        responses: {
          200: successResponse('#/components/schemas/TicketDetail', {
            ...ticketExample,
            comments: [commentExample],
            attachments: [],
            allowedTransitions: ['IN_PROGRESS', 'CANCELLED'],
          }),
          400: errorResponse('Invalid ticket ID', 'Invalid ticket id'),
          404: errorResponse('Ticket not found', 'Ticket not found'),
          500: errorResponse('Internal server error', 'Internal server error'),
        },
      },
      put: {
        tags: ['Tickets'],
        summary: 'Update ticket',
        description:
          'Updates one or more ticket fields. At least one field is required. Status cannot be updated here — use `PATCH /api/tickets/{id}/status`.',
        operationId: 'updateTicket',
        parameters: [{ $ref: '#/components/parameters/TicketId' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateTicketRequest' },
              example: {
                title: 'Payment declined — card verification required',
                priority: 'URGENT',
                assignedTo: EXAMPLE_AGENT_ID,
              },
            },
          },
        },
        responses: {
          200: successResponse('#/components/schemas/Ticket', {
            ...ticketExample,
            title: 'Payment declined — card verification required',
            priority: 'URGENT',
          }),
          400: errorResponse('Validation failed', 'At least one field is required for update'),
          404: errorResponse('Ticket or assignee not found', 'Ticket not found'),
          500: errorResponse('Internal server error', 'Internal server error'),
        },
      },
      delete: {
        tags: ['Tickets'],
        summary: 'Delete ticket',
        description: 'Permanently deletes a ticket and its related comments, attachments, and history.',
        operationId: 'deleteTicket',
        parameters: [{ $ref: '#/components/parameters/TicketId' }],
        responses: {
          200: successResponse('#/components/schemas/DeleteTicketResponse', {
            message: 'Ticket deleted successfully',
          }),
          400: errorResponse('Invalid ticket ID', 'Invalid ticket id'),
          404: errorResponse('Ticket not found', 'Ticket not found'),
          500: errorResponse('Internal server error', 'Internal server error'),
        },
      },
    },
    '/api/tickets/{id}/status': {
      patch: {
        tags: ['Tickets'],
        summary: 'Change ticket status',
        description: `Updates the ticket status following the allowed workflow.\n\n${STATUS_WORKFLOW}`,
        operationId: 'changeTicketStatus',
        parameters: [{ $ref: '#/components/parameters/TicketId' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ChangeTicketStatusRequest' },
              example: { status: 'IN_PROGRESS' },
            },
          },
        },
        responses: {
          200: successResponse('#/components/schemas/TicketDetail', {
            ...ticketExample,
            status: 'IN_PROGRESS',
            comments: [commentExample],
            attachments: [],
            allowedTransitions: ['RESOLVED', 'CANCELLED'],
          }),
          400: errorResponse(
            'Invalid status or transition',
            'Cannot transition ticket from OPEN to CLOSED',
          ),
          404: errorResponse('Ticket not found', 'Ticket not found'),
          500: errorResponse('Internal server error', 'Internal server error'),
        },
      },
    },
    '/api/tickets/{ticketId}/history': {
      get: {
        tags: ['Tickets'],
        summary: 'Get ticket activity history',
        description:
          'Returns the audit timeline for a ticket, ordered by newest activity first.',
        operationId: 'getTicketHistory',
        parameters: [{ $ref: '#/components/parameters/TicketIdParam' }],
        responses: {
          200: successResponse('#/components/schemas/TicketHistoryList', [historyExample]),
          400: errorResponse('Invalid ticket ID', 'Invalid ticket id'),
          404: errorResponse('Ticket not found', 'Ticket not found'),
          500: errorResponse('Internal server error', 'Internal server error'),
        },
      },
    },
    '/api/tickets/{ticketId}/comments': {
      post: {
        tags: ['Comments'],
        summary: 'Add comment',
        description: 'Adds a comment to an existing ticket.',
        operationId: 'addComment',
        parameters: [{ $ref: '#/components/parameters/TicketIdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateCommentRequest' },
              example: {
                message:
                  'We have escalated this to the billing team and will update you within 24 hours.',
                userId: EXAMPLE_AGENT_ID,
              },
            },
          },
        },
        responses: {
          201: successResponse('#/components/schemas/Comment', commentExample),
          400: errorResponse('Validation failed', 'Message is required'),
          404: errorResponse('Ticket or user not found', 'Ticket not found'),
          500: errorResponse('Internal server error', 'Internal server error'),
        },
      },
      get: {
        tags: ['Comments'],
        summary: 'Get comments',
        description: 'Returns all comments for a ticket, ordered by creation time (oldest first).',
        operationId: 'getComments',
        parameters: [{ $ref: '#/components/parameters/TicketIdParam' }],
        responses: {
          200: successResponse('#/components/schemas/CommentList', [commentExample]),
          400: errorResponse('Invalid ticket ID', 'Invalid ticket id'),
          404: errorResponse('Ticket not found', 'Ticket not found'),
          500: errorResponse('Internal server error', 'Internal server error'),
        },
      },
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'List users',
        description:
          'Returns a paginated list of active users. Supports search by name or email, sorting, and optional role filtering.',
        operationId: 'getUsers',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: DEFAULT_PAGE },
            description: 'Page number',
            example: DEFAULT_PAGE,
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: MAX_LIMIT, default: DEFAULT_LIMIT },
            description: 'Items per page',
            example: DEFAULT_LIMIT,
          },
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
            description: 'Search by name or email',
            example: 'emma',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: { type: 'string', enum: USER_SORT_FIELDS, default: 'name' },
            description: 'Field to sort by',
            example: 'name',
          },
          {
            name: 'order',
            in: 'query',
            schema: { type: 'string', enum: SORT_ORDER, default: 'asc' },
            description: 'Sort direction',
            example: 'asc',
          },
          {
            name: 'role',
            in: 'query',
            schema: { type: 'string', enum: ROLE },
            description: 'Filter users by role',
            example: 'SUPPORT_AGENT',
          },
        ],
        responses: {
          200: successResponse('#/components/schemas/UserListResponse', {
            users: [userExample],
            pagination: {
              page: 1,
              limit: 10,
              total: 1,
              totalPages: 1,
              hasNext: false,
              hasPrevious: false,
            },
          }),
          400: errorResponse('Validation failed', 'Invalid role value'),
          500: errorResponse('Internal server error', 'Internal server error'),
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Create user',
        description: 'Creates a new user with the specified name, email, and role.',
        operationId: 'createUser',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateUserRequest' },
              example: {
                name: 'Emma Johnson',
                email: 'emma@example.com',
                role: 'SUPPORT_AGENT',
              },
            },
          },
        },
        responses: {
          201: successResponse('#/components/schemas/User', userExample),
          400: errorResponse('Validation failed', 'Name is required'),
          409: errorResponse('Duplicate email', 'A user with this email already exists'),
          500: errorResponse('Internal server error', 'Internal server error'),
        },
      },
    },
    '/api/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get user details',
        description:
          'Returns user information including ticket statistics (assigned and created ticket counts).',
        operationId: 'getUserById',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        responses: {
          200: successResponse('#/components/schemas/UserDetail', {
            ...userExample,
            stats: { assignedTickets: 3, createdTickets: 0 },
          }),
          400: errorResponse('Validation failed', 'Invalid user id'),
          404: errorResponse('User not found', 'User not found'),
          500: errorResponse('Internal server error', 'Internal server error'),
        },
      },
      patch: {
        tags: ['Users'],
        summary: 'Update user',
        description: 'Updates one or more user fields. Email must remain unique.',
        operationId: 'updateUser',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUserRequest' },
              example: {
                name: 'Emma Johnson',
                role: 'ADMIN',
              },
            },
          },
        },
        responses: {
          200: successResponse('#/components/schemas/User', userExample),
          400: errorResponse('Validation failed', 'Invalid user id'),
          404: errorResponse('User not found', 'User not found'),
          409: errorResponse('Duplicate email', 'A user with this email already exists'),
          500: errorResponse('Internal server error', 'Internal server error'),
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete user',
        description:
          'Soft-deletes a user. Assigned tickets are unassigned (`assignedTo = null`). Comments and ticket history are preserved.',
        operationId: 'deleteUser',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        responses: {
          200: successResponse('#/components/schemas/DeleteUserResponse', {
            message: 'User deleted successfully',
          }),
          400: errorResponse('Validation failed', 'Invalid user id'),
          404: errorResponse('User not found', 'User not found'),
          500: errorResponse('Internal server error', 'Internal server error'),
        },
      },
    },
  },
  components: {
    parameters: {
      TicketId: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string', format: 'uuid' },
        description: 'Ticket UUID',
        example: EXAMPLE_TICKET_ID,
      },
      TicketIdParam: {
        name: 'ticketId',
        in: 'path',
        required: true,
        schema: { type: 'string', format: 'uuid' },
        description: 'Ticket UUID',
        example: EXAMPLE_TICKET_ID,
      },
      UserId: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string', format: 'uuid' },
        description: 'User UUID',
        example: EXAMPLE_AGENT_ID,
      },
    },
    schemas: {
      HealthResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'OK' },
          message: { type: 'string', example: 'Support Ticket API running' },
        },
        required: ['status', 'message'],
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', enum: [true] },
          data: { type: 'object' },
        },
        required: ['success', 'data'],
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', enum: [false] },
          message: { type: 'string' },
        },
        required: ['success', 'message'],
      },
      UserSummary: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ROLE },
        },
        required: ['id', 'name', 'email', 'role'],
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ROLE },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
      },
      UserStats: {
        type: 'object',
        properties: {
          assignedTickets: { type: 'integer', minimum: 0 },
          createdTickets: { type: 'integer', minimum: 0 },
        },
        required: ['assignedTickets', 'createdTickets'],
      },
      UserDetail: {
        allOf: [
          { $ref: '#/components/schemas/User' },
          {
            type: 'object',
            properties: {
              stats: { $ref: '#/components/schemas/UserStats' },
            },
            required: ['stats'],
          },
        ],
      },
      UserListResponse: {
        type: 'object',
        properties: {
          users: {
            type: 'array',
            items: { $ref: '#/components/schemas/User' },
          },
          pagination: { $ref: '#/components/schemas/Pagination' },
        },
        required: ['users', 'pagination'],
      },
      CreateUserRequest: {
        type: 'object',
        required: ['name', 'email', 'role'],
        properties: {
          name: { type: 'string', minLength: 1 },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ROLE },
        },
      },
      UpdateUserRequest: {
        type: 'object',
        minProperties: 1,
        properties: {
          name: { type: 'string', minLength: 1 },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ROLE },
        },
      },
      DeleteUserResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'User deleted successfully' },
        },
        required: ['message'],
      },
      TicketStatus: {
        type: 'string',
        enum: TICKET_STATUS,
      },
      Priority: {
        type: 'string',
        enum: PRIORITY,
      },
      Category: {
        type: 'string',
        enum: CATEGORY,
      },
      Ticket: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string', minLength: 5 },
          description: { type: 'string', minLength: 1 },
          status: { $ref: '#/components/schemas/TicketStatus' },
          priority: { $ref: '#/components/schemas/Priority' },
          category: { $ref: '#/components/schemas/Category' },
          createdById: { type: 'string', format: 'uuid' },
          assignedToId: { type: 'string', format: 'uuid', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          createdBy: { $ref: '#/components/schemas/UserSummary' },
          assignedTo: { oneOf: [{ $ref: '#/components/schemas/UserSummary' }, { type: 'null' }] },
        },
        required: [
          'id',
          'title',
          'description',
          'status',
          'priority',
          'category',
          'createdById',
          'createdAt',
          'updatedAt',
          'createdBy',
        ],
      },
      Attachment: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          fileName: { type: 'string' },
          fileUrl: { type: 'string', format: 'uri' },
          fileType: { type: 'string' },
          ticketId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'fileName', 'fileUrl', 'fileType', 'ticketId', 'createdAt'],
      },
      TicketHistory: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          ticketId: { type: 'string', format: 'uuid' },
          action: { type: 'string' },
          field: { type: 'string', nullable: true },
          oldValue: { type: 'string', nullable: true },
          newValue: { type: 'string', nullable: true },
          performedBy: { $ref: '#/components/schemas/UserSummary' },
          createdAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'ticketId', 'action', 'performedBy', 'createdAt'],
      },
      TicketHistoryList: {
        type: 'array',
        items: { $ref: '#/components/schemas/TicketHistory' },
      },
      TicketDetail: {
        allOf: [
          { $ref: '#/components/schemas/Ticket' },
          {
            type: 'object',
            properties: {
              comments: {
                type: 'array',
                items: { $ref: '#/components/schemas/Comment' },
              },
              attachments: {
                type: 'array',
                items: { $ref: '#/components/schemas/Attachment' },
              },
              allowedTransitions: {
                type: 'array',
                items: { $ref: '#/components/schemas/TicketStatus' },
                description: 'Statuses the ticket can transition to from its current status',
              },
            },
            required: ['comments', 'attachments', 'allowedTransitions'],
          },
        ],
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1 },
          limit: { type: 'integer', minimum: 1, maximum: MAX_LIMIT },
          total: { type: 'integer', minimum: 0 },
          totalPages: { type: 'integer', minimum: 0 },
          hasNext: { type: 'boolean' },
          hasPrevious: { type: 'boolean' },
        },
        required: ['page', 'limit', 'total', 'totalPages', 'hasNext', 'hasPrevious'],
      },
      TicketListResponse: {
        type: 'object',
        properties: {
          tickets: {
            type: 'array',
            items: { $ref: '#/components/schemas/Ticket' },
          },
          pagination: { $ref: '#/components/schemas/Pagination' },
        },
        required: ['tickets', 'pagination'],
      },
      CreateTicketRequest: {
        type: 'object',
        required: ['title', 'description', 'category', 'createdById'],
        properties: {
          title: {
            type: 'string',
            minLength: 5,
            description: 'Ticket title (minimum 5 characters)',
          },
          description: {
            type: 'string',
            minLength: 1,
            description: 'Detailed ticket description',
          },
          priority: {
            $ref: '#/components/schemas/Priority',
            description: 'Optional; defaults to MEDIUM in the database',
          },
          category: { $ref: '#/components/schemas/Category' },
          createdById: {
            type: 'string',
            format: 'uuid',
            description: 'UUID of the user creating the ticket',
          },
          assignedTo: {
            type: 'string',
            format: 'uuid',
            nullable: true,
            description: 'Assignee user ID, or null/omitted for unassigned',
          },
        },
      },
      UpdateTicketRequest: {
        type: 'object',
        minProperties: 1,
        properties: {
          title: { type: 'string', minLength: 5 },
          description: { type: 'string', minLength: 1 },
          priority: { $ref: '#/components/schemas/Priority' },
          category: { $ref: '#/components/schemas/Category' },
          assignedTo: {
            type: 'string',
            format: 'uuid',
            nullable: true,
            description: 'Assignee user ID, or null to unassign',
          },
          assignedToId: {
            type: 'string',
            format: 'uuid',
            nullable: true,
            description: 'Deprecated alias for assignedTo',
          },
        },
      },
      ChangeTicketStatusRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { $ref: '#/components/schemas/TicketStatus' },
        },
      },
      DeleteTicketResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Ticket deleted successfully' },
        },
        required: ['message'],
      },
      Comment: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          message: { type: 'string', minLength: 1 },
          ticketId: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          user: { $ref: '#/components/schemas/UserSummary' },
        },
        required: ['id', 'message', 'ticketId', 'userId', 'createdAt', 'updatedAt', 'user'],
      },
      CommentList: {
        type: 'array',
        items: { $ref: '#/components/schemas/Comment' },
      },
      CreateCommentRequest: {
        type: 'object',
        required: ['message', 'userId'],
        properties: {
          message: { type: 'string', minLength: 1 },
          userId: { type: 'string', format: 'uuid' },
        },
      },
    },
  },
};

module.exports = openApiSpec;
