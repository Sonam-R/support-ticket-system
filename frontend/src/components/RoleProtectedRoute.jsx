import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { hasRole } from '../utils/permissions.js';

function RoleProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p className="loading-message">Loading...</p>;
  }

  if (!hasRole(user, ...allowedRoles)) {
    return <Navigate to="/forbidden" replace state={{ from: location }} />;
  }

  return children;
}

export default RoleProtectedRoute;
