import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/format.js';
import { getStatusColor, getPriorityColor } from '../../utils/colors.js';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../constants/index.js';

function TicketCard({ ticket }) {
  return (
    <Link
      to={`/tickets/${ticket.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium text-gray-900 line-clamp-1">{ticket.title}</h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(ticket.status)}`}
        >
          {STATUS_LABELS[ticket.status]}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-500 line-clamp-2">{ticket.description}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span
          className={`rounded-full px-2 py-0.5 font-medium ${getPriorityColor(ticket.priority)}`}
        >
          {PRIORITY_LABELS[ticket.priority]}
        </span>
        <span>{formatDate(ticket.createdAt)}</span>
      </div>
    </Link>
  );
}

export default TicketCard;
