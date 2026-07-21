import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets, extractUsersFromTickets } from '../hooks/useTickets.js';
import TicketForm from '../components/tickets/TicketForm.jsx';
import Loader from '../components/common/Loader.jsx';

function CreateTicket() {
  const navigate = useNavigate();
  const { tickets, loading, error, fetchTickets, createTicket } = useTickets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const users = extractUsersFromTickets(tickets);

  async function handleSubmit(data) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const ticket = await createTicket(data);
      navigate(`/tickets/${ticket.id}`);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading && users.length === 0) {
    return <Loader message="Loading form..." />;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Ticket</h1>
        <p className="mt-1 text-sm text-gray-500">
          Submit a new support request
        </p>
      </div>

      {(error || submitError) && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError || error}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <TicketForm
          mode="create"
          users={users}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/tickets')}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}

export default CreateTicket;
