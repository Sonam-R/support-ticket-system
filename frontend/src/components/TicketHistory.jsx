import TicketHistoryItem from './TicketHistoryItem.jsx';

function TicketHistory({ history = [], loading = false }) {
  return (
    <section className="panel">
      <h2 className="card-title">Activity History</h2>

      {loading ? (
        <p className="loading-message">Loading activity history...</p>
      ) : history.length === 0 ? (
        <p className="empty-message">No activity recorded yet.</p>
      ) : (
        <div className="history-list">
          {history.map((entry) => (
            <TicketHistoryItem key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </section>
  );
}

export default TicketHistory;
