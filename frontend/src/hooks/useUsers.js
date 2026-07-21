import { useState, useCallback, useEffect } from 'react';
import * as userService from '../services/userService.js';

export function useUsers({ role, autoFetch = true } = {}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);

      try {
        const data = await userService.getUsers({ limit: 100, ...params, role });
        const users = Array.isArray(data) ? data : data.users;
        setUsers(users);
        return users;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [role],
  );

  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [autoFetch, fetchUsers]);

  return { users, loading, error, fetchUsers };
}

export function getAssignableUsers(users) {
  return users
    .filter((user) => user.role === 'SUPPORT_AGENT' || user.role === 'ADMIN')
    .sort((a, b) => a.name.localeCompare(b.name));
}
