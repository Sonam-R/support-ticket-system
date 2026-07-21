import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import * as ticketService from '../services/ticketService.js';
import { useTickets, extractUsersFromTickets } from '../hooks/useTickets.js';
import { useAssignableUsers } from '../hooks/useAssignableUsers.js';
import StatusActions from '../components/StatusActions.jsx';
import CommentSection from '../components/CommentSection.jsx';
import TicketHistory from '../components/TicketHistory.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import TicketForm from '../components/TicketForm.jsx';
import { formatDateTime } from '../utils/format.js';
import { getStatusClass, getPriorityClass } from '../utils/colors.js';
import { canManageTickets } from '../utils/permissions.js';
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  CATEGORY_LABELS,
} from '../constants/index.js';

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tickets, fetchTickets, addComment, updateTicket } = useTickets();
  const { users: assignableUsers } = useAssignableUsers({
    autoFetch: canManageTickets(user),
  });

  const canEditTicket = canManageTickets(user);

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusError, setStatusError] = useState(null);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    async function loadTicket() {
      setLoading(true);
      setError(null);

      try {
        const data = await ticketService.getTicketById(id);
        setTicket(data);
        setComments(data.comments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTicket();
  }, [id]);

  useEffect(() => {
    async function loadHistory() {
      setHistoryLoading(true);

      try {
        const data = await ticketService.getTicketHistory(id);
        setHistory(data || []);
      } catch {
        setHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    }

    loadHistory();
  }, [id]);

  async function refreshHistory() {
    try {
      const data = await ticketService.getTicketHistory(id);
      setHistory(data || []);
    } catch {
      setHistory([]);
    }
  }

  const users = extractUsersFromTickets(tickets);

  async function handleStatusChange(newStatus) {
    setIsChangingStatus(true);
    setStatusError(null);

    try {
      const updatedTicket = await ticketService.changeTicketStatus(id, newStatus);
      setTicket(updatedTicket);
      await refreshHistory();
    } catch (err) {
      setStatusError(err.message);
    } finally {
      setIsChangingStatus(false);
    }
  }

  async function handleAddComment(data) {
    setIsSubmittingComment(true);

    try {
      const newComment = await addComment(id, data);
      setComments((prev) => [...prev, newComment]);
      await refreshHistory();
    } finally {
      setIsSubmittingComment(false);
    }
  }

  async function handleUpdate(data) {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      const updated = await updateTicket(id, data);
      setTicket((prev) => ({ ...prev, ...updated }));
      setIsEditing(false);
      await refreshHistory();
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setIsUpdating(false);
    }
  }

  if (loading) {
    return <p className="loading-message">Loading ticket details...</p>;
  }

  if (error || !ticket) {
    return (
      <div>
        <ErrorMessage message={error || 'Ticket not found'} />
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/tickets')}>
          Back to Tickets
        </button>
      </div>
    );
  }

  return (
    <div>
      <nav className="breadcrumb">
        <Link to="/tickets">Tickets</Link>
        <span> / </span>
        <span>{ticket.title}</span>
      </nav>

      <section className="panel">
        <div className="ticket-header">
          <div>
            <h1 className="page-title">{ticket.title}</h1>
            <p className="page-subtitle">
              Created {formatDateTime(ticket.createdAt)}
              {ticket.createdBy && ` by ${ticket.createdBy.name}`}
            </p>
          </div>
          <div className="ticket-badges">
            <span className={getStatusClass(ticket.status)}>
              {STATUS_LABELS[ticket.status]}
            </span>
            <span className={getPriorityClass(ticket.priority)}>
              {PRIORITY_LABELS[ticket.priority]}
            </span>
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-field">
            <label>Priority</label>
            <p>{PRIORITY_LABELS[ticket.priority]}</p>
          </div>
          <div className="detail-field">
            <label>Assigned User</label>
            {ticket.assignedTo ? (
              <>
                <p>{ticket.assignedTo.name}</p>
                <p className="page-subtitle">{ticket.assignedTo.email}</p>
                <p className="page-subtitle">{ticket.assignedTo.role}</p>
              </>
            ) : (
              <p>Unassigned</p>
            )}
          </div>
          <div className="detail-field">
            <label>Category</label>
            <p>{CATEGORY_LABELS[ticket.category]}</p>
          </div>
          <div className="detail-field">
            <label>Current Status</label>
            <p>{STATUS_LABELS[ticket.status]}</p>
          </div>
        </div>

        <div className="description-block">
          <label>Description</label>
          <p>{ticket.description}</p>
        </div>

        <div className="form-actions">
          {canEditTicket && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              {isEditing ? 'Cancel Edit' : 'Edit Ticket'}
            </button>
          )}
        </div>

        {canEditTicket && isEditing && (
          <div style={{ marginTop: '1.5rem' }}>
            <ErrorMessage message={updateError} />
            <TicketForm
              mode="edit"
              initialData={ticket}
              users={assignableUsers}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
              isSubmitting={isUpdating}
            />
          </div>
        )}
      </section>

      {canEditTicket && (
        <StatusActions
          status={ticket.status}
          allowedTransitions={ticket.allowedTransitions || []}
          onStatusChange={handleStatusChange}
          isChanging={isChangingStatus}
          error={statusError}
        />
      )}

      <CommentSection
        comments={comments}
        users={users}
        onAddComment={handleAddComment}
        isSubmitting={isSubmittingComment}
      />

      <TicketHistory history={history} loading={historyLoading} />
    </div>
  );
}

export default TicketDetails;
