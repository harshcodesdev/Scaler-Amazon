'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  signInUser: (userData: User, token: string) => void;
  signOutUser: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('amazon-auth-token');
      const storedUser = localStorage.getItem('amazon-auth-user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to load auth from localStorage', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInUser = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('amazon-auth-token', authToken);
    localStorage.setItem('amazon-auth-user', JSON.stringify(userData));
  };

  const signOutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('amazon-auth-token');
    localStorage.removeItem('amazon-auth-user');
  };

  return (
    <AuthContext.Provider value={{ user, token, signInUser, signOutUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}