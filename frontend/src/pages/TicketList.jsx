import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTickets } from '../hooks/useTickets.js';
import { useAssignableUsers } from '../hooks/useAssignableUsers.js';
import { useDebounce } from '../hooks/useDebounce.js';
import TicketCard from '../components/TicketCard.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { canManageTickets } from '../utils/permissions.js';
import {
  TICKET_STATUS,
  TICKET_LIST_PRIORITY,
  SORT_FIELDS,
  SORT_ORDERS,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
} from '../constants/index.js';

const STATUS_OPTIONS = ['ALL', ...TICKET_STATUS];
const PRIORITY_OPTIONS = ['ALL', ...TICKET_LIST_PRIORITY];
const SEARCH_DEBOUNCE_MS = 400;

function TicketList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tickets, pagination, loading, error, fetchTickets } = useTickets();
  const { users: assignableUsers } = useAssignableUsers({
    autoFetch: canManageTickets(user),
  });

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [priority, setPriority] = useState('ALL');
  const [assignedTo, setAssignedTo] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(DEFAULT_PAGE);

  const assigneeUsers = useMemo(() => {
    if (canManageTickets(user)) {
      return assignableUsers;
    }

    const assigneesById = tickets.reduce((acc, ticket) => {
      if (ticket.assignedTo) {
        acc[ticket.assignedTo.id] = ticket.assignedTo;
      }
      return acc;
    }, {});

    return Object.values(assigneesById).sort((a, b) => a.name.localeCompare(b.name));
  }, [assignableUsers, tickets, user]);

  const debouncedSearch = useDebounce(search.trim(), SEARCH_DEBOUNCE_MS);

  const resetPage = () => setPage(DEFAULT_PAGE);

  const filterParams = useMemo(() => {
    const params = {
      page,
      limit: DEFAULT_LIMIT,
      sortBy,
      order,
    };

    if (status !== 'ALL') {
      params.status = status;
    }

    if (priority !== 'ALL') {
      params.priority = priority;
    }

    if (assignedTo !== 'ALL') {
      params.assignedTo = assignedTo;
    }

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    return params;
  }, [page, status, priority, assignedTo, debouncedSearch, sortBy, order]);

  useEffect(() => {
    fetchTickets(filterParams);
  }, [fetchTickets, filterParams]);

  const totalPages = pagination?.totalPages ?? 0;
  const currentPage = pagination?.page ?? page;
  const hasPrevious = pagination?.hasPrevious ?? currentPage > 1;
  const hasNext = pagination?.hasNext ?? currentPage < totalPages;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tickets</h1>
          <p className="page-subtitle">Manage and track all support tickets</p>
        </div>
        {canManageTickets(user) && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/tickets/create')}
          >
            Create Ticket
          </button>
        )}
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="search"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              resetPage();
            }}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option === 'ALL' ? 'All' : option.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
              resetPage();
            }}
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option === 'ALL' ? 'All Priorities' : option}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="assignedTo">Assignee</label>
          <select
            id="assignedTo"
            value={assignedTo}
            onChange={(e) => {
              setAssignedTo(e.target.value);
              resetPage();
            }}
          >
            <option value="ALL">All Assignees</option>
            {assigneeUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sortBy">Sort By</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              resetPage();
            }}
          >
            {SORT_FIELDS.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="order">Order</label>
          <select
            id="order"
            value={order}
            onChange={(e) => {
              setOrder(e.target.value);
              resetPage();
            }}
          >
            {SORT_ORDERS.map((sortOrder) => (
              <option key={sortOrder.value} value={sortOrder.value}>
                {sortOrder.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <p className="loading-message">Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <div className="empty-message">
          <h3>No tickets found</h3>
          <p>Try adjusting your search or filters, or create a new ticket.</p>
          {canManageTickets(user) && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/tickets/create')}
            >
              Create Ticket
            </button>
          )}
        </div>
      ) : (
        <div>
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}

          {totalPages > 0 && (
            <div className="pagination">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setPage((prev) => prev - 1)}
                disabled={!hasPrevious || loading}
              >
                &lt; Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!hasNext || loading}
              >
                Next &gt;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TicketList;
