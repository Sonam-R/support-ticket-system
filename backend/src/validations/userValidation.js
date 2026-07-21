const { z } = require('zod');
const { ROLE } = require('../constants');

const getUsersQuerySchema = z.object({
  query: z.object({
    role: z.enum(ROLE, { message: 'Invalid role value' }).optional(),
  }),
});

module.exports = {
  getUsersQuerySchema,
};
