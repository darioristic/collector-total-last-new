'use client';

// biome-ignore assist/source/organizeImports: manually organized for better readability
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

// Helper functions for cookie management
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // Use standard cookie setting approach
  const cookieString = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires.toUTCString()}; ${isLocalhost ? '' : 'secure;'} samesite=strict`;
  
  document.cookie = cookieString;
};

const deleteCookie = (name: string) => {
  const cookieString = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  document.cookie = cookieString;
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
  updateUserOrganization: (organizationData: { name: string; logoUrl?: string }) => void;
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
      // Set token and user immediately for better UX
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setLoading(false);
      
      // Verify token in background
      const verifyToken = async () => {
        try {
          const response = await authenticatedFetch('/api/users/profile', {
            method: 'GET'
          }, storedToken);
          
          if (!response.ok) {
            // Token is invalid, clear storage
            setToken(null);
            setUser(null);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            deleteCookie('auth_token');
          }
        } catch {
          // Token verification failed, clear storage
          setToken(null);
          setUser(null);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          deleteCookie('auth_token');
        }
      };
      
      verifyToken();
    } else {
      setLoading(false);
    }
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
      
      // Redirect to login
      window.location.href = '/dashboard/login';
    }
  };

  const updateUserOrganization = (organizationData: { name: string; logoUrl?: string }) => {
    if (user) {
      const updatedUser = {
        ...user,
        organization: {
          id: user.organization?.id || '',
          name: organizationData.name,
        }
      };
      
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      console.log('Updated user organization:', organizationData);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    updateUserOrganization,
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
    headers.Authorization = `Bearer ${authToken}`;
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
    window.location.href = '/dashboard/login';
    throw new Error('Authentication required');
  }
  
  return response;
}
