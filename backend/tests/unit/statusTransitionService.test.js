const AppError = require('../../src/utils/AppError');
const {
  allowedTransitions,
  getAllowedTransitions,
  validateStatusTransition,
} = require('../../src/services/statusTransitionService');

describe('statusTransitionService', () => {
  describe('getAllowedTransitions', () => {
    it.each([
      ['OPEN', ['IN_PROGRESS', 'CANCELLED']],
      ['IN_PROGRESS', ['RESOLVED', 'CANCELLED']],
      ['RESOLVED', ['CLOSED']],
      ['CLOSED', []],
      ['CANCELLED', []],
    ])('returns allowed next statuses for %s', (status, expected) => {
      expect(getAllowedTransitions(status)).toEqual(expected);
    });

    it('returns empty array for unknown status', () => {
      expect(getAllowedTransitions('UNKNOWN')).toEqual([]);
    });
  });

  describe('validateStatusTransition – valid transitions', () => {
    const validTransitions = [
      ['OPEN', 'IN_PROGRESS'],
      ['OPEN', 'CANCELLED'],
      ['IN_PROGRESS', 'RESOLVED'],
      ['IN_PROGRESS', 'CANCELLED'],
      ['RESOLVED', 'CLOSED'],
    ];

    it.each(validTransitions)('allows %s → %s', (from, to) => {
      expect(() => validateStatusTransition(from, to)).not.toThrow();
    });
  });

  describe('validateStatusTransition – invalid transitions', () => {
    const invalidTransitions = [
      ['OPEN', 'CLOSED'],
      ['OPEN', 'RESOLVED'],
      ['IN_PROGRESS', 'OPEN'],
      ['IN_PROGRESS', 'CLOSED'],
      ['RESOLVED', 'OPEN'],
      ['RESOLVED', 'IN_PROGRESS'],
      ['RESOLVED', 'CANCELLED'],
      ['CLOSED', 'OPEN'],
      ['CLOSED', 'IN_PROGRESS'],
      ['CANCELLED', 'OPEN'],
      ['CANCELLED', 'IN_PROGRESS'],
    ];

    it.each(invalidTransitions)('rejects %s → %s', (from, to) => {
      expect(() => validateStatusTransition(from, to)).toThrow(AppError);
      expect(() => validateStatusTransition(from, to)).toThrow(
        `Cannot transition ticket from ${from} to ${to}`,
      );
    });

    it('rejects transition from unknown current status', () => {
      expect(() => validateStatusTransition('INVALID', 'OPEN')).toThrow(AppError);
      expect(() => validateStatusTransition('INVALID', 'OPEN')).toThrow(
        'Invalid current status: INVALID',
      );
    });
  });

  describe('allowedTransitions map', () => {
    it('defines transitions for all terminal and active statuses', () => {
      expect(Object.keys(allowedTransitions)).toEqual([
        'OPEN',
        'IN_PROGRESS',
        'RESOLVED',
        'CLOSED',
        'CANCELLED',
      ]);
    });
  });
});
