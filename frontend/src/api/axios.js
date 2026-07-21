import axios from 'axios';
import { getErrorMessage } from '../utils/errors.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(new Error(getErrorMessage(error))),
);

export default api;
