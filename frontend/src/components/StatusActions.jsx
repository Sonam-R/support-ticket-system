import ErrorMessage from './ErrorMessage.jsx';
import { STATUS_LABELS, STATUS_ACTION_LABELS } from '../constants/index.js';
import { getStatusClass } from '../utils/colors.js';

function StatusActions({
  status,
  allowedTransitions = [],
  onStatusChange,
  isChanging = false,
  error,
}) {
  return (
    <section className="panel status-section">
      <h2 className="card-title">Ticket Status</h2>

      <div className="detail-field">
        <label>Current Status</label>
        <p>
          <span className={getStatusClass(status)}>{STATUS_LABELS[status]}</span>
        </p>
      </div>

      <ErrorMessage message={error} />

      {allowedTransitions.length > 0 && (
        <div>
          <div className="detail-field">
            <label>Actions</label>
          </div>
          <div className="status-actions">
            {allowedTransitions.map((nextStatus) => (
              <button
                key={nextStatus}
                type="button"
                className={`btn ${nextStatus === 'CANCELLED' ? 'btn-danger' : 'btn-primary'}`}
                disabled={isChanging}
                onClick={() => onStatusChange(nextStatus)}
              >
                {STATUS_ACTION_LABELS[nextStatus] || nextStatus}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default StatusActions;
