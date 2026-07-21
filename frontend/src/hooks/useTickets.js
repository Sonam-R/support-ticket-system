import { useState, useCallback, useRef } from 'react';
import * as ticketService from '../services/ticketService.js';
import { DEFAULT_LIMIT } from '../constants/index.js';

export function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchRequestId = useRef(0);

  const fetchTickets = useCallback(async (params = {}) => {
    const requestId = ++fetchRequestId.current;
    setLoading(true);
    setError(null);

    try {
      const data = await ticketService.getTickets({
        limit: DEFAULT_LIMIT,
        ...params,
      });

      if (requestId !== fetchRequestId.current) {
        return data;
      }

      setTickets(data.tickets);
      setPagination(data.pagination);
      return data;
    } catch (err) {
      if (requestId === fetchRequestId.current) {
        setError(err.message);
      }
      throw err;
    } finally {
      if (requestId === fetchRequestId.current) {
        setLoading(false);
      }
    }
  }, []);

  const refreshTickets = useCallback(
    (params) => fetchTickets(params),
    [fetchTickets],
  );

  const createTicket = useCallback(async (data) => {
    setError(null);
    try {
      const ticket = await ticketService.createTicket(data);
      return ticket;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateTicket = useCallback(async (id, data) => {
    setError(null);
    try {
      const ticket = await ticketService.updateTicket(id, data);
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...ticket } : t)),
      );
      return ticket;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteTicket = useCallback(async (id) => {
    setError(null);
    try {
      await ticketService.deleteTicket(id);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const addComment = useCallback(async (ticketId, data) => {
    setError(null);
    try {
      return await ticketService.addComment(ticketId, data);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const getComments = useCallback(async (ticketId) => {
    setError(null);
    try {
      return await ticketService.getComments(ticketId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    tickets,
    pagination,
    loading,
    error,
    fetchTickets,
    refreshTickets,
    createTicket,
    updateTicket,
    deleteTicket,
    addComment,
    getComments,
  };
}

export function extractUsersFromTickets(tickets) {
  const userMap = new Map();

  tickets.forEach((ticket) => {
    if (ticket.createdBy) {
      userMap.set(ticket.createdBy.id, ticket.createdBy);
    }
    if (ticket.assignedTo) {
      userMap.set(ticket.assignedTo.id, ticket.assignedTo);
    }
  });

  return Array.from(userMap.values());
}
