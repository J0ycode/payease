import axios from 'axios';
import { API_URL } from '@env'; // injected by react-native-dotenv

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || API_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — normalize error messages from the server
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
