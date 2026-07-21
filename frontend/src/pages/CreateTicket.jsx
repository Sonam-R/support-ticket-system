import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets, extractUsersFromTickets } from '../hooks/useTickets.js';
import TicketForm from '../components/TicketForm.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

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
    return <p className="loading-message">Loading form...</p>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Ticket</h1>
          <p className="page-subtitle">Submit a new support request</p>
        </div>
      </div>

      <ErrorMessage message={submitError || error} />

      <section className="panel">
        <TicketForm
          mode="create"
          users={users}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/tickets')}
          isSubmitting={isSubmitting}
        />
      </section>
    </div>
  );
}

export default CreateTicket;
