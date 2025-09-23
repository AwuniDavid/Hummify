// In frontend/src/services/api.js

import axios from 'axios';
import { auth } from '../config/firebase';

// --- THIS IS THE FINAL AND MOST IMPORTANT FIX ---
// The baseURL MUST include '/api' to match the backend router configuration in main.py.
const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// This interceptor correctly handles auth tokens and file upload headers.
// It is correct and does not need to be changed.
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// This response interceptor is also correct.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Authentication error (401). Redirecting to login.");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;