import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useUserManagement } from '../hooks/useUserManagement.js';
import UserForm from '../components/UserForm.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { formatDateTime } from '../utils/format.js';
import { ROLE_LABELS } from '../constants/index.js';

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditRoute = location.pathname.endsWith('/edit');

  const {
    selectedUser,
    loading,
    error,
    successMessage,
    fetchUserById,
    updateUser,
    removeUser,
    clearMessages,
  } = useUserManagement();

  const [isEditing, setIsEditing] = useState(isEditRoute);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUserById(id);
  }, [fetchUserById, id]);

  useEffect(() => {
    setIsEditing(isEditRoute);
  }, [isEditRoute]);

  async function handleUpdate(data) {
    setIsSubmitting(true);

    try {
      await updateUser(id, data);
      setIsEditing(false);
      navigate(`/users/${id}`);
    } catch {
      // Error handled by hook
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);

    try {
      await removeUser(id);
      navigate('/users');
    } catch {
      // Error handled by hook
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  }

  if (loading && !selectedUser) {
    return <p className="loading-message">Loading user details...</p>;
  }

  if (!selectedUser && !loading) {
    return (
      <div className="empty-message">
        <h3>User not found</h3>
        <p>The requested user could not be found.</p>
        <Link to="/users" className="btn btn-primary">
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="breadcrumb">
            <Link to="/users">Users</Link> / {selectedUser.name}
          </p>
          <h1 className="page-title">{selectedUser.name}</h1>
          <p className="page-subtitle">{selectedUser.email}</p>
        </div>
        {!isEditing && (
          <div className="page-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/users/${id}/edit`)}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {successMessage && (
        <div className="success-message" role="status">
          {successMessage}
          <button type="button" className="message-dismiss" onClick={clearMessages}>
            Dismiss
          </button>
        </div>
      )}

      <ErrorMessage message={error} />

      {isEditing ? (
        <div className="panel">
          <UserForm
            initialData={selectedUser}
            onSubmit={handleUpdate}
            onCancel={() => {
              setIsEditing(false);
              navigate(`/users/${id}`);
            }}
            isSubmitting={isSubmitting || loading}
            submitLabel="Update User"
          />
        </div>
      ) : (
        <div className="panel">
          <div className="detail-grid">
            <div className="detail-field">
              <span className="detail-label">Name</span>
              <span className="detail-value">{selectedUser.name}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Email</span>
              <span className="detail-value">{selectedUser.email}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Role</span>
              <span className="detail-value">
                <span className="badge badge-role">
                  {ROLE_LABELS[selectedUser.role] || selectedUser.role}
                </span>
              </span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Created</span>
              <span className="detail-value">{formatDateTime(selectedUser.createdAt)}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Last Updated</span>
              <span className="detail-value">{formatDateTime(selectedUser.updatedAt)}</span>
            </div>
          </div>

          {selectedUser.stats && (
            <div className="stats-section">
              <h2 className="section-title">Ticket Statistics</h2>
              <div className="detail-grid">
                <div className="detail-field">
                  <span className="detail-label">Assigned Tickets</span>
                  <span className="detail-value">{selectedUser.stats.assignedTickets}</span>
                </div>
                <div className="detail-field">
                  <span className="detail-label">Created Tickets</span>
                  <span className="detail-value">{selectedUser.stats.createdTickets}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default UserDetails;
