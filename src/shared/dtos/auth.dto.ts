/**
 * User role enumeration
 */
export type UserRole = 'PROFESSIONAL' | 'CLIENT' | 'ADMIN';

/**
 * User data returned from the API
 */
export interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

/**
 * Login request payload
 */
export interface LoginRequestDTO {
  email: string;
  password: string;
}

/**
 * Register request payload
 */
export interface RegisterRequestDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

/**
 * Auth response data from the API
 */
export interface AuthDataDTO {
  token: string;
  expiresAt: number;
  refreshToken: string;
  refreshTokenExpiresAt: number;
  user: UserDTO;
}

/**
 * Full API response wrapper
 */
export interface AuthResponseDTO {
  success: boolean;
  data: AuthDataDTO;
}
