import { useState, useCallback, useEffect } from 'react';
import * as userService from '../services/userService.js';

export function useAssignableUsers({ autoFetch = true } = {}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAssignableUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await userService.getAssignableUsers();
      setUsers(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchAssignableUsers();
    }
  }, [autoFetch, fetchAssignableUsers]);

  return { users, loading, error, fetchAssignableUsers };
}
