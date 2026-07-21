const { createCommentSchema } = require('../../src/validations/commentValidation');
const VALID_UUID = '00000000-0000-0000-0000-000000000001';

describe('commentValidation schemas', () => {
  describe('createCommentSchema', () => {
    it('accepts valid comment payload', () => {
      const result = createCommentSchema.safeParse({
        params: { ticketId: VALID_UUID },
        body: { message: 'Investigating the issue', userId: VALID_UUID },
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty message', () => {
      const result = createCommentSchema.safeParse({
        params: { ticketId: VALID_UUID },
        body: { message: '', userId: VALID_UUID },
      });
      expect(result.success).toBe(false);
      expect(result.error.errors[0].message).toContain('Message is required');
    });

    it('rejects missing message', () => {
      const result = createCommentSchema.safeParse({
        params: { ticketId: VALID_UUID },
        body: { userId: VALID_UUID },
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid ticket id', () => {
      const result = createCommentSchema.safeParse({
        params: { ticketId: 'invalid' },
        body: { message: 'Comment text', userId: VALID_UUID },
      });
      expect(result.success).toBe(false);
      expect(result.error.errors[0].message).toContain('Invalid ticket id');
    });

    it('rejects invalid userId', () => {
      const result = createCommentSchema.safeParse({
        params: { ticketId: VALID_UUID },
        body: { message: 'Comment text', userId: 'bad-id' },
      });
      expect(result.success).toBe(false);
      expect(result.error.errors[0].message).toContain('Invalid userId');
    });
  });
});
