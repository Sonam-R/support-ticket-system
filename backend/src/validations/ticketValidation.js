const { z } = require('zod');
const {
  TICKET_STATUS,
  PRIORITY,
  TICKET_LIST_PRIORITY,
  CATEGORY,
  TICKET_SORT_FIELDS,
  SORT_ORDER,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} = require('../constants');

const createTicketSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(1, 'Description is required'),
    priority: z.enum(PRIORITY, { message: 'Invalid priority value' }).optional(),
    category: z.enum(CATEGORY, { message: 'Invalid category value' }),
    createdById: z.string().uuid('Invalid createdById'),
  }),
});

const updateTicketSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid ticket id'),
  }),
  body: z
    .object({
      title: z.string().min(5, 'Title must be at least 5 characters').optional(),
      description: z.string().min(1, 'Description cannot be empty').optional(),
      priority: z.enum(PRIORITY, { message: 'Invalid priority value' }).optional(),
      category: z.enum(CATEGORY, { message: 'Invalid category value' }).optional(),
      assignedToId: z.string().uuid('Invalid assignedToId').nullable().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required for update',
    }),
});

const changeTicketStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid ticket id'),
  }),
  body: z.object({
    status: z.enum(TICKET_STATUS, { message: 'Invalid status value' }),
  }),
});

const getTicketsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(DEFAULT_PAGE),
    limit: z.coerce
      .number()
      .int()
      .positive()
      .max(MAX_LIMIT, `Limit cannot exceed ${MAX_LIMIT}`)
      .default(DEFAULT_LIMIT),
    status: z.enum(TICKET_STATUS, { message: 'Invalid status value' }).optional(),
    priority: z.enum(TICKET_LIST_PRIORITY, { message: 'Invalid priority value' }).optional(),
    assignedTo: z.string().uuid('Invalid assignedTo value').optional(),
    search: z
      .string()
      .trim()
      .transform((value) => value || undefined)
      .optional(),
    sortBy: z.enum(TICKET_SORT_FIELDS, { message: 'Invalid sort field' }).default('createdAt'),
    order: z.enum(SORT_ORDER, { message: 'Invalid sort order' }).default('desc'),
  }),
});

const ticketIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid ticket id'),
  }),
});

module.exports = {
  createTicketSchema,
  updateTicketSchema,
  changeTicketStatusSchema,
  getTicketsQuerySchema,
  ticketIdParamSchema,
};
