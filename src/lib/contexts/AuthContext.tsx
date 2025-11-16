'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi } from '../api/auth';
import { studentsApi } from '../api/students';
import { auth } from '../utils/auth';
import { storage } from '../utils/storage';
import { StudentProfile, RegisterDto } from '@/types/api.types';

interface AuthContextValue {
  user: StudentProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<StudentProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = storage.getToken();
        const storedUser = storage.getUser();

        if (storedToken && storedUser) {
          auth.setToken(storedToken);
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        auth.clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      
      auth.setToken(response.token);
      storage.setUser(response.student);
      
      setToken(response.token);
      setUser(response.student);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: RegisterDto) => {
    try {
      const student = await authApi.register(data);
      
      // After registration, automatically log in
      await login(data.email, data.password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    auth.clearAuth();
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: Partial<StudentProfile>) => {
    if (!user) throw new Error('No user logged in');

    try {
      const updatedUser = await studentsApi.updateStudent(user.studentId, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
      
      storage.setUser(updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
