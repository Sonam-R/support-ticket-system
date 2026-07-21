import { Link } from 'react-router-dom';
import { formatDate } from '../utils/format.js';
import { getStatusClass, getPriorityClass } from '../utils/colors.js';
import { STATUS_LABELS, PRIORITY_LABELS } from '../constants/index.js';

function TicketCard({ ticket }) {
  return (
    <article className="ticket-card">
      <h3 className="ticket-card-title">{ticket.title}</h3>

      <div className="ticket-card-row">
        <span className="ticket-card-label">Priority:</span>
        <span className={getPriorityClass(ticket.priority)}>
          {PRIORITY_LABELS[ticket.priority]}
        </span>
      </div>

      <div className="ticket-card-row">
        <span className="ticket-card-label">Status:</span>
        <span className={getStatusClass(ticket.status)}>
          {STATUS_LABELS[ticket.status]}
        </span>
      </div>

      <div className="ticket-card-row">
        <span className="ticket-card-label">Assigned:</span>
        <span className="ticket-card-value">
          {ticket.assignedTo?.name || 'Unassigned'}
        </span>
      </div>

      <div className="ticket-card-row">
        <span className="ticket-card-label">Created:</span>
        <span className="ticket-card-value">{formatDate(ticket.createdAt)}</span>
      </div>

      <div className="ticket-card-actions">
        <Link to={`/tickets/${ticket.id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </article>
  );
}

export default TicketCard;
