import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../hooks/useTickets.js';
import { useDebounce } from '../hooks/useDebounce.js';
import TicketCard from '../components/TicketCard.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { TICKET_STATUS } from '../constants/index.js';

const STATUS_OPTIONS = ['ALL', ...TICKET_STATUS];
const SEARCH_DEBOUNCE_MS = 400;

function TicketList() {
  const navigate = useNavigate();
  const { tickets, loading, error, fetchTickets } = useTickets();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const debouncedSearch = useDebounce(search.trim(), SEARCH_DEBOUNCE_MS);

  const filterParams = useMemo(() => {
    const params = {};

    if (status !== 'ALL') {
      params.status = status;
    }

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    return params;
  }, [status, debouncedSearch]);

  useEffect(() => {
    fetchTickets(filterParams);
  }, [fetchTickets, filterParams]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tickets</h1>
          <p className="page-subtitle">Manage and track all support tickets</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate('/tickets/create')}
        >
          Create Ticket
        </button>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="search"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option === 'ALL' ? 'All' : option.replace('_', ' ')}
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
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/tickets/create')}
          >
            Create Ticket
          </button>
        </div>
      ) : (
        <div>
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TicketList;
