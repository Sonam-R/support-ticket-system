import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserManagement } from '../hooks/useUserManagement.js';
import { useDebounce } from '../hooks/useDebounce.js';
import ErrorMessage from '../components/ErrorMessage.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { formatDateTime } from '../utils/format.js';
import { ROLE_LABELS, USER_SORT_FIELDS, SORT_ORDERS, DEFAULT_PAGE, DEFAULT_LIMIT } from '../constants/index.js';

const SEARCH_DEBOUNCE_MS = 400;

function UserList() {
  const navigate = useNavigate();
  const {
    users,
    pagination,
    loading,
    error,
    successMessage,
    fetchUsers,
    removeUser,
    clearMessages,
  } = useUserManagement();

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearch = useDebounce(search.trim(), SEARCH_DEBOUNCE_MS);

  const filterParams = useMemo(() => {
    const params = {
      page,
      limit: DEFAULT_LIMIT,
      sortBy,
      order,
    };

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    return params;
  }, [page, debouncedSearch, sortBy, order]);

  useEffect(() => {
    fetchUsers(filterParams);
  }, [fetchUsers, filterParams]);

  const totalPages = pagination?.totalPages ?? 0;
  const currentPage = pagination?.page ?? page;
  const hasPrevious = pagination?.hasPrevious ?? currentPage > 1;
  const hasNext = pagination?.hasNext ?? currentPage < totalPages;

  async function handleDelete() {
    if (!deleteTarget) return;

    setIsDeleting(true);

    try {
      await removeUser(deleteTarget.id);
      setDeleteTarget(null);
      await fetchUsers(filterParams);
    } catch {
      // Error handled by hook
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Create, view, and manage system users</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate('/users/create')}
        >
          Create User
        </button>
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

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="user-search">Search</label>
          <input
            id="user-search"
            type="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(DEFAULT_PAGE);
            }}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="user-sort">Sort By</label>
          <select
            id="user-sort"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(DEFAULT_PAGE);
            }}
          >
            {USER_SORT_FIELDS.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="user-order">Order</label>
          <select
            id="user-order"
            value={order}
            onChange={(e) => {
              setOrder(e.target.value);
              setPage(DEFAULT_PAGE);
            }}
          >
            {SORT_ORDERS.map((sortOrder) => (
              <option key={sortOrder.value} value={sortOrder.value}>
                {sortOrder.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && users.length === 0 ? (
        <p className="loading-message">Loading users...</p>
      ) : users.length === 0 ? (
        <div className="empty-message">
          <h3>No users found</h3>
          <p>Try adjusting your search or create a new user.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/users/create')}
          >
            Create User
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="badge badge-role">{ROLE_LABELS[user.role] || user.role}</span>
                  </td>
                  <td>{formatDateTime(user.createdAt)}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/users/${user.id}`)}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/users/${user.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteTarget(user)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {users.length > 0 && (
        <div className="pagination">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={!hasPrevious || loading}
            onClick={() => setPage((current) => current - 1)}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={!hasNext || loading}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </button>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete User"
        message={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.name}? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default UserList;
