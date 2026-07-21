const { z } = require('zod');

const createCommentSchema = z.object({
  params: z.object({
    ticketId: z.string().uuid('Invalid ticket id'),
  }),
  body: z.object({
    message: z.string().min(1, 'Message is required'),
    userId: z.string().uuid('Invalid userId'),
  }),
});

const getCommentsSchema = z.object({
  params: z.object({
    ticketId: z.string().uuid('Invalid ticket id'),
  }),
});

module.exports = {
  createCommentSchema,
  getCommentsSchema,
};
