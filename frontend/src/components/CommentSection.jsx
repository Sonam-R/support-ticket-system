import { useState } from 'react';
import ErrorMessage from './ErrorMessage.jsx';
import { formatDateTime } from '../utils/format.js';

function CommentSection({
  comments = [],
  canAddComment = false,
  onAddComment,
  isSubmitting = false,
}) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!message.trim()) return;

    setError(null);

    try {
      await onAddComment({ message: message.trim() });
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

      {canAddComment && (
        <form className="comment-form" onSubmit={handleSubmit}>
          <ErrorMessage message={error} />

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
      )}
    </section>
  );
}

export default CommentSection;
