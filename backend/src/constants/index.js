const TICKET_STATUS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED'];
const PRIORITY = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const TICKET_LIST_PRIORITY = ['LOW', 'MEDIUM', 'HIGH'];
const CATEGORY = ['TECHNICAL', 'BILLING', 'ACCOUNT', 'GENERAL', 'OTHER'];
const ROLE = ['ADMIN', 'SUPPORT_AGENT', 'VIEWER'];
const USER_SORT_FIELDS = ['name', 'email', 'role', 'createdAt', 'updatedAt'];
const TICKET_SORT_FIELDS = ['createdAt', 'updatedAt', 'priority', 'status', 'title'];
const SORT_ORDER = ['asc', 'desc'];

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

module.exports = {
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
};
