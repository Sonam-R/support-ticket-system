import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTickets } from '../hooks/useTickets.js';
import Loader from '../components/common/Loader.jsx';
import TicketCard from '../components/tickets/TicketCard.jsx';
import Button from '../components/common/Button.jsx';
function Dashboard() {
  const { tickets, loading, error, fetchTickets } = useTickets();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'OPEN').length,
    inProgress: tickets.filter((t) => t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter((t) => t.status === 'RESOLVED').length,
    closed: tickets.filter((t) => t.status === 'CLOSED').length,
  };

  const statCards = [
    { label: 'Total Tickets', value: stats.total, color: 'border-blue-500' },
    { label: 'Open', value: stats.open, color: 'border-blue-500' },
    { label: 'In Progress', value: stats.inProgress, color: 'border-yellow-500' },
    { label: 'Resolved', value: stats.resolved, color: 'border-green-500' },
    { label: 'Closed', value: stats.closed, color: 'border-gray-400' },
  ];

  const recentTickets = tickets.slice(0, 6);

  if (loading) return <Loader message="Loading dashboard..." />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your support tickets
          </p>
        </div>
        <Link to="/tickets/create">
          <Button>Create Ticket</Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-lg border-l-4 bg-white p-5 shadow-sm ${card.color}`}
          >
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Tickets</h2>
          <Link
            to="/tickets"
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View all
          </Link>
        </div>

        {recentTickets.length === 0 ? (
          <p className="text-sm text-gray-500">No tickets yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
