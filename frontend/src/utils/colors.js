export function getStatusClass(status) {
  const map = {
    OPEN: 'badge badge-status-open',
    IN_PROGRESS: 'badge badge-status-in-progress',
    RESOLVED: 'badge badge-status-resolved',
    CLOSED: 'badge badge-status-closed',
    CANCELLED: 'badge badge-status-cancelled',
  };

  return map[status] || 'badge';
}

export function getPriorityClass(priority) {
  const map = {
    LOW: 'badge badge-priority-low',
    MEDIUM: 'badge badge-priority-medium',
    HIGH: 'badge badge-priority-high',
    URGENT: 'badge badge-priority-urgent',
  };

  return map[priority] || 'badge';
}
