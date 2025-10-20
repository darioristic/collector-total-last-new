'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// Helper functions for cookie management
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}; secure; samesite=strict`;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organization?: {
    id: string;
    name: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; organizationName?: string }) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Making login request to /api/auth/login');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('Login response status:', response.status);
      
      const data = await response.json();
      console.log('Login response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Login failed`);
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Login failed');
      }
      
      const { user: userData, token: userToken } = data.data;
      
      setUser(userData);
      setToken(userToken);
      
      // Store in localStorage and cookies
      localStorage.setItem('auth_token', userToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      // Set cookie for middleware
      setCookie('auth_token', userToken, 7);
      
      console.log('Login successful, user data stored');
      
    } catch (err) {
      console.error('Login error in useAuth:', err);
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { email: string; password: string; name: string; organizationName?: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Registration failed');
      }
      
      const { user: userData, token: userToken } = result.data;
      
      setUser(userData);
      setToken(userToken);
      
      // Store in localStorage and cookies
      localStorage.setItem('auth_token', userToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      // Set cookie for middleware
      setCookie('auth_token', userToken, 7);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      // Clear cookie
      deleteCookie('auth_token');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
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

// Helper function to make authenticated API calls
export async function authenticatedFetch(url: string, options: RequestInit = {}, token?: string) {
  const authToken = token || localStorage.getItem('auth_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (response.status === 401) {
    // Token expired or invalid, redirect to login
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    deleteCookie('auth_token');
    window.location.href = '/dashboard/login/v2';
    throw new Error('Authentication required');
  }
  
  return response;
}
