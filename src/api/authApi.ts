import axios from 'axios';
import { LoginData, SignupData, AuthResponse } from '../types';

// API base URL - change this to your Spring Boot backend URL
const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with base URL
const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false // Changed to false since we're handling the token manually
});

// Register a new user
export const signup = async (userData: SignupData): Promise<AuthResponse> => {
  try {
    const response = await authApi.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to sign up';
      throw new Error(errorMessage);
    }
    throw error;
  }
};

// Login user
export const login = async (credentials: LoginData): Promise<AuthResponse> => {
  try {
    const response = await authApi.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to login';
      throw new Error(errorMessage);
    }
    throw error;
  }
};

// Add token to requests
export const setAuthToken = (token: string | null): void => {
  if (token) {
    authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete authApi.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

export default authApi;