const { z } = require('zod');
const {
  ROLE,
  USER_SORT_FIELDS,
  SORT_ORDER,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} = require('../constants');

const emailSchema = z.string().trim().email('Invalid email format');

const createUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required'),
    email: emailSchema,
    role: z.enum(ROLE, { message: 'Invalid role value' }),
  }),
});

const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user id'),
  }),
  body: z
    .object({
      name: z.string().trim().min(1, 'Name cannot be empty').optional(),
      email: emailSchema.optional(),
      role: z.enum(ROLE, { message: 'Invalid role value' }).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field is required for update',
    }),
});

const getUsersQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(DEFAULT_PAGE),
    limit: z.coerce
      .number()
      .int()
      .positive()
      .max(MAX_LIMIT)
      .default(DEFAULT_LIMIT),
    search: z
      .string()
      .trim()
      .transform((value) => value || undefined)
      .optional(),
    sortBy: z.enum(USER_SORT_FIELDS).default('name'),
    order: z.enum(SORT_ORDER).default('asc'),
    role: z.enum(ROLE, { message: 'Invalid role value' }).optional(),
  }),
});

const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user id'),
  }),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  getUsersQuerySchema,
  userIdParamSchema,
};
