import axios from 'axios';
import { Ride, RideBookingData } from '../types';

// API base URL - change this to your Spring Boot backend URL
const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with base URL and auth header
const rideApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token to all requests
rideApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Book a new ride
export const bookRide = async (rideData: RideBookingData): Promise<Ride> => {
  try {
    const response = await rideApi.post('/rides/book', rideData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to book ride');
    }
    throw error;
  }
};

// Get user's rides
export const getUserRides = async (): Promise<Ride[]> => {
  try {
    const response = await rideApi.get('/rides/my');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch rides');
    }
    throw error;
  }
};

export default rideApi;