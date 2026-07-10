import axios from 'axios';
import { API_URL } from '@env'; // injected by react-native-dotenv

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || API_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Token store ───────────────────────────────────────────────────────────────
// In-memory store for the session JWT.
// ⚠️  For production persistence across app restarts, replace this with
//     expo-secure-store or @react-native-async-storage/async-storage.
let _authToken = null;

export const setAuthToken = (token) => {
  _authToken = token;
};

export const clearAuthToken = () => {
  _authToken = null;
};

// ── Request interceptor ───────────────────────────────────────────────────────
// Attaches the Bearer token to every outgoing request when one is available.
api.interceptors.request.use((config) => {
  if (_authToken) {
    config.headers.Authorization = `Bearer ${_authToken}`;
  }
  return config;
});

// ── Response interceptor ──────────────────────────────────────────────────────
// Normalize server error messages so callers only need to handle Error objects.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
