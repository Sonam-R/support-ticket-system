import { Link } from 'react-router-dom';

function Forbidden() {
  return (
    <div className="panel" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
      <h1 className="page-title">Access Denied</h1>
      <p className="page-subtitle">You do not have permission to view this page.</p>
      <div className="form-actions" style={{ justifyContent: 'center' }}>
        <Link to="/tickets" className="btn btn-primary">
          Back to Tickets
        </Link>
      </div>
    </div>
  );
}

export default Forbidden;
