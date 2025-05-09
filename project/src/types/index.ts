// User types
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

// Ride types
export interface Ride {
  id: number;
  pickupLocation: string;
  dropLocation: string;
  dateTime: string;
  status: RideStatus;
}

export interface RideBookingData {
  pickupLocation: string;
  dropLocation: string;
}

export enum RideStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// Map types
export interface Location {
  lat: number;
  lng: number;
}

export interface RouteData {
  pickup: Location;
  dropoff: Location;
}