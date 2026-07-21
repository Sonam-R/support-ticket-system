export const TICKET_STATUS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED'];

export const PRIORITY = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export const CATEGORY = ['TECHNICAL', 'BILLING', 'ACCOUNT', 'GENERAL', 'OTHER'];

export const STATUS_LABELS = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  CANCELLED: 'Cancelled',
};

export const STATUS_ACTION_LABELS = {
  IN_PROGRESS: 'Move to In Progress',
  CANCELLED: 'Cancel Ticket',
  RESOLVED: 'Resolve Ticket',
  CLOSED: 'Close Ticket',
};

export const PRIORITY_LABELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

export const CATEGORY_LABELS = {
  TECHNICAL: 'Technical',
  BILLING: 'Billing',
  ACCOUNT: 'Account',
  GENERAL: 'General',
  OTHER: 'Other',
};

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;

export const TICKET_LIST_PRIORITY = ['LOW', 'MEDIUM', 'HIGH'];

export const SORT_FIELDS = [
  { value: 'createdAt', label: 'Created Date' },
  { value: 'updatedAt', label: 'Updated Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'status', label: 'Status' },
  { value: 'title', label: 'Title' },
];

export const SORT_ORDERS = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' },
];

export const HISTORY_ACTION_LABELS = {
  TICKET_CREATED: { label: 'Ticket Created', icon: '🟢' },
  TICKET_UPDATED: { label: 'Ticket Updated', icon: '✏️' },
  ASSIGNED: { label: 'Assigned', icon: '👤' },
  UNASSIGNED: { label: 'Unassigned', icon: '👤' },
  PRIORITY_CHANGED: { label: 'Priority Changed', icon: '⬆' },
  STATUS_CHANGED: { label: 'Status Changed', icon: '🔄' },
  COMMENT_ADDED: { label: 'Comment Added', icon: '💬' },
};
