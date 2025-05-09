import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { setAuthToken } from '../api/authApi';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: User | null;
  token: string | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check for saved token in local storage on app load
    const savedToken = localStorage.getItem('token');
    
    if (savedToken) {
      try {
        // Decode JWT to get user info
        const decodedToken: any = jwtDecode(savedToken);
        
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          // Token expired, log out
          logout();
          return;
        }
        
        // Set token in axios headers
        setAuthToken(savedToken);
        
        // Reconstruct user from token
        const userData: User = {
          id: decodedToken.id,
          name: decodedToken.name,
          email: decodedToken.sub
        };
        
        setUser(userData);
        setToken(savedToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Invalid token', error);
        logout();
      }
    }
  }, []);

  const setAuth = (newToken: string, newUser: User) => {
    setAuthToken(newToken);
    setUser(newUser);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, setAuth, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};