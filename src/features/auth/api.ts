import { apiClient } from '@/services/api-client';
import type {
  LoginRequestDTO,
  RegisterRequestDTO,
  AuthResponseDTO,
} from '@/shared/dtos/auth.dto';

/**
 * Auth API endpoints
 */
export const authApi = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginRequestDTO) => {
    const { data } = await apiClient.post<AuthResponseDTO>(
      '/auth/login',
      credentials
    );
    return data;
  },

  /**
   * Register a new user
   */
  register: async (credentials: RegisterRequestDTO) => {
    const { data } = await apiClient.post<AuthResponseDTO>(
      '/auth/register',
      credentials
    );
    return data;
  },

  /**
   * Refresh the access token
   */
  refreshToken: async (refreshToken: string) => {
    const { data } = await apiClient.post<AuthResponseDTO>('/auth/refresh', {
      refreshToken,
    });
    return data;
  },
};
