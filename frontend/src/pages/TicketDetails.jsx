import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as ticketService from '../services/ticketService.js';
import { useTickets, extractUsersFromTickets } from '../hooks/useTickets.js';
import Loader from '../components/common/Loader.jsx';
import Button from '../components/common/Button.jsx';
import { formatDateTime } from '../utils/format.js';
import { getStatusColor, getPriorityColor } from '../utils/colors.js';
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  CATEGORY_LABELS,
} from '../constants/index.js';

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tickets, fetchTickets, addComment } = useTickets();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentMessage, setCommentMessage] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState(null);

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

  const users = extractUsersFromTickets(tickets);

  useEffect(() => {
    if (users.length > 0 && !selectedUserId) {
      const agent = users.find((u) => u.role === 'AGENT') || users[0];
      setSelectedUserId(agent.id);
    }
  }, [users, selectedUserId]);

  async function handleAddComment(e) {
    e.preventDefault();

    if (!commentMessage.trim() || !selectedUserId) return;

    setIsSubmittingComment(true);
    setCommentError(null);

    try {
      const newComment = await addComment(id, {
        message: commentMessage.trim(),
        userId: selectedUserId,
      });
      setComments((prev) => [...prev, newComment]);
      setCommentMessage('');
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setIsSubmittingComment(false);
    }
  }

  if (loading) return <Loader message="Loading ticket details..." />;

  if (error || !ticket) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || 'Ticket not found'}
        </div>
        <Button variant="secondary" onClick={() => navigate('/tickets')}>
          Back to Tickets
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/tickets" className="hover:text-blue-600">
          Tickets
        </Link>
        <span>/</span>
        <span className="text-gray-900">{ticket.title}</span>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Created {formatDateTime(ticket.createdAt)}
              {ticket.createdBy && ` by ${ticket.createdBy.name}`}
            </p>
          </div>
          <div className="flex gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(ticket.status)}`}
            >
              {STATUS_LABELS[ticket.status]}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityColor(ticket.priority)}`}
            >
              {PRIORITY_LABELS[ticket.priority]}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Category
            </p>
            <p className="mt-1 text-sm text-gray-900">
              {CATEGORY_LABELS[ticket.category]}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Assigned To
            </p>
            <p className="mt-1 text-sm text-gray-900">
              {ticket.assignedTo?.name || 'Unassigned'}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Description
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
            {ticket.description}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Comments</h2>

        {comments.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">No comments yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-lg border border-gray-100 bg-gray-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {comment.user?.name || 'Unknown'}
                    <span className="ml-2 text-xs font-normal text-gray-500">
                      ({comment.user?.role})
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDateTime(comment.createdAt)}
                  </p>
                </div>
                <p className="mt-2 text-sm text-gray-700">{comment.message}</p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAddComment} className="mt-6 space-y-3">
          {commentError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {commentError}
            </div>
          )}

          {users.length > 0 && (
            <div>
              <label
                htmlFor="commentUser"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Comment as
              </label>
              <select
                id="commentUser"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label
              htmlFor="commentMessage"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Add a comment
            </label>
            <textarea
              id="commentMessage"
              rows={3}
              placeholder="Write a comment..."
              value={commentMessage}
              onChange={(e) => setCommentMessage(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <Button type="submit" disabled={isSubmittingComment || !commentMessage.trim()}>
            {isSubmittingComment ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default TicketDetails;
