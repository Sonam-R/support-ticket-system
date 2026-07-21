import { useState, useEffect } from 'react';
import ErrorMessage from './ErrorMessage.jsx';
import { formatDateTime } from '../utils/format.js';

function CommentSection({ comments = [], users = [], onAddComment, isSubmitting = false }) {
  const [message, setMessage] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id || '');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (users.length > 0 && !selectedUserId) {
      const agent = users.find((u) => u.role === 'SUPPORT_AGENT') || users[0];
      setSelectedUserId(agent.id);
    }
  }, [users, selectedUserId]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!message.trim() || !selectedUserId) return;

    setError(null);

    try {
      await onAddComment({
        message: message.trim(),
        userId: selectedUserId,
      });
      setMessage('');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="panel">
      <h2 className="card-title">Comments</h2>

      {comments.length === 0 ? (
        <p className="empty-message">No comments yet.</p>
      ) : (
        <div className="comment-list">
          {comments.map((comment) => (
            <article key={comment.id} className="comment-item">
              <div className="comment-meta">
                <span className="comment-user">
                  {comment.user?.name || 'Unknown'}
                </span>
                <span>{formatDateTime(comment.createdAt)}</span>
              </div>
              <p className="comment-message">{comment.message}</p>
            </article>
          ))}
        </div>
      )}

      <form className="comment-form" onSubmit={handleSubmit}>
        <ErrorMessage message={error} />

        {users.length > 0 && (
          <div className="form-group">
            <label htmlFor="commentUser">Comment as</label>
            <select
              id="commentUser"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="commentMessage">Add comment</label>
          <textarea
            id="commentMessage"
            rows={3}
            placeholder="Write a comment..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || !message.trim()}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </section>
  );
}

export default CommentSection;
