import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTickets } from '../hooks/useTickets.js';
import { useAssignableUsers } from '../hooks/useAssignableUsers.js';
import TicketForm from '../components/TicketForm.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

function CreateTicket() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error, createTicket } = useTickets();
  const { users: assignableUsers, loading: usersLoading, error: usersError } = useAssignableUsers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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

  if (usersLoading && assignableUsers.length === 0) {
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

      <ErrorMessage message={submitError || error || usersError} />

      <section className="panel">
        <TicketForm
          mode="create"
          createdById={user?.id}
          assignableUsers={assignableUsers}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/tickets')}
          isSubmitting={isSubmitting}
        />
      </section>
    </div>
  );
}

export default CreateTicket;
