import { useState, useCallback } from 'react';
import * as userService from '../services/userService.js';

export function useUserManagement() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  const fetchUsers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const data = await userService.getUsers(params);
      setUsers(data.users);
      setPagination(data.pagination);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const user = await userService.getUserById(id);
      setSelectedUser(user);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const user = await userService.createUser(data);
      setSuccessMessage('User created successfully');
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const user = await userService.updateUser(id, data);
      setSelectedUser(user);
      setSuccessMessage('User updated successfully');
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeUser = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await userService.deleteUser(id);
      setSuccessMessage('User deleted successfully');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    pagination,
    selectedUser,
    loading,
    error,
    successMessage,
    clearMessages,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    removeUser,
  };
}
