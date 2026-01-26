import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { AUTH_STORAGE_KEY } from '@/services/api-client';
import type { AuthDataDTO, UserDTO } from '@/shared/dtos/auth.dto';

interface AuthContextValue {
  user: UserDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: AuthDataDTO) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth provider component that manages authentication state.
 * Stores auth data in localStorage and provides user context.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const authDataString = localStorage.getItem(AUTH_STORAGE_KEY);
        
        if (authDataString) {
          const authData: AuthDataDTO = JSON.parse(authDataString);
          
          // Check if token is expired
          const now = Math.floor(Date.now() / 1000);
          if (authData.expiresAt > now) {
            setUser(authData.user);
          } else {
            // Token expired, clear storage
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback((authData: AuthDataDTO) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    setUser(authData.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context.
 * Must be used within an AuthProvider.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
}
