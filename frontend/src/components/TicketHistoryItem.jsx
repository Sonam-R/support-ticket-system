import { formatDateTime } from '../utils/format.js';
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  HISTORY_ACTION_LABELS,
} from '../constants/index.js';

function formatValue(field, value) {
  if (!value) return null;

  if (field === 'status') {
    return STATUS_LABELS[value] || value;
  }

  if (field === 'priority') {
    return PRIORITY_LABELS[value] || value;
  }

  return value;
}

function getActivityDescription(entry) {
  const performer = entry.performedBy?.name || 'Unknown';

  switch (entry.action) {
    case 'TICKET_CREATED':
      return performer;
    case 'TICKET_UPDATED':
      return performer;
    case 'ASSIGNED':
      return entry.oldValue
        ? `${performer} reassigned from ${entry.oldValue} to ${entry.newValue}`
        : `${performer} assigned to ${entry.newValue}`;
    case 'UNASSIGNED':
      return `${performer} unassigned ${entry.oldValue}`;
    case 'PRIORITY_CHANGED':
      return `${formatValue('priority', entry.oldValue)} → ${formatValue('priority', entry.newValue)}`;
    case 'STATUS_CHANGED':
      return `${formatValue('status', entry.oldValue)} → ${formatValue('status', entry.newValue)}`;
    case 'COMMENT_ADDED':
      return performer;
    default:
      return entry.newValue || performer;
  }
}

function TicketHistoryItem({ entry }) {
  const meta = HISTORY_ACTION_LABELS[entry.action] || entry.action;

  return (
    <article className="history-item">
      <div className="history-header">
        <span className="history-icon" aria-hidden="true">
          {meta.icon}
        </span>
        <div className="history-content">
          <p className="history-title">{meta.label}</p>
          <p className="history-description">{getActivityDescription(entry)}</p>
          <p className="history-meta">{formatDateTime(entry.createdAt)}</p>
        </div>
      </div>
    </article>
  );
}

export default TicketHistoryItem;
