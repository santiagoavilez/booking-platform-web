import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from './api';
import { useAuthContext } from '@/app/providers/auth.provider';
import type { LoginRequestDTO, RegisterRequestDTO } from '@/shared/dtos/auth.dto';

/**
 * Hook to access authentication state and methods
 */
export function useAuth() {
  const { user, isAuthenticated, isLoading, logout } = useAuthContext();

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
  };
}

/**
 * Hook to handle login mutation
 */
export function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthContext();

  return useMutation({
    mutationFn: (credentials: LoginRequestDTO) => authApi.login(credentials),
    onSuccess: (response) => {
      if (response.success) {
        // Store auth data in context (which also saves to localStorage)
        login(response.data);

        // Redirect to the page they tried to visit or home
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    },
  });
}

/**
 * Hook to handle registration mutation
 */
export function useRegister() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  return useMutation({
    mutationFn: (credentials: RegisterRequestDTO) =>
      authApi.register(credentials),
    onSuccess: (response) => {
      if (response.success) {
        // Auto-login after registration
        login(response.data);
        navigate('/', { replace: true });
      }
    },
  });
}

/**
 * Hook to handle logout
 */
export function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return handleLogout;
}
