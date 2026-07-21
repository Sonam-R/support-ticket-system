import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../hooks/useTickets.js';
import TicketFilters from '../components/tickets/TicketFilters.jsx';
import TicketTable from '../components/tickets/TicketTable.jsx';
import TicketForm from '../components/tickets/TicketForm.jsx';
import Loader from '../components/common/Loader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Button from '../components/common/Button.jsx';

const defaultFilters = {
  search: '',
  status: 'ALL',
  priority: 'ALL',
};

function Tickets() {
  const navigate = useNavigate();
  const {
    tickets,
    loading,
    error,
    fetchTickets,
    deleteTicket,
    updateTicket,
    refreshTickets,
  } = useTickets();

  const [filters, setFilters] = useState(defaultFilters);
  const [editingTicket, setEditingTicket] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = {};
    if (filters.status && filters.status !== 'ALL') {
      params.status = filters.status;
    }
    fetchTickets(params);
  }, [fetchTickets, filters.status]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        !filters.search ||
        ticket.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(filters.search.toLowerCase());

      const matchesPriority =
        filters.priority === 'ALL' || ticket.priority === filters.priority;

      return matchesSearch && matchesPriority;
    });
  }, [tickets, filters.search, filters.priority]);

  async function handleDelete(ticket) {
    if (!window.confirm(`Delete ticket "${ticket.title}"?`)) return;

    try {
      await deleteTicket(ticket.id);
    } catch {
      // error is set in hook
    }
  }

  async function handleEditSubmit(data) {
    if (!editingTicket) return;

    setIsSubmitting(true);
    try {
      await updateTicket(editingTicket.id, data);
      setEditingTicket(null);
      await refreshTickets(
        filters.status !== 'ALL' ? { status: filters.status } : {},
      );
    } catch {
      // error is set in hook
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all support tickets
          </p>
        </div>
        <Button onClick={() => navigate('/tickets/create')}>Create Ticket</Button>
      </div>

      <TicketFilters filters={filters} onChange={setFilters} />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <Loader message="Loading tickets..." />
      ) : filteredTickets.length === 0 ? (
        <EmptyState
          title="No tickets found"
          description="Try adjusting your filters or create a new ticket."
          actionLabel="Create Ticket"
          onAction={() => navigate('/tickets/create')}
        />
      ) : (
        <TicketTable
          tickets={filteredTickets}
          onDelete={handleDelete}
          onEdit={setEditingTicket}
        />
      )}

      {editingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              Edit Ticket
            </h2>
            <TicketForm
              mode="edit"
              initialData={editingTicket}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingTicket(null)}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Tickets;
